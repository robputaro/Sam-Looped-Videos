(function(){
  const cfg = window.LOOPED_BACKEND_CONFIG || {};
  const configured = Boolean(
    cfg.supabaseUrl &&
    cfg.supabasePublishableKey &&
    !String(cfg.supabaseUrl).includes('YOUR_PROJECT') &&
    !String(cfg.supabasePublishableKey).includes('YOUR_SUPABASE')
  );
  const workspaceId = cfg.workspaceId || 'looped-content-studio';
  let client = null;
  let session = null;
  let initialized = false;
  const debounceTimers = new Map();

  function emit(name, detail){
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function localKey(namespace, stateKey){
    return `looped_backend_fallback:${workspaceId}:${namespace}:${stateKey}`;
  }

  function localRead(namespace, stateKey, fallback){
    try {
      const raw = localStorage.getItem(localKey(namespace, stateKey));
      return raw == null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function localWrite(namespace, stateKey, value){
    try { localStorage.setItem(localKey(namespace, stateKey), JSON.stringify(value)); } catch (_) {}
  }

  async function init(){
    if(initialized) return api.status();
    initialized = true;
    if(!configured || !window.supabase?.createClient){
      emit('looped-backend-ready', api.status());
      return api.status();
    }
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data } = await client.auth.getSession();
    session = data?.session || null;
    client.auth.onAuthStateChange((_event, nextSession) => {
      session = nextSession || null;
      emit('looped-backend-auth', api.status());
      emit('looped-backend-ready', api.status());
    });
    emit('looped-backend-ready', api.status());
    return api.status();
  }

  function status(){
    return {
      configured,
      initialized,
      signedIn: Boolean(session?.user),
      email: session?.user?.email || null,
      userId: session?.user?.id || null,
      workspaceId
    };
  }

  async function signInWithEmail(email){
    if(!configured) throw new Error('Backend is not configured yet.');
    if(!client) await init();
    const trimmed = String(email || '').trim();
    if(!trimmed) throw new Error('Enter an email address.');
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await client.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: redirectTo }
    });
    if(error) throw error;
    return true;
  }

  async function signOut(){
    if(client) await client.auth.signOut();
    session = null;
    emit('looped-backend-auth', api.status());
  }

  async function load(namespace, stateKey, fallback){
    const localFallback = localRead(namespace, stateKey, fallback);
    if(!configured || !session?.user || !client) return localFallback;
    const { data, error } = await client
      .from('presentation_state')
      .select('value,updated_at')
      .eq('workspace_id', workspaceId)
      .eq('namespace', namespace)
      .eq('state_key', stateKey)
      .maybeSingle();
    if(error) throw error;
    if(data){
      localWrite(namespace, stateKey, data.value);
      return data.value;
    }
    // First authenticated use: migrate the local fallback into the shared store.
    if(localFallback !== undefined && localFallback !== null){
      await save(namespace, stateKey, localFallback);
      return localFallback;
    }
    return fallback;
  }

  async function save(namespace, stateKey, value){
    localWrite(namespace, stateKey, value);
    if(!configured || !session?.user || !client) return { remote:false };
    const row = {
      workspace_id: workspaceId,
      namespace,
      state_key: stateKey,
      value,
      updated_by: session.user.id,
      updated_at: new Date().toISOString()
    };
    const { error } = await client
      .from('presentation_state')
      .upsert(row, { onConflict: 'workspace_id,namespace,state_key' });
    if(error) throw error;
    emit('looped-backend-saved', { namespace, stateKey });
    return { remote:true };
  }

  function saveDebounced(namespace, stateKey, value, delay=450){
    localWrite(namespace, stateKey, value);
    const k = `${namespace}:${stateKey}`;
    clearTimeout(debounceTimers.get(k));
    debounceTimers.set(k, setTimeout(() => {
      save(namespace, stateKey, value).catch(err => emit('looped-backend-error', { message: err.message }));
    }, delay));
  }

  const api = {
    configured: () => configured,
    init,
    status,
    signInWithEmail,
    signOut,
    load,
    save,
    saveDebounced
  };
  window.LoopedBackend = api;
})();
