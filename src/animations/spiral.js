export const time = {
  name: "time",
  fn: (p, t, grid) => {
    // keep a dim background outside the circle
    if (p.dist > grid.radius) return 0.06;

    // compute center (same approach as other animations)
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // local polar coords
    const dx = p.x - cx;
    const dy = p.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const nr = r / grid.radius; // 0 at center, 1 at edge
    const angle = Math.atan2(dy, dx); // -PI..PI

    // time params (tweakable)
    const speed = 0.5; // how fast the pattern moves
    const density = 10; // how many lines/points in the pattern

    // compute a "time" value based on position and global time
    const pt = (angle * density + t * speed) % (2 * Math.PI);

    // use a simple sin wave for vertical displacement
    const wave = 0.5 + 0.5 * Math.sin(pt * density);

    // final color is a mix of bright (1) and dark (0) based on wave
    const brightness = wave * 0.06;

    return brightness;
  },
};

export const neuralSparks = {
  name: "neuralSparks",
  fn: (p, t, grid) => {
    // keep a dim background outside the circle
    if (p.dist > grid.radius) return 0.06;

    // compute center (same approach as other animations)
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // local polar coords
    const dx = p.x - cx;
    const dy = p.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const nr = r / grid.radius; // 0 at center, 1 at edge
    const angle = Math.atan2(dy, dx); // -PI..PI

    // sparks params (tweakable)
    const speed = 2.0; // how fast sparks move
    const density = 30; // how many sparks are generated
    const sparkSize = 0.02; // size of the sparks

    // create a spark effect using small circles
    const spark =
      Math.sin(t * speed + nr * density * Math.PI * 2) > 0 ? sparkSize : 0; // pulsating effect

    // baseline brightness
    const bg = 0.06;
    const brightness = Math.min(1, bg + spark);

    return brightness;
  },
};

export const countdown = {
  name: "countdown",
  fn: (p, t, grid) => {
    // keep a dim background outside the circle
    if (p.dist > grid.radius) return 0.06;

    // compute center (same approach as other animations)
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // local polar coords
    const dx = p.x - cx;
    const dy = p.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const nr = r / grid.radius; // 0 at center, 1 at edge
    const angle = Math.atan2(dy, dx); // -PI..PI

    // countdown params (tweakable)
    const duration = 3.0; // how long the countdown lasts
    const segments = 10; // how many segments in the countdown circle

    // compute current segment based on time
    const segment = Math.floor(((t % duration) / duration) * segments);

    // compute angle for the current segment
    const segmentAngle = (segment / segments) * 2 * Math.PI;

    // create a pie-chart like effect for the countdown
    const brightness =
      angle < segmentAngle ? 1 - (segmentAngle - angle) / (2 * Math.PI) : 0;

    return brightness;
  },
};

export const bottle = {
  name: "bottle",
  fn: (p, t, grid) => {
    // keep a dim background outside the circle
    if (p.dist > grid.radius) return 0.06;

    // compute center (same approach as other animations)
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // local polar coords
    const dx = p.x - cx;
    const dy = p.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const nr = r / grid.radius; // 0 at center, 1 at edge
    const angle = Math.atan2(dy, dx); // -PI..PI

    // bottle params (tweakable)
    const neckWidth = 0.05; // width of the neck
    const bodyWidth = 0.1; // width of the body
    const baseWidth = 0.15; // width of the base

    // compute distances for the bottle parts
    const neckDist = Math.abs(angle) < neckWidth ? 1 : 0;
    const bodyDist = Math.abs(angle) < bodyWidth ? 1 : 0;
    const baseDist = Math.abs(angle) < baseWidth ? 1 : 0;

    // combine distances to create the bottle shape
    const brightness = Math.max(neckDist, bodyDist, baseDist);

    return brightness;
  },
};

export const spiral = {
  name: "spiral",
  fn: (p, t, grid) => {
    // keep a dim background outside the circle
    if (p.dist > grid.radius) return 0.06;

    // compute center (same approach as other animations)
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // local polar coords
    const dx = p.x - cx;
    const dy = p.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const nr = r / grid.radius; // 0 at center, 1 at edge
    const angle = Math.atan2(dy, dx); // -PI..PI

    // spiral params (tweakable)
    const turns = 3.0; // how many spiral turns from outer->inner
    const speed = 0.25; // cycles per second (how fast wave moves inward)
    const bandWidth = 0.08; // thickness of the glowing band (normalized)

    // build a wrapped coordinate along the spiral (0..1)
    const spiralCoord = nr + (angle / (2 * Math.PI)) * turns;
    let phase = spiralCoord - t * speed;
    phase = ((phase % 1) + 1) % 1; // wrap to [0,1)

    // distance to center of the band (wrap-safe)
    const d = Math.min(phase, 1 - phase);

    // smoothstep helper
    function smoothstep(e0, e1, x) {
      const v = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return v * v * (3 - 2 * v);
    }

    // alpha: 1 at center of band, 0 outside bandWidth
    const alpha = 1 - smoothstep(0, bandWidth, d);

    // baseline background and final brightness mix
    const bg = 0.06;
    const brightness = Math.min(1, bg + (1 - bg) * alpha);

    return brightness;
  },
};
