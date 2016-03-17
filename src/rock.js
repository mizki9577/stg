'use strict';

import Entity from './entity';
import Config from './config';

class Rock extends Entity {
  constructor(game) {
    super(game);

    if (Math.random() > 0.5) {
      this.x = this.field.logical.width * Math.random();
      if (Math.random() > 0.5) {
        this.y = -this.field.logical.height / 2;
      } else {
        this.y = this.field.logical.height *1.5;
      }
    } else {
      this.y = this.field.logical.height * Math.random();
      if (Math.random() > 0.5) {
        this.x = -this.field.logical.width / 2;
      } else {
        this.x = this.field.logical.width *1.5;
      }
    }

    this.angle = 0;

    const tmp = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x);
    this.dx = Math.cos(tmp) * (Math.random() * 1.5 + 0.5);
    this.dy = Math.sin(tmp) * (Math.random() * 1.5 + 0.5);
    this.angularAcceleration = (Math.random() - 0.5) / 50;

    const radius = Config.Rock.radius
    const numofVertices = Config.Rock.numofVertices

    let vertices = [];
    for (let i = 0; i < numofVertices; ++i) {
      vertices.push(2 * Math.PI * Math.random());
    }
    vertices.sort();
    vertices = vertices.map((angle) => [radius * Math.cos(angle), radius * Math.sin(angle)]);

    vertices.push(vertices[0]);
    this.createPath([vertices]);

    this.logger.add(`Rock #${this.identifier}`);
  }

  die() {
    this.died = true;
    this.logger.delete(`Rock #${this.identifier}`);
  }

  next() {
    this.x += this.dx;
    this.y += this.dy;
    this.angle += this.angularAcceleration;

    if (this.x < -this.field.logical.width  || this.field.logical.width  * 2 < this.x ||
        this.y < -this.field.logical.height || this.field.logical.height * 2 < this.y) {
      this.die();
    }
  }

  draw(elapsed) {
    super.draw();
    this.logger.update(`Rock #${this.identifier}`, [`x: ${this.x.toFixed(2)}`, ` y: ${this.y.toFixed(2)}`]);
  }
}

export default Rock;

// vim: set ts=2 sw=2 et:
