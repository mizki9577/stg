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
    const tdElement = document.createElement('td');
    thElement.innerHTML = key;
    trElement.appendChild(thElement);
    trElement.appendChild(tdElement);
    this.tableElement.appendChild(trElement);
    this.tableRows.set(key, trElement);
  }

  update(key, value) {
    if (!this.tableRows.has(key)) {
      return;
    }
    this.tableRows.get(key).lastChild.innerHTML = value;
  }

  delete(key) {
    if (!this.tableRows.has(key)) {
      return;
    }
    this.tableElement.removeChild(this.tableRows.get(key));
    this.tableRows.delete(key);
  }

  log(key, value) {
    let found = false;
    for (const trElement of this.tableElement.childNodes) {
      if (trElement.firstChild.innerHTML === key) {
        trElement.lastChild.innerHTML = value;
        found = true;
        break;
      }
    }

    if (!found) {
      const trElement      = document.createElement('tr');
      const firstTDElement = document.createElement('td');
      const lastTDElement  = document.createElement('td');
      firstTDElement.innerHTML = key;
      lastTDElement.innerHTML  = value;
      trElement.appendChild(firstTDElement);
      trElement.appendChild(lastTDElement);
      this.tableElement.appendChild(trElement);
    }
  }

  draw() { }
}

const clamp = (value, min, max) => Math.min(Math.max(min, value), max);
const isClamped = (value, min, max) => (min <= value && value <= max);
const modulo = (value, max) => (max + value) % max;
const hypot = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export {
  Logger, clamp, isClamped, modulo, hypot
};

// vim: set ts=2 sw=2 et:
