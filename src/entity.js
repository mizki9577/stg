'use strict';

import {normal, sub, dot, chain} from './misc';

class Entity {
  constructor(game, paths, strokeStyle=game.defaultStrokeStyle) {
    this.game        = game;
    this.ctx         = game.ctx;
    this.field       = game.field;
    this.pressedKeys = game.pressedKeys;
    this.strokeStyle = strokeStyle;
    this.identifier  = Date.now();
    this.logger      = game.logger;

    if (paths) {
      this.createPath(paths);
    }
  }

  createPath(paths) {
    this.canvasPath = new Path2D();

    for (const path of paths) {
      const [x, y] = path[0];
      this.canvasPath.moveTo(x, y);
      for (const point of path.slice(1)) {
        const [x, y] = point;
        this.canvasPath.lineTo(x, y);
      }
    }

    this.paths = new Set();
    for (const path of paths) {
      const length = path.length - 1;
      for (let i = 0; i < length; ++i) {
        this.paths.add([path[i], path[i + 1]]);
      }
    }
  }

  *pathsInField() {
    const sin = Math.sin(-this.angle);
    const cos = Math.cos(-this.angle);
    for (const [[ax0, ay0], [bx0, by0]] of this.paths) {
      const ax = (ax0 * cos - ay0 * sin) + this.x;
      const ay = (ax0 * sin + ay0 * cos) + this.y;
      const bx = (bx0 * cos - by0 * sin) + this.x;
      const by = (bx0 * sin + by0 * cos) + this.y;
      yield [[ax, ay], [bx, by]];
    }
  }

  *pointsInField() {
    const sin = Math.sin(-this.angle);
    const cos = Math.cos(-this.angle);
    for (const [[x0, y0], [_1, _2]] of this.paths) {
      const x = (x0 * cos - y0 * sin) + this.x;
      const y = (x0 * sin + y0 * cos) + this.y;
      yield [x, y];
    }
  }

  static areTheyCollided(entityA, entityB) {
    for (const [p1, p2] of chain(entityA.pathsInField(), entityB.pathsInField())) {
      const vector = sub(p2, p1);
      const screen = normal(vector);
      let aMin, aMax, bMin, bMax;

      for (const point of entityA.pointsInField()) {
        const projected = dot(screen, point);
        if (aMin === undefined && aMax === undefined) {
          aMin = aMax = projected;
          continue;
        }
        aMin = Math.min(aMin, projected);
        aMax = Math.max(aMax, projected);
      }

      for (const point of entityB.pointsInField()) {
        const projected = dot(screen, point);
        if (bMin === undefined && bMax === undefined) {
          bMin = bMax = projected;
          continue;
        }
        bMin = Math.min(bMin, projected);
        bMax = Math.max(bMax, projected);
      }

      if (aMax < bMin || bMax < aMin) {
        return false;
      }
    }

    return true;
  }

  die() { }

  next(elapsed) {
    throw 'Not Implemented';
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(-this.angle);
    this.ctx.stroke(this.canvasPath);
    this.ctx.restore();
  }
}

export default Entity;

// vim: set ts=2 sw=2 et:
