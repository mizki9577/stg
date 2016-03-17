'use strict';

import 'babel-polyfill';
import Game from './game';

window.addEventListener('DOMContentLoaded', () => {
  window.Game = new Game(document.getElementById('canvas'));
});

// vim: set ts=2 sw=2 et:
