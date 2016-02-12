'use strict';

class Logger {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px monospace';
    this.ctx.textBaseline = 'top';

    this.messages = [];
  }

  log(message) {
    this.messages.push(message);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const length = this.messages.length;
    for (let i = 0; i < length; ++i) {
      this.ctx.fillText(this.messages[i], 0, i * 12);
    }
    this.messages.splice(0);
  }
}

const clamp = (value, min, max) => Math.min(Math.max(min, value), max);
const isClamped = (value, min, max) => (min <= value && value <= max);
const modulo = (value, max) => (max + value) % max;
const hypot = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export {
  Logger, clamp, isClamped, modulo, hypot
};

// vim: set ts=2 sw=2 et:
