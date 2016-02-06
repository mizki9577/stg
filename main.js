'use strict';

import 'fullscreen-api-polyfill';
import Config from './config.js';

class Game {
  constructor(canvas) {
    // get canvas element and its context
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.defaultStrokeStyle = 'white';

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
    let now = Date.now();
    this.animationStartedTime = now;
    this.lastComputionTime = now;
    this.lastFrameTime = calledTime;
    this.next();
    window.requestAnimationFrame(this.draw.bind(this));
  }

  next() {
    let calledTime = Date.now();
    this.computionDuration = calledTime - this.lastComputionTime;
    this.lastComputionTime = calledTime;

    if ((calledTime - this.animationStartedTime) % Config.rockSpawnInterval < 100) {
      if (!this.rockSpawned) {
        this.entities.push(new Rock(this));
        this.rockSpawned = true;
      }
    } else {
      this.rockSpawned = false;
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
    logger.log(`Time     ${Date.now() - this.animationStartedTime}`);
    logger.log(`FPS      ${this.getFPS().toFixed(2)}`);
    logger.draw();

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

class Entity {
  constructor(game, pathes, strokeStyle=game.defaultStrokeStyle) {
    this.ctx = game.ctx;
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

class Player extends Entity {
  constructor(game) {
    super(game, Config.Player.path);

    this.minSpeed = Config.Player.minSpeed;
    this.maxSpeed = Config.Player.maxSpeed;

    this.x                   = this.field.logical.width / 2;
    this.y                   = this.field.logical.height / 2;
    this.dx                  = 0;
    this.dy                  = 0;
    this.angle               = Config.Player.initialAngle;
    this.speed               = Config.Player.initialSpeed;

    this.linearAcceleration  = Config.Player.linearAcceleration;
    this.angularAcceleration = Config.Player.angularAcceleration;
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

    this.dx =  this.speed * Math.cos(this.angle) * elapsed;
    this.dy = -this.speed * Math.sin(this.angle) * elapsed;

    this.x = modulo(this.x + this.dx, this.field.logical.width );
    this.y = modulo(this.y + this.dy, this.field.logical.height);
  }

  draw() {
    super.draw();
    logger.log(`Player   x: ${this.x.toFixed(2)}, y: ${this.y.toFixed(2)}, dx: ${this.dx.toFixed(2)}, dy: ${this.dy.toFixed(2)}, angle: ${this.angle.toFixed(2)}, speed: ${this.speed.toFixed(2)}`);
  }
}

class Rock extends Entity {
  constructor(game) {
    super(game);

    this.x = Math.random() < 0.5 ? 10 : this.field.logical.width  - 10;
    this.y = Math.random() < 0.5 ? 10 : this.field.logical.height - 10;
    this.angle = 0;

    this.dx = (Math.random() - 0.5) * 2;
    this.dy = (Math.random() - 0.5) * 2;
    this.angularAcceleration = (Math.random() - 0.5) / 100;

    let averageRadius = Math.sqrt(this.field.logical.width * this.field.logical.height) / 16;
    let numofVertices = averageRadius / 4;

    let vertices = [];
    for (let i = 0; i < numofVertices; ++i) {
      vertices.push({
        radius: averageRadius * (0.5 + Math.random() * 1.5),
        angle : 2 * Math.PI * Math.random()
      });
    }
    vertices.sort((a, b) => a.angle - b.angle);
    vertices = vertices.map(({radius, angle}) => [radius * Math.cos(angle), radius * Math.sin(angle)]);

    vertices.push(vertices[0]);
    this.createPath([vertices]);
  }

  next() {
    this.x += this.dx;
    this.y += this.dy;
    this.angle += this.angularAcceleration;
  }

  draw(elapsed) {
    super.draw();
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
let modulo = (value, max) => (max + value) % max;

let logger = new Logger();

window.addEventListener('DOMContentLoaded', () => {
  console.log('Script Loaded');
  let game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
