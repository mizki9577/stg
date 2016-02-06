'use strict';

import 'fullscreen-api-polyfill';
import Config from './config.js';

class Game {
  constructor(canvas) {
    // get canvas element and its context
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // pressed keys set and touched fingers map
    this.pressedKeys = new Set();
    this.touches = new Map();

    // mouse info
    this.mouse = {
      pressed: false,
      x: undefined,
      y: undefined
    };

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

    // setup logger
    logger.setContext(this.ctx);

    // add event listeners
    window.addEventListener('resize',      this.handleResizeWindow.bind(this), false);
    window.addEventListener('keydown',     this.handleKeyDown.bind(this),      false);
    window.addEventListener('keyup',       this.handleKeyUp.bind(this),        false);
    window.addEventListener('mousedown',   this.handleMouseDown.bind(this),    false);
    window.addEventListener('mousemove',   this.handleMouseMove.bind(this),    false);
    window.addEventListener('mouseup',     this.handleMouseUp.bind(this),      false);
    window.addEventListener('mouseout',    this.handleMouseUp.bind(this),      false);
    window.addEventListener('touchstart',  this.handleTouchStart.bind(this),   false);
    window.addEventListener('touchmove',   this.handleTouchMove.bind(this),    false);
    window.addEventListener('touchend',    this.handleTouchEnd.bind(this),     false);
    window.addEventListener('touchcancel', this.handleTouchEnd.bind(this),     false);

    // create entities
    this.entities = [];
    this.entities.push(new Player(this));

    // start!
    window.requestAnimationFrame(this.startAnimation.bind(this));
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
    if (ev.touches.length >= 2) {
      document.body.requestFullscreen();
    }

    for (let i = 0; i < ev.changedTouches.length; ++i) {
      this.touches.set(ev.changedTouches[i].identifier, ev.changedTouches[i]);
    }
  }

  handleTouchMove(ev) {
    for (let i = 0; i < ev.changedTouches.length; ++i) {
      this.touches.set(ev.changedTouches[i].identifier, ev.changedTouches[i]);
    }
  }

  handleTouchEnd(ev) {
    for (let i = 0; i < ev.changedTouches.length; ++i) {
      this.touches.delete(ev.changedTouches[i].identifier);
    }
  }

  getFPS() {
    return 1000 / this.frameDuration;
  }

  startAnimation(calledTime) {
    this.lastComputionTime = Date.now();
    this.lastFrameTime = calledTime;
    this.next();
    window.requestAnimationFrame(this.draw.bind(this));
  }

  next() {
    let calledTime = Date.now();
    this.computionDuration = calledTime - this.lastComputionTime;
    this.lastComputionTime = calledTime;

    // mouse action
    if (this.mouse.pressed) {
    }

    for (let entity of this.entities) {
      entity.next(this.computionDuration);
    }

    window.setTimeout(this.next.bind(this), 1000 / Config.FPS);
  }

  draw(calledTime) {
    this.frameDuration = calledTime - this.lastFrameTime;
    this.lastFrameTime = calledTime;

    // clearing canvas
    this.ctx.clearRect(0, 0, this.field.logical.width, this.field.logical.height);

    // drawing entities
    for (let entity of this.entities) {
      entity.draw();
    }

    logger.log(`Canvas   (Physical) width: ${this.field.physical.width}, height: ${this.field.physical.height}`);
    logger.log(`         (Logical ) width: ${this.field.logical.width}, height: ${this.field.logical.height}`);
    logger.log(`Keyboard [${Array.from(this.pressedKeys).join(', ')}]`);
    logger.log(`Mouse    pressed: ${this.mouse.pressed}, x: ${this.mouse.x}, y: ${this.mouse.y}`);
    logger.log(`Touch    [${Array.from(this.touches.values(), (t) => `(${t.clientX.toFixed(2)}, ${t.clientY.toFixed(2)})`).join(', ')}]`);
    logger.log(`FPS      ${this.getFPS().toFixed(2)}`);
    logger.draw();

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

class Entity {
  constructor(game) {
    this.ctx = game.ctx;
    this.field = game.field;
    this.pressedKeys = game.pressedKeys;
  }

  next(elapsed) { }
  draw() { }
}

class Player extends Entity {
  constructor(game) {
    super(game);

    this.minSpeed = Config.Player.minSpeed;
    this.maxSpeed = Config.Player.maxSpeed;

    this.x                   = this.field.logical.width / 2;
    this.y                   = this.field.logical.height / 2;
    this.angle               = Config.Player.initialAngle;
    this.speed               = Config.Player.initialSpeed;
    this.linearAcceleration  = Config.Player.linearAcceleration;
    this.angularAcceleration = Config.Player.angularAcceleration;

    this.path = new Path2D();
    this.path.moveTo( 10,   0);
    this.path.lineTo(-10,  10);
    this.path.lineTo(- 5,   0);
    this.path.lineTo(-10, -10);
    this.path.lineTo( 10,   0);
  }

  next(elapsed) {
    if (this.pressedKeys.has('ArrowUp')) {
      this.speed = clamp(this.speed + this.linearAcceleration * elapsed,
                         this.minSpeed, this.maxSpeed);
    } else if (this.pressedKeys.has('ArrowDown')) {
      this.speed = clamp(this.speed - this.linearAcceleration * elapsed,
                         this.minSpeed, this.maxSpeed);
    }

    if (this.pressedKeys.has('ArrowLeft')) {
      this.angle += this.angularAcceleration * elapsed;
    } else if (this.pressedKeys.has('ArrowRight')) {
      this.angle -= this.angularAcceleration * elapsed;
    }

    this.x = (this.field.logical.width  + this.x + Math.cos(this.angle) * this.speed * elapsed) % this.field.logical.width;
    this.y = (this.field.logical.height + this.y - Math.sin(this.angle) * this.speed * elapsed) % this.field.logical.height;
  }

  draw() {
    this.ctx.save();
    this.ctx.strokeStyle = 'white';
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(-this.angle);
    this.ctx.stroke(this.path);
    this.ctx.restore();

    logger.log(`Player   x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}, angle: ${this.angle.toFixed(2)}, speed: ${this.speed.toFixed(2)}`);
  }
}

class Rock extends Entity {
  constructor(game, x, y, averageRadius, numofVertices) {
    super(game);

    this.x = x;
    this.y = y;

    averageRadius = averageRadius || Math.sqrt(this.field.logical.width * this.field.logical.height) / 16;
    numofVertices = numofVertices || averageRadius / 4;
    console.log(`Rock x: ${x}, y: ${y}, averageRadius: ${averageRadius}, numofVertices: ${numofVertices}`);

    let vertices = [];
    for (let i = 0; i < numofVertices; ++i) {
      vertices.push({
        radius: averageRadius * (0.5 + Math.random() * 1.5),
        angle : 2 * Math.PI * Math.random()
      });
    }
    vertices.sort((a, b) => a.angle - b.angle);

    this.path = new Path2D();
    for (let {radius, angle} of vertices) {
      this.path.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    this.path.closePath();
  }

  draw(elapsed) {
    this.ctx.save();
    this.ctx.strokeStyle = 'white';
    this.ctx.translate(this.x, this.y)
    this.ctx.stroke(this.path);
    this.ctx.restore();

    logger.log(`Rock x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}`);
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

let clamp = (value, min, max) => Math.min(Math.max(min, value), max);

let logger = new Logger();

window.addEventListener('DOMContentLoaded', () => {
  console.log('Script Loaded');
  let game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
