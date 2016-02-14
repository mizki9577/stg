'use strict';

class Entity {
  constructor(game, paths, strokeStyle=game.defaultStrokeStyle) {
    this.game = game;
    this.ctx = game.ctx;
    this.field = game.field;
    this.pressedKeys = game.pressedKeys;
    this.strokeStyle = strokeStyle;
    this.identifier = Date.now();
    this.logger = game.logger;

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

  static areTheyCollided(entityA, entityB) {
    for (const [[a1x0, a1y0], [a2x0, a2y0]] of entityA.paths) {
      const sinA = Math.sin(-entityA.angle);
      const cosA = Math.cos(-entityA.angle);
      const a1x = (a1x0 * cosA - a1y0 * sinA) + entityA.x;
      const a1y = (a1x0 * sinA + a1y0 * cosA) + entityA.y;
      const a2x = (a2x0 * cosA - a2y0 * sinA) + entityA.x;
      const a2y = (a2x0 * sinA + a2y0 * cosA) + entityA.y;

      for (const [[b1x0, b1y0], [b2x0, b2y0]] of entityB.paths) {
        const sinB = Math.sin(-entityB.angle);
        const cosB = Math.cos(-entityB.angle);
        const b1x = (b1x0 * cosB - b1y0 * sinB) + entityB.x;
        const b1y = (b1x0 * sinB + b1y0 * cosB) + entityB.y;
        const b2x = (b2x0 * cosB - b2y0 * sinB) + entityB.x;
        const b2y = (b2x0 * sinB + b2y0 * cosB) + entityB.y;

        const ta = (b1x - b2x) * (a1y - b1y) + (b1y - b2y) * (b1x - a1x);
        const tb = (b1x - b2x) * (a2y - b1y) + (b1y - b2y) * (b1x - a2x);
        const tc = (a1x - a2x) * (b1y - a1y) + (a1y - a2y) * (a1x - b1x);
        const td = (a1x - a2x) * (b2y - a1y) + (a1y - a2y) * (a1x - b2x);

        const crossed = (tc * td < 0 && ta * tb < 0);

        if (crossed) {
          return true;
        }
      }
    }

    return false;
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
