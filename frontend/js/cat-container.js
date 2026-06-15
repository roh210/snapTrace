import { CatStateMachine } from './cat-state.js';

// ── State config ──────────────────────────────────────────────────────────────
// To add a new state: add an entry here, add sprites to snapcat/[state]/frame-N.png,
// and call CatStateMachine.set('[state]') in cat-wiring.js. No other changes needed.
//
// anchorClass: CSS class for a custom corner position (null = default bottom-right).
//              Add the position rules to styles.css — no JS changes required.
const CAT_CONFIG = {
  initial_loading: { frames: [1,2,1,3,1], loop: true,  durationRange: [1200,1600], visible: false, extraClass: null,              anchorClass: null },
  wave:            { frames: [1,2,3,2],   loop: true,  durationRange: [800,1000],  visible: true,  extraClass: null,              anchorClass: null },
  peek:            { frames: [1,2,1,1],   loop: true,  durationRange: [400,600],   visible: true,  extraClass: null,              anchorClass: null },
  loading:         { frames: [1,2,3,2],   loop: true,  durationRange: [700,1000],  visible: true,  extraClass: null,              anchorClass: null },
  success:         { frames: [1,2],       loop: false, durationRange: [250,300],   visible: true,  extraClass: null,              anchorClass: null },
  error:           { frames: [1,2,1,2],   loop: true,  durationRange: [300,400],   visible: true,  extraClass: 'cat-anim-shake', anchorClass: null },
  idle:            { frames: [1,2],       loop: true,  durationRange: [1200,1500], visible: false, extraClass: null,              anchorClass: null },
};

// ── Boot screen ───────────────────────────────────────────────────────────────
const bootEl       = document.getElementById('cat-boot');
const bootSpriteEl = document.getElementById('cat-boot__sprite');

const BOOT_MIN_MS  = 1200;
const BOOT_FRAMES  = [1, 2, 1, 3, 1];

let bootStartTime = 0;
let bootRafId     = null;
let bootDismissed = false;

function startBootAnimation() {
  bootStartTime = performance.now();
  if (!bootEl || !bootSpriteEl) return;

  let frameIndex    = 0;
  let lastFrameTime = 0;
  const frameDurationMs = 1200 + Math.random() * 400;

  bootSpriteEl.src = `snapcat/initial_loading/frame-${BOOT_FRAMES[0]}.png`;

  function bootTick(timestamp) {
    if (timestamp - lastFrameTime >= frameDurationMs) {
      lastFrameTime = timestamp;
      frameIndex    = (frameIndex + 1) % BOOT_FRAMES.length;
      bootSpriteEl.src = `snapcat/initial_loading/frame-${BOOT_FRAMES[frameIndex]}.png`;
    }
    bootRafId = requestAnimationFrame(bootTick);
  }
  bootRafId = requestAnimationFrame(bootTick);
}

function dismissBoot() {
  if (!bootEl || bootDismissed) return;
  bootDismissed = true;

  const elapsed = performance.now() - bootStartTime;
  const holdMs  = Math.max(0, BOOT_MIN_MS - elapsed);

  setTimeout(() => {
    if (bootRafId !== null) { cancelAnimationFrame(bootRafId); bootRafId = null; }
    bootEl.classList.add('cat-boot--out');
    setTimeout(() => { if (bootEl.parentNode) bootEl.remove(); }, 650);
  }, holdMs);
}

// ── Corner cat element ────────────────────────────────────────────────────────
const catEl = document.createElement('div');
catEl.className = 'snap-cat cat-hide';
const catSprite = document.createElement('img');
catSprite.className = 'snap-cat__sprite';
catSprite.draggable = false;
catSprite.alt = '';
catEl.appendChild(catSprite);
document.querySelector('.phone').appendChild(catEl);

let rafId = null;

function startAnimation(state) {
  if (state === 'initial_loading') startBootAnimation();
  if (state === 'wave')            dismissBoot();

  const config = CAT_CONFIG[state];
  if (!config) return;

  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }

  const visClass    = config.visible     ? 'cat-show'                : 'cat-hide';
  const extraClass  = config.extraClass  ? ' ' + config.extraClass   : '';
  const anchorClass = config.anchorClass ? ' ' + config.anchorClass  : '';
  catEl.className   = `snap-cat ${visClass}${extraClass}${anchorClass}`;
  catSprite.src     = `snapcat/${state}/frame-${config.frames[0]}.png`;

  if (!config.visible) return;

  const { frames, loop, durationRange } = config;
  const frameDurationMs = durationRange[0]
    + Math.random() * (durationRange[1] - durationRange[0]);
  let frameIndex    = 0;
  let lastFrameTime = 0;

  function tick(timestamp) {
    if (timestamp - lastFrameTime >= frameDurationMs) {
      lastFrameTime = timestamp;
      if (frameIndex < frames.length - 1)  { frameIndex++; }
      else if (loop)                        { frameIndex = 0; }
      else                                  { rafId = null; return; }
      catSprite.src = `snapcat/${state}/frame-${frames[frameIndex]}.png`;
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

// ── Wire events ───────────────────────────────────────────────────────────────
startAnimation(CatStateMachine.get());
document.addEventListener('catStateChange', (e) => startAnimation(e.detail));
