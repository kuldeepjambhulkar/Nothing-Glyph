import { generateGrid } from "./grid.js";
import { drawDot, clearCanvas, resizeCanvas } from "./renderer.js";
import { AnimationRegistry, getCurrentAnim } from "./engine.js";
import { setupControls } from "./controller.js";

import { neuralSparks } from "./animations/neuralSparks.js";
import { countdown } from "./animations/countdown.js";
import { time } from "./animations/time.js";
import { bottle } from "./animations/bottle.js";
import { spiral } from "./animations/spiral.js";
import { bounce } from "./animations/bounce.js";

const canvas = document.getElementById("glyphCanvas");
const ctx = canvas.getContext("2d");
resizeCanvas(canvas);

let grid = generateGrid(canvas.width, canvas.height);

AnimationRegistry.register([
  time,
  countdown,
  bottle,
  bounce,
  neuralSparks,
  spiral,
]);
setupControls(AnimationRegistry, () => grid);

window.addEventListener("resize", () => {
  resizeCanvas(canvas);
  grid = generateGrid(canvas.width, canvas.height);
});

function loop(time) {
  clearCanvas(ctx, canvas);
  const anim = getCurrentAnim();
  const t = time * 0.001;

  for (const p of grid.points) {
    const b = anim.fn(p, t, grid);
    drawDot(ctx, p.x, p.y, b);
  }

  // Optional label
  ctx.font = "14px monospace";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText(anim.name.toUpperCase(), 20, 30);

  ctx.font = "12px monospace";
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillText("Press \u2190 / \u2192 to change animations", 20, 50);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
