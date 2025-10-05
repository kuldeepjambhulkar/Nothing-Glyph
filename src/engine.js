export const AnimationRegistry = {
  list: [],
  currentIndex: 0,

  register(anims) {
    this.list.push(...anims);
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.list.length;
  },

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.list.length) % this.list.length;
  },
};

export function getCurrentAnim() {
  return AnimationRegistry.list[AnimationRegistry.currentIndex];
}
