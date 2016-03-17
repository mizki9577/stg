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

  static areTheyCollided(entityA, entityB) {
    const ctx = Game.ctx;
    for (const [[a1x, a1y], [a2x, a2y]] of entityA.pathsInField()) {
      for (const [[b1x, b1y], [b2x, b2y]] of entityB.pathsInField()) {
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
