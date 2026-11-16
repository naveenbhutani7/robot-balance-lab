// sim.js - the balance model used by the app (same model as balance_lab.ipynb).
//
//   a = omega^2 * (x - p)        omega = sqrt(g / z)
//
// x = centre of mass (sideways, m), p = where the feet push on the floor (m), z = height of the centre of mass (m).
// Robot controller (capture-point feedback): it measures x and its speed `delay` seconds late, computes the capture
// point xi = x + v / omega and pushes at p = xi + k * xi, limited to what the feet (+ a little hip help) can reach.
// All parameters are assumed, for teaching. This is not any real robot's controller.
(function (root) {
  const G = 9.81;
  const ROBOT_Z = 1.0;          // centre-of-mass height of the robot, m (assumed)
  const K = 1.0;                // correction gain (assumed)
  const HIP = 0.06;             // extra push-point shift from the hips, m (assumed)
  const FEET = { small: 0.10, normal: 0.15, large: 0.24 };   // outer foot edge, m (assumed)

  const omega = (z) => Math.sqrt(G / z);

  // Simulate one robot push. Returns samples at 60 per second and the outcome.
  function runRobot({ delay, push, feet, T = 7, tPush = 1.0 }) {
    const om = omega(ROBOT_Z), dt = 1 / 600, reach = feet + HIP;
    const lag = Math.round(delay / dt), iPush = Math.round(tPush / dt), N = Math.round(T / dt);
    const hx = [], hv = [];
    const out = { t: [], x: [], p: [], xi: [], reach, feet, om, delay, push, tPush, T, fellAt: null, doomedAt: null };
    let x = 0, v = 0;
    for (let i = 0; i <= N; i++) {
      const t = i * dt;
      if (i === iPush) v += push;
      hx.push(x); hv.push(v);
      const j = Math.max(0, i - lag);
      const xim = hx[j] + hv[j] / om;                    // capture point, as the robot measured it (late)
      const p = Math.max(-reach, Math.min(reach, xim + K * xim));
      const xi = x + v / om;
      // Once the true capture point is outside the reach, the push point can't get beyond it: no way back.
      if (out.doomedAt === null && Math.abs(xi) > reach) out.doomedAt = t;
      if (i % 10 === 0) { out.t.push(t); out.x.push(x); out.p.push(p); out.xi.push(xi); }
      if (Math.abs(x) > 0.45) { out.fellAt = t; out.t.push(t); out.x.push(x); out.p.push(p); out.xi.push(xi); break; }
      v += om * om * (x - p) * dt;
      x += v * dt;
    }
    let tail = 0;
    if (out.fellAt === null) {
      const n0 = out.t.findIndex((t) => t >= T - 1.5);
      for (let i = n0; i < out.x.length; i++) tail = Math.max(tail, Math.abs(out.x[i]));
    }
    out.outcome = out.fellAt !== null ? "fell" : tail > 0.01 ? "wobble" : "stood";
    return out;
  }

  // Largest push survivable without a step (stable delays only):  reach * omega * exp(-omega * delay)
  const pushLimit = (delay, feet) => (feet + HIP) * omega(ROBOT_Z) * Math.exp(-omega(ROBOT_Z) * delay);

  // Delay at which this controller loses all phase margin (linear model): atan(Wc / w) / Wc
  const criticalDelay = () => {
    const w = omega(ROBOT_Z), Wc = w * Math.sqrt((1 + K) ** 2 - 1);
    return Math.atan(Wc / w) / Wc;
  };

  const api = { G, ROBOT_Z, K, HIP, FEET, omega, runRobot, pushLimit, criticalDelay };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BalanceSim = api;
})(typeof window !== "undefined" ? window : globalThis);
