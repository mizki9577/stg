'use strict';

import Game from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('Script Loaded');
  let game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
