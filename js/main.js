'use strict';

import 'fullscreen-api-polyfill';

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

    // physical / logical field size
    this.field = {
      physical: {
        width : undefined,
        height: undefined
      },
      logical: {
        width : undefined,
        height: undefined
      }
    };

    // adjust canvas size to fit to window
    this.scale = window.devicePixelRatio;
    this.handleResizeWindow();

    // create entities
    this.entities = [];
    this.player = new Player(this, 1, 5);
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
    window.addEventListener('resize',     this.handleResizeWindow.bind(this), false);
    window.addEventListener('keydown',    this.handleKeyDown.bind(this),      false);
    window.addEventListener('keyup',      this.handleKeyUp.bind(this),        false);
    window.addEventListener('mousedown',  this.handleMouseDown.bind(this),    false);
    window.addEventListener('mousemove',  this.handleMouseMove.bind(this),    false);
    window.addEventListener('mouseup',    this.handleMouseUp.bind(this),      false);
    window.addEventListener('mouseout',   this.handleMouseUp.bind(this),      false);
    window.addEventListener('touchstart', this.handleTouchStart.bind(this),   false);

    // start!
    this.lastFrame = Date.now();
    window.requestAnimationFrame(this.draw.bind(this));
  }

  handleResizeWindow() {
    this.field.logical.width  = window.innerWidth;
    this.field.logical.height = window.innerHeight;

    this.field.physical.width  = this.field.logical.width  * this.scale;
    this.field.physical.height = this.field.logical.height * this.scale;

    this.canvas.width  = this.field.physical.width;
    this.canvas.height = this.field.physical.height;

    this.ctx.scale(this.scale, this.scale);
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

  handleTouchStart(ev) {
    if (ev.touches.length < 2) {
      return;
    }

    document.body.requestFullscreen();
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
    }

    // clearing canvas
    this.ctx.clearRect(0, 0, this.field.logical.width, this.field.logical.height);

    // drawing entities
    for (let entity of this.entities) {
      entity.draw()
    }

    logger.log(`Canvas (Physical) width: ${this.field.physical.width}, height: ${this.field.physical.height}`);
    logger.log(`        (Logical) width: ${this.field.logical.width}, height: ${this.field.logical.height}`);
    logger.log(`Keyboard [${Array.from(this.pressedKeys).join(', ')}]`);
    logger.log(`Mouse pressed: ${this.mouse.pressed}, x: ${this.mouse.x}, y: ${this.mouse.y}`);

    // show FPS
    logger.log(`FPS: ${this.getFPS().toFixed(2)}`);

    // drawing logs
    logger.draw();

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

class Entity {
  constructor(game) {
    this.ctx = game.ctx;
    this.field = game.field;
  }

  draw() { }
}

class Player extends Entity {
  constructor(game, minSpeed, maxSpeed) {
    super(game);

    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;

    this.x = this.field.logical.width / 2;
    this.y = this.field.logical.height / 2;
    this.angle = 1 / 2 * Math.PI;
    this.speed = 1.0;

    this.path = new Path2D();
    this.path.moveTo( 10,   0);
    this.path.lineTo(-10,  10);
    this.path.lineTo(- 5,   0);
    this.path.lineTo(-10, -10);
    this.path.lineTo( 10,   0);
  }

  changeSpeed(d) {
    this.speed += d;
    this.speed = Math.max(Math.min(this.maxSpeed, this.speed), this.minSpeed);
  }

  turn(d) {
    this.angle += d;
  }

  draw() {
    this.x = (this.field.logical.width  + this.x + Math.cos(this.angle) * this.speed) % this.field.logical.width;
    this.y = (this.field.logical.height + this.y - Math.sin(this.angle) * this.speed) % this.field.logical.height;

    this.ctx.save();
    this.ctx.strokeStyle = 'white';
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(-this.angle);
    this.ctx.stroke(this.path);
    this.ctx.restore();

    logger.log(`Player x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}, angle: ${this.angle.toFixed(2)}, speed: ${this.speed.toFixed(2)}`);
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
