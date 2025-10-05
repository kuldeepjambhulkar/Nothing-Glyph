// Countdown animation: displays a large digit in the center, updating every second

const DIGITS = [
  // 0
  ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  // 1
  ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  // 2
  ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  // 3
  ["01110", "10001", "00001", "00110", "00001", "10001", "01110"],
  // 4
  ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  // 5
  ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  // 6
  ["01110", "10000", "11110", "10001", "10001", "10001", "01110"],
  // 7
  ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  // 8
  ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  // 9
  ["01110", "10001", "10001", "01111", "00001", "10001", "01110"],
];

function getDigitMask(digit) {
  return DIGITS[digit % 10];
}

export const countdown = {
  name: "countdown",
  fn: (p, t, grid) => {
    // Only show points inside the main circle
    if (p.dist > grid.radius) return 0;

    // Countdown from 9 to 0, one per second
    const seconds = 9 - Math.floor(t % 10);
    const mask = getDigitMask(seconds);

    // Font size and scaling
    const fontW = 5,
      fontH = 7;
    // Use 60% of the circle's diameter for the digit (smaller digit)
    const scale = Math.floor((grid.radius * 2 * 0.4) / Math.max(fontW, fontH));
    // Center of the grid in grid coordinates
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // Compute top-left of digit in pixel space
    const digitW = fontW * scale;
    const digitH = fontH * scale;
    const startX = cx - digitW / 2;
    const startY = cy - digitH / 2;

    // Is this point inside the digit mask?
    let inDigit = false;
    for (let fy = 0; fy < fontH; fy++) {
      for (let fx = 0; fx < fontW; fx++) {
        if (mask[fy][fx] === "1") {
          // For each font pixel, fill a scale x scale block
          const px = startX + fx * scale;
          const py = startY + fy * scale;
          if (p.x >= px && p.x < px + scale && p.y >= py && p.y < py + scale) {
            inDigit = true;
          }
        }
      }
    }

    // Fade in/out at digit change for digit only
    const frac = 1 - (t % 1);
    // Digit area is dim, rest is constantly lit
    return inDigit ? 0.1 * frac : 1;
  },
};
