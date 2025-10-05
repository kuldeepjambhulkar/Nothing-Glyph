export const time = {
  name: "time",
  fn: (p, t, grid) => {
    // Only show points inside the main circle
    if (p.dist > grid.radius) return 0;

    // Digit masks (5x7) reused from countdown style
    const DIGITS = [
      ["01110", "10001", "10011", "10101", "11001", "10001", "01110"], //0
      ["00100", "01100", "00100", "00100", "00100", "00100", "01110"], //1
      ["01110", "10001", "00001", "00010", "00100", "01000", "11111"], //2
      ["01110", "10001", "00001", "00110", "00001", "10001", "01110"], //3
      ["00010", "00110", "01010", "10010", "11111", "00010", "00010"], //4
      ["11111", "10000", "11110", "00001", "00001", "10001", "01110"], //5
      ["01110", "10000", "11110", "10001", "10001", "10001", "01110"], //6
      ["11111", "00001", "00010", "00100", "01000", "01000", "01000"], //7
      ["01110", "10001", "10001", "01110", "10001", "10001", "01110"], //8
      ["01110", "10001", "10001", "01111", "00001", "10001", "01110"], //9
    ];

    // Colon mask (1x7) - two center dots
    const COLON = ["0", "0", "1", "0", "1", "0", "0"];

    // Small 3x5 font for A/P/M (used for AM/PM)
    const SMALL_FONT = {
      A: ["010", "101", "111", "101", "101"],
      M: ["101", "111", "111", "101", "101"],
      P: ["110", "101", "110", "100", "100"],
    };

    // Get local time
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const isPM = hours >= 12;
    const label = isPM ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    if (hours === 0) hours = 12;

    // Build glyph sequence string: H H : M M
    const hourStr = String(hours).padStart(2, "0");
    const minStr = String(minutes).padStart(2, "0");
    const chars = [hourStr[0], hourStr[1], ":", minStr[0], minStr[1]];

    // Map chars to masks and widths
    const glyphs = chars.map((ch) => {
      if (ch === ":") return { mask: COLON, w: 1, h: 7 };
      const d = parseInt(ch, 10);
      return { mask: DIGITS[d], w: 5, h: 7 };
    });

    // Spacing (in font columns) between glyphs
    const gap = 1;
    const totalCols =
      glyphs.reduce((s, g) => s + g.w, 0) + gap * (glyphs.length - 1);

    // Determine scale so the time fits in the circle diameter
    const diameter = grid.radius * 2;
    let scale = Math.floor((diameter * 0.75) / totalCols);
    if (scale < 1) scale = 1;

    // Compute center and starting positions
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const totalW = totalCols * scale;
    const totalH = 7 * scale;
    const startX = cx - totalW / 2;
    const startY = cy - totalH / 2 - Math.max(0, scale); // move up a bit to make room for AM/PM

    // Small scale for AM/PM (about half)
    const ampmScale = Math.max(1, Math.floor(scale * 0.5));
    const ampmH = 5 * ampmScale;
    const ampmW = (3 * 2 + 1) * ampmScale; // two letters + small gap
    const ampmStartX = cx - ampmW / 2;
    const ampmStartY = startY + totalH + ampmScale * 0.6 + 4; // a little padding

    // Colon blink: on for 0.5s, off for 0.5s
    const colonOn = Math.floor(t * 2) % 2 === 0;

    // Check whether this point lies in any glyph pixel
    let inTime = false;

    // iterate glyphs horizontally
    let colOffset = 0;
    for (let gi = 0; gi < glyphs.length; gi++) {
      const g = glyphs[gi];
      for (let gy = 0; gy < g.h; gy++) {
        const row = g.mask[gy];
        for (let gx = 0; gx < g.w; gx++) {
          if (row[gx] !== "1") continue;
          // handle colon blink
          if (g.w === 1 && g.mask === COLON && !colonOn) continue;

          const px = startX + (colOffset + gx) * scale;
          const py = startY + gy * scale;
          if (p.x >= px && p.x < px + scale && p.y >= py && p.y < py + scale) {
            inTime = true;
            break;
          }
        }
        if (inTime) break;
      }
      if (inTime) break;
      colOffset += g.w + gap;
    }

    // AM/PM rendering (small font)
    // if (!inTime) {
    //   // Render two letters side by side with 1-column gap
    //   let ampmCol = 0;
    //   for (let li = 0; li < label.length; li++) {
    //     const ch = label[li];
    //     const mask = SMALL_FONT[ch];
    //     const w = 3;
    //     const h = 5;
    //     for (let ry = 0; ry < h; ry++) {
    //       const row = mask[ry];
    //       for (let rx = 0; rx < w; rx++) {
    //         if (row[rx] !== "1") continue;
    //         const px = ampmStartX + (ampmCol + rx) * ampmScale;
    //         const py = ampmStartY + ry * ampmScale;
    //         if (
    //           p.x >= px &&
    //           p.x < px + ampmScale &&
    //           p.y >= py &&
    //           p.y < py + ampmScale
    //         ) {
    //           inTime = true;
    //           break;
    //         }
    //       }
    //       if (inTime) break;
    //     }
    //     if (inTime) break;
    //     ampmCol += w + 1;
    //   }
    // }

    // Brightness: time pixels bright; rest dim but inside circle
    return inTime ? 1 : 0.06;
  },
};
