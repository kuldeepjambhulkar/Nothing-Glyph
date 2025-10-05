export const bottle = {
  name: "bottle",
  fn: (p, t, grid) => {
    // Only show points inside the main circle
    if (p.dist > grid.radius) return 0;
    // Procedural two-cylinder bottle (small neck stacked on larger body)
    const diameter = grid.radius * 2;

    // Size of bottle relative to the circle (scaled down slightly)
    const baseSizeScale = 0.64; // overall size multiplier

    // compute grid pixel spacing so AA adapts to the point grid
    const gridMinX = Math.min(...grid.points.map((pt) => pt.x));
    const gridMaxX = Math.max(...grid.points.map((pt) => pt.x));
    const spacing =
      grid.cols && grid.cols > 0
        ? (gridMaxX - gridMinX) / grid.cols
        : Math.max(6, Math.floor(diameter / 30));

    // continuous dimensions for smooth rotation
    const bottleH = diameter * 0.9 * baseSizeScale;
    const bottleW = diameter * 0.34 * baseSizeScale;
    const neckW = bottleW * 0.38;
    const neckH = bottleH * 0.21;
    const bodyH = bottleH - neckH;

    const bodyCorner = bottleW * 0.12;
    const neckCorner = neckW * 0.12;

    // bottle center
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // local coords
    const localX = p.x - cx;
    const localY = p.y - cy;

    // rotate sampling point so the bottle appears to rotate
    const spinSpeed = -Math.PI / 3; // negative for clockwise in current coordinate system
    const a = spinSpeed * t;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const rx = localX * ca - localY * sa;
    const ry = localX * sa + localY * ca;

    const topY = -bottleH / 2;
    const neckCenterY = topY + neckH / 2;
    const bodyCenterY = topY + neckH + bodyH / 2;

    // signed distance to rounded rect (negative inside)
    function sdRoundedRect(x, y, w, h, r) {
      const ax = Math.abs(x);
      const ay = Math.abs(y);
      const halfW = w / 2;
      const halfH = h / 2;
      const dx = Math.max(0, ax - (halfW - r));
      const dy = Math.max(0, ay - (halfH - r));
      const outside = Math.sqrt(dx * dx + dy * dy) - r;
      return outside; // negative when inside rounded rect
    }

    // distances to neck and body
    const dNeck = sdRoundedRect(rx, ry - neckCenterY, neckW, neckH, neckCorner);
    const dBody = sdRoundedRect(
      rx,
      ry - bodyCenterY,
      bottleW,
      bodyH,
      bodyCorner
    );
    const d = Math.min(dNeck, dBody);

    // anti-alias width (pixels) scaled with spacing so it looks consistent
    const aa = Math.max(1, spacing * 0.7);

    function smoothstep(e0, e1, x) {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    }

    // interior alpha (1 inside, 0 outside) blended over aa
    const insideAlpha = 1 - smoothstep(-aa / 2, aa / 2, d);
    if (insideAlpha <= 1e-4) return 0.06; // outside mostly

    // label (oval) distance and alpha
    const labelRx = bottleW * 0.28;
    const labelRy = bodyH * 0.18;
    const lx = rx;
    const ly = ry - bodyCenterY;
    const labelDist =
      Math.sqrt(
        (lx * lx) / (labelRx * labelRx) + (ly * ly) / (labelRy * labelRy)
      ) - 1;
    const labelAlpha = 1 - smoothstep(-aa / 2, aa / 2, labelDist);

    // outline factor based on distance to shape boundary
    const outlineAlpha = Math.max(0, 1 - Math.abs(d) / (aa * 0.6));

    // pulses
    const basePulse = 0.78 + 0.12 * Math.sin(t * 3 + (p.index % 16) * 0.4);
    const outlinePulse = 0.96 + 0.06 * Math.sin(t * 6 + (p.index % 8) * 0.9);
    const labelPulse = 1.0 + 0.12 * Math.sin(t * 8 + (p.index % 6) * 1.2);

    // combine: start from background then add interior contribution, then mix outline and label
    const bg = 0.06;
    // interior contribution scaled by insideAlpha
    let brightness = bg * (1 - insideAlpha) + basePulse * insideAlpha;
    // blend outline on top
    brightness =
      brightness * (1 - outlineAlpha) +
      outlinePulse * outlineAlpha * insideAlpha;
    // blend label on top
    brightness =
      brightness * (1 - labelAlpha) + labelPulse * labelAlpha * insideAlpha;

    return Math.min(1, brightness);
  },
};
