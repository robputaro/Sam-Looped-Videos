(function(){
  function addStyles(){
    const style=document.createElement('style');
    style.textContent=`
      .backend-panel{margin:0 0 18px;padding:14px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(0,0,0,.16);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}
      .backend-row{display:flex;align-items:center;justify-content:space-between;gap:10px}.backend-title{font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#8e94a4}.backend-state{font-size:9px;font-weight:900}.backend-state.ok{color:#8be3c0}.backend-state.warn{color:#f0e659}.backend-state.off{color:#8e94a4}.backend-copy{font-size:10px;line-height:1.45;color:#8e94a4;margin:8px 0 10px}.backend-form{display:flex;gap:7px}.backend-form input{min-width:0;flex:1;padding:9px 10px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:#080a0f;color:#fff;font:600 10px inherit}.backend-form button,.backend-signout{border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:9px 10px;background:transparent;color:#fff;font:800 9px inherit;cursor:pointer}.backend-msg{font-size:9px;line-height:1.4;color:#8e94a4;margin-top:8px;min-height:12px}
      .backend-panel.compact{max-width:480px;margin:28px 0 0;background:#11141c}
    `;
    document.head.appendChild(style);
  }

  function panelMarkup(compact=false){
    const p=document.createElement('div');
    p.className='backend-panel'+(compact?' compact':'');
    p.innerHTML=`<div class="backend-row"><div class="backend-title">Shared content state</div><div class="backend-state off" data-backend-state>LOCAL ONLY</div></div><div class="backend-copy" data-backend-copy>Recorded status and copy edits are stored in this browser until the shared backend is connected.</div><div class="backend-form" data-backend-form><input type="email" placeholder="Sam / team email" data-backend-email><button type="button" data-backend-login>Send sign-in link</button></div><button type="button" class="backend-signout" data-backend-signout style="display:none">Sign out</button><div class="backend-msg" data-backend-msg></div>`;
    return p;
  }

  function mount(){
    addStyles();
    const studio=document.querySelector('.studio');
    let panel;
    if(studio){
      panel=panelMarkup(false);
      const anchor=studio.querySelector('.brand,.desc');
      if(anchor?.nextSibling) studio.insertBefore(panel,anchor.nextSibling); else studio.prepend(panel);
    }else{
      const wrap=document.querySelector('.wrap,main,body');
      panel=panelMarkup(true);
      const grid=document.querySelector('.grid');
      if(grid) grid.parentNode.insertBefore(panel,grid); else wrap.appendChild(panel);
    }
    bind(panel);
  }

  function bind(panel){
    const stateEl=panel.querySelector('[data-backend-state]');
    const copyEl=panel.querySelector('[data-backend-copy]');
    const form=panel.querySelector('[data-backend-form]');
    const email=panel.querySelector('[data-backend-email]');
    const login=panel.querySelector('[data-backend-login]');
    const logout=panel.querySelector('[data-backend-signout]');
    const msg=panel.querySelector('[data-backend-msg]');

    function paint(){
      const s=window.LoopedBackend?.status?.() || { configured:false,signedIn:false };
      if(!s.configured){
        stateEl.textContent='SETUP NEEDED'; stateEl.className='backend-state warn';
        copyEl.textContent='Backend files are included, but Supabase credentials have not been added yet. Local fallback remains active.';
        form.style.display='none'; logout.style.display='none'; return;
      }
      if(s.signedIn){
        stateEl.textContent='SYNCED'; stateEl.className='backend-state ok';
        copyEl.textContent=`Shared across devices as ${s.email}. Recorded status and copy edits save to the team workspace.`;
        form.style.display='none'; logout.style.display='inline-block';
      }else{
        stateEl.textContent='SIGNED OUT'; stateEl.className='backend-state off';
        copyEl.textContent='Sign in with an invited email to sync recorded status and copy edits across devices.';
        form.style.display='flex'; logout.style.display='none';
      }
    }

    login.onclick=async()=>{
      msg.textContent='Sending sign-in link…';
      try{ await window.LoopedBackend.signInWithEmail(email.value); msg.textContent='Check your email for the secure sign-in link.'; }
      catch(err){ msg.textContent=err.message || 'Could not send sign-in link.'; }
    };
    logout.onclick=async()=>{ await window.LoopedBackend.signOut(); msg.textContent='Signed out. Local fallback remains available.'; paint(); };
    window.addEventListener('looped-backend-ready', paint);
    window.addEventListener('looped-backend-auth', paint);
    window.addEventListener('looped-backend-error', e=>{msg.textContent=e.detail?.message||'Sync error';});
    paint();
  }

  document.addEventListener('DOMContentLoaded', async()=>{
    mount();
    await window.LoopedBackend?.init?.();
  });
})();
