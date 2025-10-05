export function setupControls(Registry, getGrid) {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") Registry.next();
    if (e.key === "ArrowLeft") Registry.prev();
  });

  // Optional auto-cycle every 10s
  // setInterval(() => Registry.next(), 10000);
}
