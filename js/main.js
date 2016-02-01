'use strict';

class Game {
  constructor(canvas) {
    // get canvas element and its context
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // pressed keys set
    this.pressedKeys = new Set();

    // adjust canvas size to fit to window
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // create entities
    this.player = new Player(this.canvas.width, this.canvas.height, 1, 5);

    // add event listeners
    window.addEventListener('resize', this.handleResizeWindow.bind(this), false);
    window.addEventListener('keydown', this.handleKeyDown.bind(this), false);
    window.addEventListener('keyup', this.handleKeyUp.bind(this), false);

    // start!
    window.requestAnimationFrame(this.draw.bind(this));
  }

  handleResizeWindow() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.player.canvasWidth = this.canvas.width;
    this.player.canvasHeight = this.canvas.height;
  }

  handleKeyDown(ev) {
    this.pressedKeys.add(ev.code);
  }

  handleKeyUp(ev) {
    this.pressedKeys.delete(ev.code);
  }

  draw() {
    // keyboard action
    if (this.pressedKeys.has('ArrowUp')) {
      this.player.changeSpeed(+0.1);
    } else if (this.pressedKeys.has('ArrowDown')) {
      this.player.changeSpeed(-0.1);
    } else if (this.pressedKeys.has('ArrowLeft')) {
      this.player.turn(+0.1);
    } else if (this.pressedKeys.has('ArrowRight')) {
      this.player.turn(-0.1);
    }

    // clearing canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // styles and transformations
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.save();

    // drawing
    this.ctx.translate(this.player.x, this.player.y)
    this.ctx.rotate(-this.player.angle);
    this.ctx.stroke(this.player.path());

    // restoreing context
    this.ctx.restore();

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

class Player {
  constructor(width, height, minSpeed, maxSpeed) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;

    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;
    this.angle = 1 / 2 * Math.PI;
    this.speed = 1.0;
  }

  changeSpeed(d) {
    this.speed += d;
    this.speed = Math.max(Math.min(this.maxSpeed, this.speed), this.minSpeed);
  }

  turn(d) {
    this.angle += d;
  }

  path() {
    debuglog(this);
    this.x = (this.canvasWidth  + this.x + Math.cos(this.angle) * this.speed) % this.canvasWidth;
    this.y = (this.canvasHeight + this.y - Math.sin(this.angle) * this.speed) % this.canvasHeight;

    let body = new Path2D();

    body.moveTo(10, 0);
    body.lineTo(-10, 10);
    body.lineTo(-5, 0);
    body.lineTo(-10, -10);
    body.lineTo(10, 0);
    body.lineTo(-5, 0);

    return body;
  }
}

let debuglog = (val) => {
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.save();
  ctx.resetTransform();
  ctx.font = 'monospace 16';
  ctx.fillText(val.toSource(), 10, 10);
  ctx.restore();
};

window.addEventListener('DOMContentLoaded', () => {
  console.log('Script Loaded');
  let game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
