(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(canvas) {
    var _this = this;

    _classCallCheck(this, Game);

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
    };

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
    this.actions = new Map([['ArrowUp', function () {
      _this.player.changeSpeed(+0.1);
    }], ['ArrowDown', function () {
      _this.player.changeSpeed(-0.1);
    }], ['ArrowLeft', function () {
      _this.player.turn(+0.1);
    }], ['ArrowRight', function () {
      _this.player.turn(-0.1);
    }]]);

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

  _createClass(Game, [{
    key: 'handleResizeWindow',
    value: function handleResizeWindow() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(ev) {
      this.pressedKeys.add(ev.code);
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(ev) {
      this.pressedKeys.delete(ev.code);
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(ev) {
      this.mouse.pressed = true;
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(ev) {
      this.mouse.x = ev.clientX;
      this.mouse.y = ev.clientY;
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(ev) {
      this.mouse.pressed = false;
    }
  }, {
    key: 'getFPS',
    value: function getFPS() {
      var now = Date.now();
      var delta = (now - this.lastFrame) / 1000;
      this.lastFrame = now;
      return 1 / delta;
    }
  }, {
    key: 'draw',
    value: function draw() {
      // keyboard action
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var key = _step$value[0];
          var fn = _step$value[1];

          if (this.pressedKeys.has(key)) {
            fn();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ;

      // mouse action
      if (this.mouse.pressed) {}

      // clearing canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // drawing entities
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.entities[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var entity = _step2.value;

          entity.draw();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      logger.log('Game canvas.width: ' + this.canvas.width + ', canvas.height: ' + this.canvas.height);
      logger.log('Keyboard [' + Array.from(this.pressedKeys).join(', ') + ']');
      logger.log('Mouse pressed: ' + this.mouse.pressed + ', x: ' + this.mouse.x + ', y: ' + this.mouse.y);

      // show FPS
      logger.log('FPS: ' + this.getFPS().toFixed(2));

      // drawing logs
      logger.draw();

      // requesting next method call
      window.requestAnimationFrame(this.draw.bind(this));
    }
  }]);

  return Game;
}();

var Entity = function () {
  function Entity(ctx) {
    _classCallCheck(this, Entity);

    this.ctx = ctx;
  }

  _createClass(Entity, [{
    key: 'draw',
    value: function draw() {}
  }]);

  return Entity;
}();

var Player = function (_Entity) {
  _inherits(Player, _Entity);

  function Player(ctx, minSpeed, maxSpeed) {
    _classCallCheck(this, Player);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, ctx));

    _this2.minSpeed = minSpeed;
    _this2.maxSpeed = maxSpeed;

    _this2.x = _this2.ctx.canvas.width / 2;
    _this2.y = _this2.ctx.canvas.height / 2;
    _this2.angle = 1 / 2 * Math.PI;
    _this2.speed = 1.0;

    _this2.path = new Path2D();
    _this2.path.moveTo(10, 0);
    _this2.path.lineTo(-10, 10);
    _this2.path.lineTo(-5, 0);
    _this2.path.lineTo(-10, -10);
    _this2.path.lineTo(10, 0);
    return _this2;
  }

  _createClass(Player, [{
    key: 'changeSpeed',
    value: function changeSpeed(d) {
      this.speed += d;
      this.speed = Math.max(Math.min(this.maxSpeed, this.speed), this.minSpeed);
    }
  }, {
    key: 'turn',
    value: function turn(d) {
      this.angle += d;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.x = (this.ctx.canvas.width + this.x + Math.cos(this.angle) * this.speed) % this.ctx.canvas.width;
      this.y = (this.ctx.canvas.height + this.y - Math.sin(this.angle) * this.speed) % this.ctx.canvas.height;

      this.ctx.save();
      this.ctx.strokeStyle = 'white';
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(-this.angle);
      this.ctx.stroke(this.path);
      this.ctx.restore();

      logger.log('Player x: ' + this.x.toFixed(2) + ', y: ' + this.y.toFixed(2) + ', angle: ' + this.angle.toFixed(2) + ', speed: ' + this.speed.toFixed(2));
    }
  }]);

  return Player;
}(Entity);

var Logger = function () {
  function Logger() {
    _classCallCheck(this, Logger);

    this.messages = [];
  }

  _createClass(Logger, [{
    key: 'setContext',
    value: function setContext(ctx) {
      this.ctx = ctx;
    }
  }, {
    key: 'log',
    value: function log(message) {
      this.messages.push(message);
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.ctx.save();
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px monospace';
      this.ctx.textBaseline = 'top';

      var length = this.messages.length;
      for (var i = 0; i < length; ++i) {
        this.ctx.fillText(this.messages[i], 0, i * 12);
      }
      this.messages.splice(0);

      this.ctx.restore();
    }
  }]);

  return Logger;
}();

var logger = new Logger();

window.addEventListener('DOMContentLoaded', function () {
  console.log('Script Loaded');
  var game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7OztJQUVNO0FBQ0osV0FESSxJQUNKLENBQVksTUFBWixFQUFvQjs7OzBCQURoQixNQUNnQjs7O0FBRWxCLFNBQUssTUFBTCxHQUFjLE1BQWQsQ0FGa0I7QUFHbEIsU0FBSyxHQUFMLEdBQVcsS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixDQUFYOzs7QUFIa0IsUUFNbEIsQ0FBSyxXQUFMLEdBQW1CLElBQUksR0FBSixFQUFuQjs7O0FBTmtCLFFBU2xCLENBQUssS0FBTCxHQUFhO0FBQ1gsZUFBUyxLQUFUO0FBQ0EsU0FBRyxTQUFIO0FBQ0EsU0FBRyxTQUFIO0tBSEY7OztBQVRrQixRQWdCbEIsQ0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixPQUFPLFVBQVAsQ0FoQkY7QUFpQmxCLFNBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsT0FBTyxXQUFQOzs7QUFqQkgsUUFvQmxCLENBQUssUUFBTCxHQUFnQixFQUFoQixDQXBCa0I7QUFxQmxCLFNBQUssTUFBTCxHQUFjLElBQUksTUFBSixDQUFXLEtBQUssR0FBTCxFQUFVLENBQXJCLEVBQXdCLENBQXhCLENBQWQsQ0FyQmtCO0FBc0JsQixTQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEtBQUssTUFBTCxDQUFuQjs7O0FBdEJrQixVQXlCbEIsQ0FBTyxVQUFQLENBQWtCLEtBQUssR0FBTCxDQUFsQjs7O0FBekJrQixRQTRCbEIsQ0FBSyxPQUFMLEdBQWUsSUFBSSxHQUFKLENBQVEsQ0FDbkIsQ0FBQyxTQUFELEVBQWUsWUFBTTtBQUFFLFlBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsQ0FBQyxHQUFELENBQXhCLENBQUY7S0FBTixDQURJLEVBRW5CLENBQUMsV0FBRCxFQUFlLFlBQU07QUFBRSxZQUFLLE1BQUwsQ0FBWSxXQUFaLENB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QURJOzsrQkFLTyxLQUFLO0FBQ2QsV0FBSyxHQUFMLEdBQVcsR0FBWCxDQURjOzs7O3dCQUlaLFNBQVM7QUFDWCxXQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLE9BQW5CLEVBRFc7Ozs7MkJBSU47QUFDTCxXQUFLLEdBQUwsQ0FBUyxJQUFULEdBREs7QUFFTCxXQUFLLEdBQUwsQ0FBUyxTQUFULEdBQXFCLE9BQXJCLENBRks7QUFHTCxXQUFLLEdBQUwsQ0FBUyxJQUFULEdBQWdCLGdCQUFoQixDQUhLO0FBSUwsV0FBSyxHQUFMLENBQVMsWUFBVCxHQUF3QixLQUF4QixDQUpLOztBQU1MLFVBQUksU0FBUyxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBTlI7QUFPTCxXQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxNQUFKLEVBQVksRUFBRSxDQUFGLEVBQUs7QUFDL0IsYUFBSyxHQUFMLENBQVMsUUFBVCxDQUFrQixLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQWxCLEVBQW9DLENBQXBDLEVBQXVDLElBQUksRUFBSixDQUF2QyxDQUQrQjtPQUFqQztBQUdBLFdBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsQ0FBckIsRUFWSzs7QUFZTCxXQUFLLEdBQUwsQ0FBUyxPQUFULEdBWks7Ozs7U0FiSDs7O0FBNkJOLElBQUksU0FBUyxJQUFJLE1BQUosRUFBVDs7QUFFSixPQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxZQUFNO0FBQ2hELFVBQVEsR0FBUixDQUFZLGVBQVosRUFEZ0Q7QUFFaEQsTUFBSSxPQUFPLElBQUksSUFBSixDQUFTLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFULENBQVAsQ0FGNEM7Q0FBTixDQUE1QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcbiAgICAvLyBnZXQgY2FudmFzIGVsZW1lbnQgYW5kIGl0cyBjb250ZXh0XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLy8gcHJlc3NlZCBrZXlzIHNldFxuICAgIHRoaXMucHJlc3NlZEtleXMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBtb3VzZSBpbmZvXG4gICAgdGhpcy5tb3VzZSA9IHtcbiAgICAgIHByZXNzZWQ6IGZhbHNlLFxuICAgICAgeDogdW5kZWZpbmVkLFxuICAgICAgeTogdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgLy8gYWRqdXN0IGNhbnZhcyBzaXplIHRvIGZpdCB0byB3aW5kb3dcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIC8vIGNyZWF0ZSBlbnRpdGllc1xuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcy5jdHgsIDEsIDUpO1xuICAgIHRoaXMuZW50aXRpZXMucHVzaCh0aGlzLnBsYXllcik7XG5cbiAgICAvLyBzZXR1cCBsb2dnZXJcbiAgICBsb2dnZXIuc2V0Q29udGV4dCh0aGlzLmN0eCk7XG5cbiAgICAvLyBkZWZpbmUga2V5Ym9hcmQgcmVhY3Rpb25zXG4gICAgdGhpcy5hY3Rpb25zID0gbmV3IE1hcChbXG4gICAgICAgIFsnQXJyb3dVcCcsICAgICgpID0+IHsgdGhpcy5wbGF5ZXIuY2hhbmdlU3BlZWQoKzAuMSk7IH1dLFxuICAgICAgICBbJ0Fycm93RG93bicsICAoKSA9PiB7IHRoaXMucGxheWVyLmNoYW5nZVNwZWVkKC0wLjEpOyB9XSxcbiAgICAgICAgWydBcnJvd0xlZnQnLCAgKCkgPT4geyB0aGlzLnBsYXllci50dXJuKCswLjEpOyB9XSxcbiAgICAgICAgWydBcnJvd1JpZ2h0JywgKCkgPT4geyB0aGlzLnBsYXllci50dXJuKC0wLjEpOyB9XSxcbiAgICBdKTtcblxuICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lcnNcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5oYW5kbGVSZXNpemVXaW5kb3cuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZU1vdXNlTW92ZS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZU1vdXNlVXAuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuaGFuZGxlTW91c2VVcC5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAvLyBzdGFydCFcbiAgICB0aGlzLmxhc3RGcmFtZSA9IERhdGUubm93KCk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIH1cblxuICBoYW5kbGVSZXNpemVXaW5kb3coKSB7XG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cblxuICBoYW5kbGVLZXlEb3duKGV2KSB7XG4gICAgdGhpcy5wcmVzc2VkS2V5cy5hZGQoZXYuY29kZSk7XG4gIH1cblxuICBoYW5kbGVLZXlVcChldikge1xuICAgIHRoaXMucHJlc3NlZEtleXMuZGVsZXRlKGV2LmNvZGUpO1xuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duKGV2KSB7XG4gICAgdGhpcy5tb3VzZS5wcmVzc2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShldikge1xuICAgIHRoaXMubW91c2UueCA9IGV2LmNsaWVudFg7XG4gICAgdGhpcy5tb3VzZS55ID0gZXYuY2xpZW50WTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAoZXYpIHtcbiAgICB0aGlzLm1vdXNlLnByZXNzZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldEZQUygpIHtcbiAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBsZXQgZGVsdGEgPSAobm93IC0gdGhpcy5sYXN0RnJhbWUpIC8gMTAwMDtcbiAgICB0aGlzLmxhc3RGcmFtZSA9IG5vdztcbiAgICByZXR1cm4gMSAvIGRlbHRhO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICAvLyBrZXlib2FyZCBhY3Rpb25cbiAgICBmb3IgKGxldCBba2V5LCBmbl0gb2YgdGhpcy5hY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5wcmVzc2VkS2V5cy5oYXMoa2V5KSkge1xuICAgICAgICBmbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBtb3VzZSBhY3Rpb25cbiAgICBpZiAodGhpcy5tb3VzZS5wcmVzc2VkKSB7XG4gICAgfVxuXG4gICAgLy8gY2xlYXJpbmcgY2FudmFzXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgLy8gZHJhd2luZyBlbnRpdGllc1xuICAgIGZvciAobGV0IGVudGl0eSBvZiB0aGlzLmVudGl0aWVzKSB7XG4gICAgICBlbnRpdHkuZHJhdygpXG4gICAgfVxuXG4gICAgbG9nZ2VyLmxvZyhgR2FtZSBjYW52YXMud2lkdGg6ICR7dGhpcy5jYW52YXMud2lkdGh9LCBjYW52YXMuaGVpZ2h0OiAke3RoaXMuY2FudmFzLmhlaWdodH1gKTtcbiAgICBsb2dnZXIubG9nKGBLZXlib2FyZCBbJHtBcnJheS5mcm9tKHRoaXMucHJlc3NlZEtleXMpLmpvaW4oJywgJyl9XWApO1xuICAgIGxvZ2dlci5sb2coYE1vdXNlIHByZXNzZWQ6ICR7dGhpcy5tb3VzZS5wcmVzc2VkfSwgeDogJHt0aGlzLm1vdXNlLnh9LCB5OiAke3RoaXMubW91c2UueX1gKTtcblxuICAgIC8vIHNob3cgRlBTXG4gICAgbG9nZ2VyLmxvZyhgRlBTOiAke3RoaXMuZ2V0RlBTKCkudG9GaXhlZCgyKX1gKTtcblxuICAgIC8vIGRyYXdpbmcgbG9nc1xuICAgIGxvZ2dlci5kcmF3KCk7XG5cbiAgICAvLyByZXF1ZXN0aW5nIG5leHQgbWV0aG9kIGNhbGxcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5jbGFzcyBFbnRpdHkge1xuICBjb25zdHJ1Y3RvcihjdHgpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgfVxuXG4gIGRyYXcoKSB7IH1cbn1cblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5IHtcbiAgY29uc3RydWN0b3IoY3R4LCBtaW5TcGVlZCwgbWF4U3BlZWQpIHtcbiAgICBzdXBlcihjdHgpO1xuXG4gICAgdGhpcy5taW5TcGVlZCA9IG1pblNwZWVkO1xuICAgIHRoaXMubWF4U3BlZWQgPSBtYXhTcGVlZDtcblxuICAgIHRoaXMueCA9IHRoaXMuY3R4LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgdGhpcy55ID0gdGhpcy5jdHguY2FudmFzLmhlaWdodCAvIDI7XG4gICAgdGhpcy5hbmdsZSA9IDEgLyAyICogTWF0aC5QSTtcbiAgICB0aGlzLnNwZWVkID0gMS4wO1xuXG4gICAgdGhpcy5wYXRoID0gbmV3IFBhdGgyRCgpO1xuICAgIHRoaXMucGF0aC5tb3ZlVG8oMTAsIDApO1xuICAgIHRoaXMucGF0aC5saW5lVG8oLTEwLCAxMCk7XG4gICAgdGhpcy5wYXRoLmxpbmVUbygtNSwgMCk7XG4gICAgdGhpcy5wYXRoLmxpbmVUbygtMTAsIC0xMCk7XG4gICAgdGhpcy5wYXRoLmxpbmVUbygxMCwgMCk7XG4gIH1cblxuICBjaGFuZ2VTcGVlZChkKSB7XG4gICAgdGhpcy5zcGVlZCArPSBkO1xuICAgIHRoaXMuc3BlZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLm1heFNwZWVkLCB0aGlzLnNwZWVkKSwgdGhpcy5taW5TcGVlZCk7XG4gIH1cblxuICB0dXJuKGQpIHtcbiAgICB0aGlzLmFuZ2xlICs9IGQ7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIHRoaXMueCA9ICh0aGlzLmN0eC5jYW52YXMud2lkdGggICsgdGhpcy54ICsgTWF0aC5jb3ModGhpcy5hbmdsZSkgKiB0aGlzLnNwZWVkKSAlIHRoaXMuY3R4LmNhbnZhcy53aWR0aDtcbiAgICB0aGlzLnkgPSAodGhpcy5jdHguY2FudmFzLmhlaWdodCArIHRoaXMueSAtIE1hdGguc2luKHRoaXMuYW5nbGUpICogdGhpcy5zcGVlZCkgJSB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0O1xuXG4gICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy54LCB0aGlzLnkpXG4gICAgdGhpcy5jdHgucm90YXRlKC10aGlzLmFuZ2xlKTtcbiAgICB0aGlzLmN0eC5zdHJva2UodGhpcy5wYXRoKTtcbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG5cbiAgICBsb2dnZXIubG9nKGBQbGF5ZXIgeDogJHt0aGlzLngudG9GaXhlZCgyKX0sIHk6ICR7dGhpcy55LnRvRml4ZWQoMil9LCBhbmdsZTogJHt0aGlzLmFuZ2xlLnRvRml4ZWQoMil9LCBzcGVlZDogJHt0aGlzLnNwZWVkLnRvRml4ZWQoMil9YCk7XG4gIH1cbn1cblxuY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdO1xuICB9XG5cbiAgc2V0Q29udGV4dChjdHgpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICB9XG5cbiAgZHJhdygpIHtcbiAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICB0aGlzLmN0eC5mb250ID0gJzEycHggbW9ub3NwYWNlJztcbiAgICB0aGlzLmN0eC50ZXh0QmFzZWxpbmUgPSAndG9wJztcblxuICAgIGxldCBsZW5ndGggPSB0aGlzLm1lc3NhZ2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzLmN0eC5maWxsVGV4dCh0aGlzLm1lc3NhZ2VzW2ldLCAwLCBpICogMTIpO1xuICAgIH1cbiAgICB0aGlzLm1lc3NhZ2VzLnNwbGljZSgwKTtcblxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG5sZXQgbG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgY29uc29sZS5sb2coJ1NjcmlwdCBMb2FkZWQnKTtcbiAgbGV0IGdhbWUgPSBuZXcgR2FtZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykpO1xufSk7XG5cbi8vIHZpbTogc2V0IHRzPTIgc3c9MiBldDpcbiJdfQ==
