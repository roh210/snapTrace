import { CatStateMachine } from './cat-state.js';

// onAppBoot — fires at module load (DOM is ready because app.js is defer)
CatStateMachine.set('initial_loading');

const longUrlInput = document.querySelector('#longUrl');
const urlForm = document.querySelector('#urlForm');
const copyBtn = document.querySelector('#copy');
const resultEl = document.querySelector('#result');
const errorEl = document.querySelector('#error');

// onUIReady
window.addEventListener('load', () => {
  CatStateMachine.set('wave');
  CatStateMachine.startIdleTimer();
});

// URL input focus → peek
longUrlInput.addEventListener('focus', () => CatStateMachine.set('peek'));

// URL input blur → begin idle countdown
longUrlInput.addEventListener('blur', () => CatStateMachine.startIdleTimer());

// Form submit → loading (parallel to existing handler — does not call preventDefault)
urlForm.addEventListener('submit', () => CatStateMachine.set('loading'));

// Success: detected when showResult() sets #result display:block
const resultObserver = new MutationObserver(() => {
  if (resultEl.style.display === 'block') {
    CatStateMachine.set('success');
    setTimeout(() => CatStateMachine.set('idle'), 1200);
  }
});
resultObserver.observe(resultEl, { attributes: true, attributeFilter: ['style'] });

// Error: detected when showError() sets #error display:block
const errorObserver = new MutationObserver(() => {
  if (errorEl.style.display === 'block') {
    CatStateMachine.set('error');
  }
});
errorObserver.observe(errorEl, { attributes: true, attributeFilter: ['style'] });

// Copy clicked → success, then idle after 1.2s (parallel to existing clipboard handler)
copyBtn.addEventListener('click', () => {
  CatStateMachine.set('success');
  setTimeout(() => CatStateMachine.set('idle'), 1200);
});

// Page visibility → pause / resume animations
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    CatStateMachine.pauseAnimation();
  } else {
    CatStateMachine.resumeAnimation();
  }
});
