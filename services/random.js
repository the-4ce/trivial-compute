/**
 * Deterministic LCG for networked games.
 */
export default class Random {
  constructor(seed = new Date().getTime()) {
      this.m = 0x80000000; // 2^31
      this.a = 1664525;
      this.c = 1013904223;
      this.state = seed;
  }

  nextInt() {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state;
  }

  nextFloat() {
      return this.nextInt() / (this.m - 1);
  }
}