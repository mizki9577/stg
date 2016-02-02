'use strict';

class Game {
  constructor(canvas) {
    // get canvas element and its context
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // pressed keys set
    this.pressedKeys = new Set();

    // mouse info
    this.mouse = {
      pressed: false,
      x: undefined,
      y: undefined
    }

    // adjust canvas size to fit to window
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // create entities
    this.entities = [];
    this.player = new Player(this.ctx, 1, 5);
    this.entities.push(this.player);

    // setup logger
    logger.setContext(this.ctx);

    // define keyboard reactions
    this.actions = new Map([
        ['ArrowUp',    () => { this.player.changeSpeed(+0.1); }],
        ['ArrowDown',  () => { this.player.changeSpeed(-0.1); }],
        ['ArrowLeft',  () => { this.player.turn(+0.1); }],
        ['ArrowRight', () => { this.player.turn(-0.1); }],
    ]);

    // add event listeners
    window.addEventListener('resize', this.handleResizeWindow.bind(this), false);
    window.addEventListener('keydown', this.handleKeyDown.bind(this), false);
    window.addEventListener('keyup', this.handleKeyUp.bind(this), false);
    window.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    window.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    window.addEventListener('mouseout', this.handleMouseUp.bind(this), false);

    // start!
    this.lastFrame = Date.now();
    window.requestAnimationFrame(this.draw.bind(this));
  }

  handleResizeWindow() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleKeyDown(ev) {
    this.pressedKeys.add(ev.code);
  }

  handleKeyUp(ev) {
    this.pressedKeys.delete(ev.code);
  }

  handleMouseDown(ev) {
    this.mouse.pressed = true;
  }

  handleMouseMove(ev) {
    this.mouse.x = ev.clientX;
    this.mouse.y = ev.clientY;
  }

  handleMouseUp(ev) {
    this.mouse.pressed = false;
  }

  getFPS() {
    let now = Date.now();
    let delta = (now - this.lastFrame) / 1000;
    this.lastFrame = now;
    return 1 / delta;
  }

  draw() {
    // keyboard action
    for (let [key, fn] of this.actions) {
      if (this.pressedKeys.has(key)) {
        fn();
      }
    };

    // mouse action
    if (this.mouse.pressed) {
      logger.log(`mouse x: ${this.mouse.x}, y: ${this.mouse.y}`);
    }

    // clearing canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // drawing entities
    for (let entity of this.entities) {
      entity.draw()
    }

    // show FPS
    logger.log(`FPS: ${this.getFPS()}`);

    // drawing logs
    logger.draw();

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

class Entity {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw() { }
}

class Player extends Entity {
  constructor(ctx, minSpeed, maxSpeed) {
    super(ctx);

    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;

    this.x = this.ctx.canvas.width / 2;
    this.y = this.ctx.canvas.height / 2;
    this.angle = 1 / 2 * Math.PI;
    this.speed = 1.0;

    this.path = new Path2D();
    this.path.moveTo(10, 0);
    this.path.lineTo(-10, 10);
    this.path.lineTo(-5, 0);
    this.path.lineTo(-10, -10);
    this.path.lineTo(10, 0);
  }

  changeSpeed(d) {
    this.speed += d;
    this.speed = Math.max(Math.min(this.maxSpeed, this.speed), this.minSpeed);
  }

  turn(d) {
    this.angle += d;
  }

  draw() {
    this.x = (this.ctx.canvas.width  + this.x + Math.cos(this.angle) * this.speed) % this.ctx.canvas.width;
    this.y = (this.ctx.canvas.height + this.y - Math.sin(this.angle) * this.speed) % this.ctx.canvas.height;

    this.ctx.save();
    this.ctx.strokeStyle = 'white';
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(-this.angle);
    this.ctx.stroke(this.path);
    this.ctx.restore();
  }
}

class Logger {
  constructor() {
    this.messages = [];
  }

  setContext(ctx) {
    this.ctx = ctx;
  }

  log(message) {
    this.messages.push(message);
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px monospace';
    this.ctx.textBaseline = 'top';

    let length = this.messages.length;
    for (let i = 0; i < length; ++i) {
      this.ctx.fillText(this.messages[i], 0, i * 12);
    }
    this.messages.splice(0);

    this.ctx.restore();
  }
}

let logger = new Logger();

window.addEventListener('DOMContentLoaded', () => {
  console.log('Script Loaded');
  let game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
