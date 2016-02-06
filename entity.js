'use strict';

class Entity {
  constructor(game, pathes, strokeStyle=game.defaultStrokeStyle) {
    this.game = game;
    this.ctx = game.ctx;
    this.logger = game.logger;
    this.field = game.field;
    this.pressedKeys = game.pressedKeys;
    this.strokeStyle = strokeStyle;

    if (pathes) {
      this.createPath(pathes);
    }
  }

  createPath(pathes) {
    this.canvasPath = new Path2D();

    for (let path of pathes) {
      let [x, y] = path[0];
      this.canvasPath.moveTo(x, y);
      for (let point of path.slice(1)) {
        let [x, y] = point;
        this.canvasPath.lineTo(x, y);
      }
    }

    this.pathes = new Set();
    for (let path of pathes) {
      let length = path.length - 1;
      for (let i = 0; i < length; ++i) {
        this.pathes.add([path[i], path[i + 1]]);
      }
    }
  }

  next(elapsed) { }

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
