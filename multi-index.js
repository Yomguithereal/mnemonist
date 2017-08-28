/**
 * Mnemonist MultiIndex
 * =====================
 *
 * Same as the index but relying on a MultiMap rather than a Map.
 */
var MultiMap = require('./multi-map.js'),
    iterateOver = require('./utils/iterate.js');

var identity = function(x) {
  return x;
};

/**
 * MultiIndex.
 *
 * @constructor
 * @param {array|function} descriptor - Hash functions descriptor.
 * @param {function}       Container  - Container to use.
 */
function MultiIndex(descriptor, Container) {
  this.items = new MultiMap(Container);
  this.clear();

  if (Array.isArray(descriptor)) {
    this.writeHashFunction = descriptor[0];
    this.readHashFunction = descriptor[1];
  }
  else {
    this.writeHashFunction = descriptor;
    this.readHashFunction = descriptor;
  }

  if (!this.writeHashFunction)
    this.writeHashFunction = identity;
  if (!this.readHashFunction)
    this.readHashFunction = identity;

  if (typeof this.writeHashFunction !== 'function')
    throw new Error('mnemonist/MultiIndex.constructor: invalid hash function given.');

  if (typeof this.readHashFunction !== 'function')
    throw new Error('mnemonist/MultiIndex.constructor: invalid hash function given.');
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
MultiIndex.prototype.clear = function() {
  this.items.clear();

  // Properties
  this.size = 0;
};

/**
 * Method used to add an item to the index.
 *
 * @param  {any} item - Item to add.
 * @return {MultiIndex}
 */
MultiIndex.prototype.add = function(item) {
  var key = this.writeHashFunction(item);

  this.items.set(key, item);
  this.size = this.items.size;

  return this;
};

/**
 * Method used to set an item in the index using the given key.
 *
 * @param  {any} key  - Key to use.
 * @param  {any} item - Item to add.
 * @return {MultiIndex}
 */
MultiIndex.prototype.set = function(key, item) {
  key = this.writeHashFunction(key);

  this.items.set(key, item);
  this.size = this.items.size;

  return this;
};

/**
 * Method used to retrieve an item from the index.
 *
 * @param  {any} key - Key to use.
 * @return {MultiIndex}
 */
MultiIndex.prototype.get = function(key) {
  key = this.readHashFunction(key);

  return this.items.get(key);
};

/**
 * Method used to iterate over each of the index's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiIndex.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(function(value) {
    callback.call(scope, value, value);
  });
};

/**
 * Method returning an iterator over the index's values.
 *
 * @return {MultiIndexIterator}
 */
MultiIndex.prototype.values = function() {
  return this.items.values();
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  MultiIndex.prototype[Symbol.iterator] = MultiIndex.prototype.values;

/**
 * Convenience known method.
 */
MultiIndex.prototype.inspect = function() {
  var array = Array.from(this);

  Object.defineProperty(array, 'constructor', {
    value: MultiIndex,
    enumerable: false
  });

  return array;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable}       iterable   - Target iterable.
 * @param  {array|function} descriptor - Hash functions descriptor.
 * @param  {function}       Container  - Container to use.
 * @param  {boolean}        useSet     - Whether to use #.set or #.add
 * @return {MultiIndex}
 */
MultiIndex.from = function(iterable, descriptor, Container, useSet) {
  if (arguments.length === 3) {
    if (typeof Container === 'boolean') {
      useSet = Container;
      Container = Array;
    }
  }

  var index = new MultiIndex(descriptor, Container);

  iterateOver(iterable, function(value, key) {
    if (useSet)
      index.set(key, value);
    else
      index.add(value);
  });

  return index;
};

/**
 * Exporting.
 */
module.exports = MultiIndex;
