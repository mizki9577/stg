'use strict';

export default {
  FPS: 60,
  Player: {
    minSpeed            : 0.1,
    maxSpeed            : 0.5,
    initialSpeed        : 0.1,
    initialAngle        : Math.PI / 2,
    linearAcceleration  : 0.0001,
    angularAcceleration : 0.005,

    path: [[[10, 0], [-10, 10], [-5, 0], [-10, -10], [10, 0]]]
  }
};

// vim: set ts=2 sw=2 et:
