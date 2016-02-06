'use strict';

import Entity from './entity.js';

class Rock extends Entity {
  constructor(game) {
    super(game);

    if (Math.random() > 0.5) {
      this.x = this.field.logical.width * Math.random();
      if (Math.random() > 0.5) {
        this.y = -100;
      } else {
        this.y = this.field.logical.height + 100;
      }
    } else {
      this.y = this.field.logical.height * Math.random();
      if (Math.random() > 0.5) {
        this.x = -100;
      } else {
        this.x = this.field.logical.width + 100;
      }
    }

    this.angle = 0;

    let tmp = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x);
    this.dx = Math.cos(tmp);
    this.dy = Math.sin(tmp);
    this.angularAcceleration = (Math.random() - 0.5) / 100;

    let averageRadius = Math.sqrt(this.field.logical.width * this.field.logical.height) / 16;
    let numofVertices = averageRadius / 4;

    let vertices = [];
    for (let i = 0; i < numofVertices; ++i) {
      vertices.push({
        radius: averageRadius * (0.5 + Math.random() * 1.5),
        angle : 2 * Math.PI * Math.random()
      });
    }
    vertices.sort((a, b) => a.angle - b.angle);
    vertices = vertices.map(({radius, angle}) => [radius * Math.cos(angle), radius * Math.sin(angle)]);

    vertices.push(vertices[0]);
    this.createPath([vertices]);
  }

  next() {
    this.x += this.dx;
    this.y += this.dy;
    this.angle += this.angularAcceleration;

    if (this.x < -100 || this.field.logical.width  + 100 < this.x ||
        this.y < -100 || this.field.logical.height + 100 < this.y) {
      this.died = true;
    }
  }

  draw(elapsed) {
    super.draw();
    this.logger.log(`Rock x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}`);
  }
}

export default Rock;

// vim: set ts=2 sw=2 et: