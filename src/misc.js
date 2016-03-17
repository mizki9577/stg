'use strict';

class Logger {
  constructor(tableElement) {
    this.tableElement = tableElement;
    this.tableRows = new Map();
  }

  add(key) {
    if (this.tableRows.has(key)) {
      this.delete(key);
    }

    const trElement = document.createElement('tr');
    const thElement = document.createElement('th');
    thElement.innerHTML = key;
    trElement.appendChild(thElement);
    this.tableElement.appendChild(trElement);
    this.tableRows.set(key, trElement);
  }

  update(key, values) {
    if (!this.tableRows.has(key)) {
      return;
    }

    let i;
    const row = this.tableRows.get(key);
    for (i = 0; i < values.length; ++i) {
      if (i < row.children.length - 1) {
        row.children.item(i + 1).innerHTML = values[i];
      } else {
        const tdElement = document.createElement('td');
        tdElement.innerHTML = values[i];
        row.appendChild(tdElement);
      }
    }
    while (i < row.children.length - 1) {
      row.removeChild(row.lastChild);
    }
  }

  delete(key) {
    if (!this.tableRows.has(key)) {
      return;
    }
    this.tableElement.removeChild(this.tableRows.get(key));
    this.tableRows.delete(key);
  }
}

const clamp     = (value, min, max) => Math.min(Math.max(min, value), max);
const isClamped = (value, min, max) => (min <= value && value <= max);
const modulo    = (value, max)      => (max + value) % max;
const hypot     = (x1, y1, x2, y2)  => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export {
  Logger, clamp, isClamped, modulo, hypot
};

// vim: set ts=2 sw=2 et:
