'use strict';

import Entity from './entity';
import {clamp} from './misc';

class Player extends Entity {
  constructor(game, {path, minSpeed, maxSpeed, initialSpeed, initialAngle, linearAcceleration, angularAcceleration}) {
    super(game, path);

    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;

    this.x     = this.field.logical.width / 2;
    this.y     = this.field.logical.height / 2;
    this.dx    = 0;
    this.dy    = 0;
    this.angle = initialAngle;
    this.speed = initialSpeed;

    this.linearAcceleration  = linearAcceleration;
    this.angularAcceleration = angularAcceleration;

    this.logger.add('Player');
  }

  next(elapsed) {
    if (this.game.leftJoyStick.isEnabled) {
      if (this.game.leftJoyStick.isTouched) {
        const joyStickRadius = this.game.leftJoyStick.radius;
        this.speed = joyStickRadius * this.maxSpeed;
        if (joyStickRadius > 0) {
          this.angle = this.game.leftJoyStick.angle;
        }
      }
    } else {
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
    }

    this.dx =  this.speed * Math.cos(this.angle) * elapsed;
    this.dy = -this.speed * Math.sin(this.angle) * elapsed;

    this.x = clamp(this.x + this.dx, 0, this.field.logical.width );
    this.y = clamp(this.y + this.dy, 0, this.field.logical.height);
  }

  draw() {
    super.draw();
    this.logger.update('Player', [`x: ${this.x.toFixed(2)}`, ` y: ${this.y.toFixed(2)}`, ` dx: ${this.dx.toFixed(2)}`, ` dy: ${this.dy.toFixed(2)}`, ` angle: ${this.angle.toFixed(2)}`, ` speed: ${this.speed.toFixed(2)}`]);
  }
}

export default Player;

// vim: set ts=2 sw=2 et:
