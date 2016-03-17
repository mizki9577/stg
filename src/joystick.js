'use strict';

import {clamp} from './misc';

class JoyStick {
  constructor(game, canvas, size) {
    this.game        = game;
    this.canvas      = canvas
    this.ctx         = this.canvas.getContext('2d');
    this.size        = size;

    this.logger      = this.game.logger;
    this.logger.add('JoyStick');

    this.canvas.width  = this.size * this.game.scale;
    this.canvas.height = this.size * this.game.scale;
    this.canvas.style.width  = `${this.size}px`;
    this.canvas.style.height = `${this.size}px`;
    this.ctx.strokeStyle = this.game.defaultStrokeStyle;
    this.ctx.scale(this.game.scale, this.game.scale);

    this.currentTouch = null;

    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    this.canvas.addEventListener('touchmove' , this.onTouchMove.bind(this) , false);
    this.canvas.addEventListener('touchend'  , this.onTouchEnd.bind(this)  , false);
    this.canvas.addEventListener('touchancel', this.onTouchEnd.bind(this)  , false);
  }

  onTouchStart(ev) {
    this.currentTouch = ev.targetTouches.item(0);
  }

  onTouchMove(ev) {
    for (let i = 0; i < ev.targetTouches.length; ++i) {
      const touch = ev.targetTouches.item(i);
      if (this.currentTouch.identifier === touch.identifier) {
        this.currentTouch = touch;
        break;
      }
    }
  }

  onTouchEnd(ev) {
    this.currentTouch = null;
  }

  get isEnabled() {
    return this.canvas.style.display === 'block';
  }

  set isEnabled(value) {
    this.canvas.style.display = (value ? 'block' : 'none');
  }

  get isTouched() {
    return this.currentTouch !== null;
  }

  get x() {
    if (!this.isTouched) {
      return 0;
    }
    return clamp(((this.currentTouch.clientX - this.canvas.offsetLeft) / this.size - 0.5) * 2, -1, 1);
  }

  get y() {
    if (!this.isTouched) {
      return 0;
    }
    return clamp(((this.currentTouch.clientY - this.canvas.offsetTop) / this.size - 0.5) * 2, -1, 1);
  }

  get angle() {
    return Math.atan2(-this.y, this.x);
  }

  get radius() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.size, this.size);

    this.ctx.beginPath();
    this.ctx.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
    this.ctx.stroke();

    if (this.isTouched) {
      this.ctx.beginPath();
      this.ctx.arc((this.x / 2 + 0.5) * this.size, (this.y / 2 + 0.5) * this.size, this.size / 4, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    this.logger.update(
        'JoyStick', [
          `isTouched: ${this.isTouched}`,
          `x: ${this.x.toFixed(2)}`,
          `y: ${this.y.toFixed(2)}`,
          `angle: ${this.angle.toFixed(2)}`,
          `radius: ${this.radius.toFixed(2)}`
        ]
    );
  }
};

export default JoyStick;

// vim: set ts=2 sw=2 et:
