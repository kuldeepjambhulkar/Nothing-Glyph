export function generateGrid(width, height, spacing = 15) {
  const points = [];
  const cols = Math.floor(width / spacing);
  const rows = Math.floor(height / spacing);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2.2;

  let index = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * spacing + spacing / 2;
      const y = i * spacing + spacing / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        points.push({ x, y, dist, index });
        index++;
      }
    }
  }

  return { points, cols, rows, radius };
}
