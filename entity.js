'use strict';

import SIMD from 'simd';

class Entity {
  constructor(game, paths, strokeStyle=game.defaultStrokeStyle) {
    this.game = game;
    this.ctx = game.ctx;
    this.logger = game.logger;
    this.field = game.field;
    this.pressedKeys = game.pressedKeys;
    this.strokeStyle = strokeStyle;

    if (paths) {
      this.createPath(paths);
    }
  }

  createPath(paths) {
    this.canvasPath = new Path2D();

    for (let path of paths) {
      let [x, y] = path[0];
      this.canvasPath.moveTo(x, y);
      for (let point of path.slice(1)) {
        let [x, y] = point;
        this.canvasPath.lineTo(x, y);
      }
    }

    this.paths = new Set();
    for (let path of paths) {
      let length = path.length - 1;
      for (let i = 0; i < length; ++i) {
        this.paths.add([path[i], path[i + 1]]);
      }
    }
  }

  isCollidedWith(other) {
    let points = new Float32Array(4);

    for (let [[ax, ay], [bx, by]] of this.paths) {
      const this_angle_sincos  = SIMD.Float32x4(Math.sin(-this.angle),  Math.sin(-this.angle),  Math.cos(-this.angle),  Math.cos(-this.angle));
      let axybxy = SIMD.Float32x4.add(
          SIMD.Float32x4.add(
            SIMD.Float32x4.mul(
              SIMD.Float32x4(ax, ax, bx, bx),
              SIMD.Float32x4.swizzle(this_angle_sincos, 2, 0, 3, 1)
            ),
            SIMD.Float32x4.mul(
              SIMD.Float32x4(-ay, ay, -by, by),
              SIMD.Float32x4.swizzle(this_angle_sincos, 0, 2, 1, 3)
            )
          ),
          SIMD.Float32x4(this.x, this.y, this.x, this.y)
        );
        SIMD.Float32x4.store(points, 0, axybxy);
        [ax, ay, bx, by] = points;

      for (let [[cx, cy], [dx, dy]] of other.paths) {
        const other_angle_sincos = SIMD.Float32x4(Math.sin(-other.angle), Math.sin(-other.angle), Math.cos(-other.angle), Math.cos(-other.angle));
        let cxydxy = SIMD.Float32x4.add(
            SIMD.Float32x4.add(
              SIMD.Float32x4.mul(
                SIMD.Float32x4(cx, cx, dx, dx),
                SIMD.Float32x4.swizzle(other_angle_sincos, 2, 0, 3, 1)
              ),
              SIMD.Float32x4.mul(
                SIMD.Float32x4(-cy, cy, -dy, dy),
                SIMD.Float32x4.swizzle(other_angle_sincos, 0, 2, 1, 3)
              )
            ),
            SIMD.Float32x4(other.x, other.y, other.x, other.y)
          );

        SIMD.Float32x4.store(points, 0, cxydxy);
        [cx, cy, dx, dy] = points;

        let ccaax = SIMD.Float32x4(cx, cx, ax, ax);
        let ddbbx = SIMD.Float32x4(dx, dx, bx, bx);
        let abcdy = SIMD.Float32x4(ay, by, cy, dy);
        let ccaay = SIMD.Float32x4(cy, cy, ay, ay);
        let ddbby = SIMD.Float32x4(dy, dy, by, by);
        let abcdx = SIMD.Float32x4(ax, bx, cx, dx);

        let t = (
            SIMD.Float32x4.add(
              SIMD.Float32x4.mul(
                SIMD.Float32x4.sub(ccaax, ddbbx),
                SIMD.Float32x4.sub(abcdy, ccaay)
              ),
              SIMD.Float32x4.mul(
                SIMD.Float32x4.sub(ccaay, ddbby),
                SIMD.Float32x4.sub(ccaax, abcdx)
              )
            )
          );
        let crossed = SIMD.Bool32x4.allTrue(
            SIMD.Float32x4.lessThan(
              SIMD.Float32x4.mul(
                SIMD.Float32x4.swizzle(t, 0, 2, 1, 3),
                SIMD.Float32x4.swizzle(t, 1, 3, 0, 2)
              ),
              SIMD.Float32x4.splat(0)
            )
          );

        if (crossed) {
          return true;
        }
      }
    }

    return false;
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
