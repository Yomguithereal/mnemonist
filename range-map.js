/**
 * Mnemonist Range Map
 * ====================
 *
 * Simple utility class mapping a set of keys unknown beforehand to a range
 * of increasing integers. Very useful to map a set of hashable keys to
 * and array's indices, for instance.
 */
var iterateOver = require('./utils/iterate.js');

/**
 * RangeMap.
 *
 * @constructor
 * @param {object} range    - Range options:
 * @param {number}   step   - Step of the counter. Defaults to 1.
 * @param {number}   offset - Starting offset. Defaults to 0.
 */
function RangeMap(range) {

  if (typeof range === 'object') {
    this.step = range.step || 1;
    this.offset = range.offset || 0;
  }
  else {
    this.step = 1;
    this.offset = 0;
  }

  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
RangeMap.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.counter = this.offset;
  this.map = new Map();
};

/**
 * Method used to add a key to the structure without checking its existence
 * beforehand.
 *
 * @param  {any}      key - Key to add.
 * @return {RangeMap}
 */
RangeMap.prototype.unsafeAdd = function(key) {
  this.map.set(key, this.counter);
  this.counter += this.step;
  this.size++;
};

/**
 * Method used to add a key to the structure.
 *
 * @param  {any}      key - Key to add.
 * @return {RangeMap}
 */
RangeMap.prototype.add = function(key) {
  if (!this.map.has(key)) {
    this.map.set(key, this.counter);
    this.counter += this.step;
    this.size++;
  }

  return this;
};

/**
 * Method used to get the index mapped to the given key.
 *
 * @param  {any}    key - Key to add.
 * @return {number}
 */
RangeMap.prototype.get = function(key) {
  return this.map.get(key);
};

/**
 * Method used to check the existence of a key in the map.
 *
 * @param  {any}    key - Key to test.
 * @return {number}
 */
RangeMap.prototype.has = function(key) {
  return this.map.has(key);
};

/**
 * Convenience known method.
 */
RangeMap.prototype.inspect = function() {
  var proxy = [];

  proxy.step = this.step;
  proxy.offset = this.offset;

  var iterator = this.map.entries(),
      step;

  while ((step = iterator.next(), !step.done))
    proxy.push(step.value);

  Object.defineProperty(proxy, 'constructor', {
    value: RangeMap,
    enumerable: false
  });

  return proxy;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {object}   range    - Range options.
 * @return {RangeMap}
 */
RangeMap.from = function(iterable, range) {
  var map = new RangeMap(range);

  iterateOver(function(item) {
    map.add(item);
  });

  return map;
};

/**
 * Static @.from function taking an abitrary iterable containing distinct values
 * & converting it into a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {object}   range    - Range options.
 * @return {RangeMap}
 */
RangeMap.fromDistinct = function(iterable, range) {
  var map = new RangeMap(range);

  iterateOver(function(item) {
    map.unsafeAdd(item);
  });

  return map;
};

// TODO: add iteration methods

/**
 * Exporting.
 */
module.exports = RangeMap;
