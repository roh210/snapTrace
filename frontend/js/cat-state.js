const CatStateMachine = (() => {
  let current = "initial_loading";
  let idleTimer = null;
  let isPaused = false;

  function set(newState) {
    if (isPaused) return;
    current = newState;
    console.log("[CatState]", newState);
    document.dispatchEvent(
      new CustomEvent("catStateChange", { detail: newState })
    );
  }

  function pauseAnimation() {
    isPaused = true;
    console.log("[CatState] paused");
  }

  function resumeAnimation() {
    isPaused = false;
    console.log("[CatState] resumed →", current);
    document.dispatchEvent(
      new CustomEvent("catStateChange", { detail: current })
    );
  }

  function startIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => set("idle"), 5000);
  }

  return { set, get: () => current, pauseAnimation,
           resumeAnimation, startIdleTimer };
})();

export { CatStateMachine };
