export const bounce = {
  name: "bounce",
  fn: (p, t, grid) => {
    // compute center
    const minX = Math.min(...grid.points.map((pt) => pt.x));
    const minY = Math.min(...grid.points.map((pt) => pt.y));
    const maxX = Math.max(...grid.points.map((pt) => pt.x));
    const maxY = Math.max(...grid.points.map((pt) => pt.y));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // platform: horizontal flat band (like the screenshot)
    // We'll use the horizontal diameter as the platform top so the lower
    // half of the circle is the 'platform' region (bright squares).
    // move platform slightly down so it matches the screenshot proportions
    const platformTop = cy + grid.radius * 0.06; // y-coordinate where the platform begins (top edge)
    const rInner = grid.radius * 0.0; // (unused for the flat platform but keep a var)

    // ball / sim state (module-level preserved)
    if (!bounce._sim) {
      bounce._sim = {
        lastT: null,
        lastFrameT: null,
        // start centered above the platform and only move vertically
        ball: { x: cx, y: cy - grid.radius * 0.6 },
        v: { x: 0, y: -grid.radius * 1.0 }, // vertical motion only (higher)
        // fixed upward launch speed used to re-launch the ball on each hit
        launchSpeed: grid.radius * 1.0,
        // make the simulated ball a bit larger so it covers grid cells cleanly
        radius: Math.max(8, grid.radius * 0.07),
        restitution: 0.78,
        tangentialDamping: 0.995,
        g: grid.radius * 0.9, // gravity px/s^2 (scaled with grid)
        gridRadius: grid.radius,
        cx,
        cy,
      };
    }

    const sim = bounce._sim;

    // reinit on resize (grid radius changed)
    if (sim.gridRadius !== grid.radius || sim.cx !== cx || sim.cy !== cy) {
      sim.gridRadius = grid.radius;
      sim.cx = cx;
      sim.cy = cy;
      sim.ball.x = cx;
      sim.ball.y = cy - grid.radius * 0.6;
      sim.v.x = 0;
      sim.launchSpeed = grid.radius * 1.0;
      sim.v.y = -sim.launchSpeed;
      sim.radius = Math.max(8, grid.radius * 0.07);
    }

    // run physics update once per frame (t is seconds)
    if (sim.lastFrameT !== t) {
      const dt = sim.lastT == null ? 0 : Math.max(0, t - sim.lastT);
      sim.lastFrameT = t;
      sim.lastT = t;

      if (dt > 0) {
        // integrate velocity (gravity downward)
        sim.v.y += sim.g * dt;

        // integrate position (vertical only — keep x fixed)
        sim.ball.x = sim.cx; // lock horizontal position
        sim.v.x = 0;
        sim.ball.y += sim.v.y * dt;

        // compute relative to center and rim collision (still keep circular rim)
        let dx = sim.ball.x - cx;
        let dy = sim.ball.y - cy;
        let r = Math.sqrt(dx * dx + dy * dy) || 1;

        // rim collision (bounce off the outer circle)
        const rimLimit = grid.radius - sim.radius * 0.5;
        if (r >= rimLimit) {
          const n = { x: dx / r, y: dy / r }; // outward normal
          const radialVel = sim.v.x * n.x + sim.v.y * n.y;
          if (radialVel > 0) {
            // reflect radial component
            sim.v.x -= (1 + sim.restitution) * radialVel * n.x;
            sim.v.y -= (1 + sim.restitution) * radialVel * n.y;
            // push back inside
            sim.ball.x = cx + n.x * rimLimit;
            sim.ball.y = cy + n.y * rimLimit;
            // recompute r
            dx = sim.ball.x - cx;
            dy = sim.ball.y - cy;
            r = Math.sqrt(dx * dx + dy * dy) || 1;
          }
        }

        // platform collision: flat horizontal ground at y = platformTop
        // Only active while the ball is over the circular area (so the ground
        // doesn't extend outside the circle). We check that the point on the
        // platform directly below the ball lies within the circle.
        const groundDx = sim.ball.x - cx;
        const groundDy = platformTop - cy; // platformTop - center
        const withinPlatformHoriz =
          groundDx * groundDx + groundDy * groundDy <=
          (grid.radius - sim.radius) * (grid.radius - sim.radius);

        if (withinPlatformHoriz) {
          const contactY = sim.ball.y + sim.radius; // bottom of ball
          if (contactY >= platformTop) {
            // hit the flat platform from above — relaunch with fixed speed
            sim.v.y = -sim.launchSpeed;
            // (flash removed) impact handled by bounce only
            // small tangential damping when hitting the platform
            sim.v.x *= sim.tangentialDamping;
            // place ball on top of platform
            sim.ball.y = platformTop - sim.radius;
          }
        }

        // small damping on horizontal velocity only; keep vertical energy
        sim.v.x *= 0.999;
      }
    }

    // Rendering decisions (per-point)
    // Platform points: bright horizontal band at/below platformTop
    const dxp = p.x - cx;
    const dyp = p.y - cy;
    const rp = Math.sqrt(dxp * dxp + dyp * dyp);
    const isInsideCircle = p.dist <= grid.radius;

    // Fill all points below the platformTop inside the circle (solid flat platform)
    const isPlatform = isInsideCircle && p.y >= platformTop;

    if (isPlatform) {
      // solid platform brightness (no flash)
      return 0.95;
    }

    // ball rendering as a solid circle (no glow)
    const bx = sim.ball.x;
    const by = sim.ball.y;
    const ddx = p.x - bx;
    const ddy = p.y - by;
    const dist = Math.sqrt(ddx * ddx + ddy * ddy);
    // Solid core for the ball, with a small soft edge so the circle looks filled
    if (dist <= sim.radius * 0.65) {
      return 1.0; // core
    }
    if (dist <= sim.radius * 1.15) {
      // outer edge, slightly dimmer
      return 0.72;
    }
    if (dist <= sim.radius * 1.65) {
      return 0.28;
    }

    // keep dim background (inside circle)
    if (p.dist <= grid.radius) return 0.06;
    return 0;
  },
};
