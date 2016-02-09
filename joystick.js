'use strict';

import {isClamped, hypot} from './misc.js';

class JoyStick {
  constructor(game, canvas, size) {
    this.game        = game;
    this.canvas      = canvas
    this.ctx         = this.canvas.getContext('2d');
    this.size        = size;
    this.strokeStyle = this.game.defaultStrokeStyle;
    this.logger      = this.game.logger;

    this.canvas.width  = this.size * this.game.scale;
    this.canvas.height = this.size * this.game.scale;
    this.canvas.style.width  = this.size;
    this.canvas.style.height = this.size;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.scale(this.game.scale, this.game.scale);

    this.currentTouch = undefined;
    this.isActive     = false;
    this.isTouched    = false;
    this.x            = 0;
    this.y            = 0;
    this.angle        = 0;
    this.radius       = 0;

    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    this.canvas.addEventListener('touchmove' , this.onTouchMove.bind(this) , false);
    this.canvas.addEventListener('touchend'  , this.onTouchEnd.bind(this)  , false);
    this.canvas.addEventListener('touchancel', this.onTouchEnd.bind(this)  , false);
  }

  onTouchStart(ev) {
    for (let i = 0; i < ev.targetTouches.length; ++i) {
      const touch = ev.targetTouches.item(i);
      if (isClamped(touch.clientX - this.canvas.offsetLeft, 0, this.canvas.offsetWidth) && isClamped(touch.clientY - this.canvas.offsetTop, 0, this.canvas.offsetHeight)) {
        this.x = ((touch.clientX - this.canvas.offsetLeft) / this.size - 0.5) * 2;
        this.y = ((touch.clientY - this.canvas.offsetTop)  / this.size - 0.5) * 2;
        this.isTouched = true;
        this.currentTouch = touch;
        break;
      } else {
        continue;
      }
    }
  }

  onTouchMove(ev) {
    if (!this.isTouched) {
      return;
    }

    for (let i = 0; i < ev.targetTouches.length; ++i) {
      const touch = ev.targetTouches.item(i);
      if (this.currentTouch.identifier !== touch.identifier) {
        continue;
      }

      if (isClamped(touch.clientX - this.canvas.offsetLeft, 0, this.canvas.offsetWidth) && isClamped(touch.clientY - this.canvas.offsetTop, 0, this.canvas.offsetHeight)) {
        this.x = ((touch.clientX - this.canvas.offsetLeft) / this.size - 0.5) * 2;
        this.y = ((touch.clientY - this.canvas.offsetTop)  / this.size - 0.5) * 2;
        this.currentTouch = touch;
      } else {
        this.x = 0;
        this.y = 0;
        this.isTouched = false;
        this.currentTouch = null;
      }
      break;
    }
  }

  onTouchEnd(ev) {
    this.isTouched = false;
    this.vertical   = 0;
    this.horizontal = 0;
  }

  activate() {
    this.isActive = true;
    this.canvas.style.display = 'block';
  }

  deactivate() {
    this.isActive = false;
    this.canvas.style.display = 'none';
  }

  getAngle() {
    return Math.atan2(-this.y, this.x);
  }

  getRadius() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.beginPath();
    this.ctx.arc(this.size / 2, this.size / 2, this.size / 2, 0, 2 * Math.PI);
    this.ctx.stroke();
    if (this.isTouched) {
      this.ctx.beginPath();
      this.ctx.arc(this.x * this.size + this.size / 2, this.y * this.size + this.size / 2, this.size / 4, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    this.logger.log(`JoyStick isTouched: ${this.isTouched}, x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}`);
  }
};

export default JoyStick;

// vim: set ts=2 sw=2 et:
