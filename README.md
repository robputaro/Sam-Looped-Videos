# Looped Presentation Systems — V6

Three recurring presentation formats for Sam / Looped.

## V6 slide copy editor
All three presentation formats now include a Studio-side **Edit slide copy** panel.

- Choose any slide from the editor dropdown.
- Edit the visible headline, support copy, labels, decision wording, journey steps, or patient-facing text available on that slide.
- Edits are saved in browser localStorage.
- Clinic Signal overrides are shared across its four visual interfaces, so changing the interface does not change the wording.
- Operator Call overrides are stored separately per case.
- Journey Replay overrides are stored separately per journey.
- Reset a single line, reset the current slide, or reset the whole case/journey to return to the preloaded copy.

A custom override intentionally freezes that line. Resetting it restores the dynamic/default wording generated from the underlying presentation data.

## 1. Clinic Signal
One shared retention-lift presentation engine with four switchable visual interfaces:
- Signal Room
- Founder Board
- Field Notes
- Diagnostic Scan

The inputs, calculations, beat sequence, and takeaway remain identical while the interface changes. Sam can press 1–4 or C during presentation to change the visual treatment without changing the story.

### V5 portrait fix
9:16 is now a true vertical composition. Typography, graphics, patient tokens, metric cards, bars, and spacing use the 9:16 stage width rather than the browser viewport, so the presentation can be cut to full-screen in a vertical video without text or graphics running outside the frame.

## 2. Patient Journey Replay
A recurring journey-story format: baseline journey → break → replay → patient-facing view → operator takeaway.

### Preloaded library: 13 journeys
- Treatment → Rebook
- Lead → Consult
- Booking → Arrival
- Treatment → Aftercare
- Consult → Treatment Decision
- Treatment Series → Completion
- First Visit → Second Visit
- Lapsed → Reactivated
- No-show → Recovered
- Treatment A → Relevant Treatment B
- Membership → Continued Value
- Great Result → Referral
- Great Experience → Review

Each journey includes its complete presentation language: hook, five baseline moments, break diagnosis, replay language, five improved moments, patient-facing phone content, and takeaway.

The sidebar supports category filtering, Next Unused, and locally saved Mark Recorded status.

## 3. The Operator Call
A recurring founder/operator decision format: scenario → facts → A/B/C decision → Sam's call → reasoning → operator principle / optional product bridge.

### Preloaded library: 14 cases
Cases span acquisition, conversion, retention, reactivation, capacity, patient growth, advocacy, and operational problems. Product bridges are intentionally omitted where a Looped connection would feel forced.

The sidebar supports category filtering, Next Unused, and locally saved Mark Recorded status. A/B/C can be selected by clicking or using the keyboard on the decision frame.

## Controls
- Right arrow / Space: next beat
- Left arrow: previous beat
- Escape: leave presentation
- Clinic Signal: 1–4 switch styles; C cycles styles
- Operator Call decision beat: A/B/C selects the answer

All three support Studio → Presentation → Fullscreen and 16:9 / 9:16 / 1:1.
