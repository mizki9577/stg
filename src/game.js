'use strict';

import 'fullscreen-api-polyfill';
import JoyStick from './joystick';
import Entity   from './entity';
import Player   from './player';
import Rock     from './rock';
import {hypot}  from './misc';
import {Logger} from './misc';
import Config   from './config';

class Game {
  constructor(canvas) {
    // get canvas element and its context
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.defaultStrokeStyle = 'white';

    // pressed keys set
    this.pressedKeys = new Set();

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
    this.logger = new Logger(document.getElementById('log'));
    this.logger.add('Canvas (Physical)');
    this.logger.add('Canvas (Logical)');
    this.logger.add('Keyboard');
    this.logger.add('Mouse');
    this.logger.add('Time');
    this.logger.add('FPS');

    // setup joysticks
    this.joyStickSize = Math.min(this.field.logical.width, this.field.logical.height) / 3;
    this.leftJoyStick = new JoyStick(this, document.getElementById('leftJoyStick'), this.joyStickSize);

    // add event listeners
    window.addEventListener('resize',           this.handleResizeWindow.bind(this),     false);
    window.addEventListener('keydown',          this.handleKeyDown.bind(this),          false);
    window.addEventListener('keyup',            this.handleKeyUp.bind(this),            false);
    window.addEventListener('mousedown',        this.handleMouseDown.bind(this),        false);
    window.addEventListener('mousemove',        this.handleMouseMove.bind(this),        false);
    window.addEventListener('mouseup',          this.handleMouseUp.bind(this),          false);
    window.addEventListener('mouseout',         this.handleMouseUp.bind(this),          false);
    window.addEventListener('touchstart',       this.handleTouchStart.bind(this),       false);
    window.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this), false);

    // create entities
    this.player = new Player(this, Config.Player);
    this.entities = [];
    this.entities.push(this.player);

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
    if (!document.fullscreenEnabled) {
      document.body.requestFullscreen();
    }
  }

  handleFullscreenChange(ev) {
    this.leftJoyStick.isEnabled = document.fullscreenEnabled;
  }

  getFPS() {
    return 1000 / this.frameDuration;
  }

  detectCollidedEntities() {
    const length = this.entities.length;
    for (let i = 0; i < length - 1; ++i) {
      let minimunDistance = Infinity;
      let nearestEntity;

      for (let j = i + 1; j < length; ++j) {
        const distance = hypot(this.entities[i].x, this.entities[i].y, this.entities[j].x, this.entities[j].y);
        if (distance < minimunDistance) {
          minimunDistance = distance;
          nearestEntity = this.entities[j];
        }
      }

      // NOTE: 暫定措置
      if (Entity.areTheyCollided(this.entities[i], nearestEntity)) {
        if (!(this.entities[i] instanceof Player)) {
          this.entities[i].die();
        } else {
          nearestEntity.die();
        }
      }
    }
  }

  deleteDiedEntity() {
    for (const entity of this.entities) {
      if (entity.died) {
        this.entities.splice(this.entities.indexOf(entity), 1);
      }
    }
  }

  spawnEnemy() {
    // NOTE: 暫定措置
    if ((this.lastComputionTime - this.animationStartedTime) % Config.rockSpawnInterval < 100) {
      if (!this.rockSpawned) {
        this.entities.push(new Rock(this));
        this.rockSpawned = true;
      }
    } else {
      this.rockSpawned = false;
    }
  }

  startAnimation(calledTime) {
    const now = Date.now();
    this.animationStartedTime = now;
    this.lastComputionTime = now;
    this.lastFrameTime = calledTime;
    this.next();
    window.requestAnimationFrame(this.draw.bind(this));
  }

  next() {
    const calledTime = Date.now();
    this.computionDuration = calledTime - this.lastComputionTime;
    this.lastComputionTime = calledTime;

    this.spawnEnemy();

    for (const entity of this.entities) {
      entity.next(this.computionDuration);
    }

    this.detectCollidedEntities();
    this.deleteDiedEntity();

    window.setTimeout(this.next.bind(this), 1000 / Config.FPS);
  }

  draw(calledTime) {
    this.frameDuration = calledTime - this.lastFrameTime;
    this.lastFrameTime = calledTime;

    // clearing canvas
    this.ctx.clearRect(0, 0, this.field.logical.width, this.field.logical.height);

    this.ctx.save();
    this.ctx.translate(this.field.logical.width / 2 - this.player.x, this.field.logical.height / 2 - this.player.y);

    this.ctx.save();
    this.ctx.strokeStyle = this.defaultStrokeStyle;
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.field.logical.width, this.field.logical.height);
    this.ctx.stroke();
    this.ctx.restore();

    // drawing entities
    for (const entity of this.entities) {
      entity.draw();
    }

    this.ctx.restore();

    this.leftJoyStick.draw();

    this.logger.update('Canvas (Physical)', [`width: ${this.field.physical.width}`, `height: ${this.field.physical.height}`]);
    this.logger.update('Canvas (Logical)',  [`width: ${this.field.logical.width}`, `height: ${this.field.logical.height}`]);
    this.logger.update('Keyboard',          Array.from(this.pressedKeys));
    this.logger.update('Mouse',             [`pressed: ${this.mouse.pressed}`, `x: ${this.mouse.x}`, `y: ${this.mouse.y}`]);
    this.logger.update('Time',              [Date.now() - this.animationStartedTime]);
    this.logger.update('FPS',               [this.getFPS().toFixed(2)]);

    // requesting next method call
    window.requestAnimationFrame(this.draw.bind(this));
  }
}

export default Game;

// vim: set ts=2 sw=2 et:
