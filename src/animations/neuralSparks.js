export const neuralSparks = {
  name: "neuralSparks",
  fn: (p, t, grid) => {
    if (Math.random() < 0.005) p.flash = t;
    return Math.exp(-(t - (p.flash || 0)) * 4);
  },
};
