export function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function clearCanvas(ctx, canvas) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawDot(ctx, x, y, brightness) {
  const r = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
  ctx.shadowColor = "white";
  ctx.shadowBlur = 10;
  ctx.fill();
}
