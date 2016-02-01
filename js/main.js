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
    this.lastFrame = Date.now();
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

  getFPS() {
    let now = Date.now();
    let delta = (now - this.lastFrame) / 1000;
    this.lastFrame = now;
    return 1 / delta;
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

    // show FPS
    this.message(`FPS: ${this.getFPS()}`);

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }

  message(value) {
    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.font = '12px monospace';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(value, 0, 0);
    this.ctx.restore();
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

window.addEventListener('DOMContentLoaded', () => {
  console.log('Script Loaded');
  let game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
