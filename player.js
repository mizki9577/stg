'use strict';

import Entity from './entity.js';
import {modulo, clamp} from './misc.js';
import Config from './config.js';

class Player extends Entity {
  constructor(game) {
    super(game, Config.Player.path);

    this.minSpeed = Config.Player.minSpeed;
    this.maxSpeed = Config.Player.maxSpeed;

    this.x                   = this.field.logical.width / 2;
    this.y                   = this.field.logical.height / 2;
    this.dx                  = 0;
    this.dy                  = 0;
    this.angle               = Config.Player.initialAngle;
    this.speed               = Config.Player.initialSpeed;

    this.linearAcceleration  = Config.Player.linearAcceleration;
    this.angularAcceleration = Config.Player.angularAcceleration;
  }

  next(elapsed) {
    if (this.pressedKeys.has('ArrowUp')) {
      this.speed = clamp(this.speed + this.linearAcceleration * elapsed,
                         this.minSpeed, this.maxSpeed);
    } else if (this.pressedKeys.has('ArrowDown')) {
      this.speed = clamp(this.speed - this.linearAcceleration * elapsed,
                         this.minSpeed, this.maxSpeed);
    }

    if (this.pressedKeys.has('ArrowLeft')) {
      this.angle += this.angularAcceleration * elapsed;
    } else if (this.pressedKeys.has('ArrowRight')) {
      this.angle -= this.angularAcceleration * elapsed;
    }

    this.dx =  this.speed * Math.cos(this.angle) * elapsed;
    this.dy = -this.speed * Math.sin(this.angle) * elapsed;

    this.x = modulo(this.x + this.dx, this.field.logical.width );
    this.y = modulo(this.y + this.dy, this.field.logical.height);
  }

  draw() {
    super.draw();
    this.logger.log(`Player   x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}, dx: ${this.dx.toFixed(2)}, dy: ${this.dy.toFixed(2)}, angle: ${this.angle.toFixed(2)}, speed: ${this.speed.toFixed(2)}`);
  }
}

export default Player;

// vim: set ts=2 sw=2 et:
