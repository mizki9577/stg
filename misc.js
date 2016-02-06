'use strict';

class Logger {
  constructor() {
    this.messages = [];
  }

  setContext(ctx) {
    this.ctx = ctx;
  }

  log(message) {
    this.messages.push(message);
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px monospace';
    this.ctx.textBaseline = 'top';

    let length = this.messages.length;
    for (let i = 0; i < length; ++i) {
      this.ctx.fillText(this.messages[i], 0, i * 12);
    }
    this.messages.splice(0);

    this.ctx.restore();
  }
}

let clamp = (value, min, max) => Math.min(Math.max(min, value), max);
let modulo = (value, max) => (max + value) % max;

export {
  Logger, clamp, modulo
};

// vim: set ts=2 sw=2 et: