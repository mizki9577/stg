'use strict';

export default {
  FPS: 60,
  rockSpawnInterval: 5000,
  Player: {
    minSpeed            : 0.0,
    maxSpeed            : 0.25,
    initialSpeed        : 0.0,
    initialAngle        : Math.PI / 2,
    linearAcceleration  : 0.0001,
    angularAcceleration : 0.005,

    path: [[[10, 0], [-10, 10], [-5, 0], [-10, -10], [10, 0]]]
  },
  Rock: {
    radius        : 75,
    numofVertices : 8
  }
};

// vim: set ts=2 sw=2 et:
