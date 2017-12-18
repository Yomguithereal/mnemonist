/**
 * Mnemonist Incremental Map
 * ==========================
 *
 * Simple utility class mapping a set of keys unknown beforehand to a range
 * of increasing integers. Very useful to map a set of hashable keys to
 * and array's indices, for instance.
 */
var iterate = require('./utils/iterate.js');

/**
 * IncrementalMap.
 *
 * @constructor
 * @param {object} range    - Range options:
 * @param {number}   step   - Step of the counter. Defaults to 1.
 * @param {number}   offset - Starting offset. Defaults to 0.
 */
function IncrementalMap(range) {

  if (typeof range === 'object') {
    this.step = range.step || 1;
    this.offset = range.offset || 0;
  }
  else {
    this.step = 1;
    this.offset = 0;
  }

  this.map = new Map();
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
IncrementalMap.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.counter = this.offset;
  this.map.clear();
};

/**
 * Method used to add a key to the structure without checking its existence
 * beforehand.
 *
 * @param  {any}      key - Key to add.
 * @return {IncrementalMap}
 */
IncrementalMap.prototype.unsafeAdd = function(key) {
  this.map.set(key, this.counter);
  this.counter += this.step;
  this.size++;
};

/**
 * Method used to add a key to the structure.
 *
 * @param  {any}      key - Key to add.
 * @return {IncrementalMap}
 */
IncrementalMap.prototype.add = function(key) {
  if (!this.map.has(key)) {
    this.map.set(key, this.counter);
    this.counter += this.step;
    this.size++;
  }

  return this;
};

/**
 * Bootstrapping methods.
 */
IncrementalMap.prototype.get = function(key) {
  return this.map.get(key);
};
IncrementalMap.prototype.has = function(key) {
  return this.map.has(key);
};

IncrementalMap.prototype.keys = function() {
  return this.map.keys();
};
IncrementalMap.prototype.values = function() {
  return this.map.values();
};
IncrementalMap.prototype.entries = function() {
  return this.map.entries();
};

IncrementalMap.prototype.forEach = function() {
  return this.map.forEach.apply(this.map, arguments);
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  IncrementalMap.prototype[Symbol.iterator] = IncrementalMap.prototype.entries;

/**
 * Convenience known method.
 */
IncrementalMap.prototype.inspect = function() {
  var proxy = [];

  proxy.step = this.step;
  proxy.offset = this.offset;

  var iterator = this.map.entries(),
      step;

  while ((step = iterator.next(), !step.done))
    proxy.push(step.value);

  Object.defineProperty(proxy, 'constructor', {
    value: IncrementalMap,
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
 * @return {IncrementalMap}
 */
IncrementalMap.from = function(iterable, range) {
  var map = new IncrementalMap(range);

  iterate(function(item) {
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
 * @return {IncrementalMap}
 */
IncrementalMap.fromDistinct = function(iterable, range) {
  var map = new IncrementalMap(range);

  iterate(function(item) {
    map.unsafeAdd(item);
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = IncrementalMap;
