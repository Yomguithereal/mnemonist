/**
 * Mnemonist Index
 * ================
 *
 * The Index is basically an abstract HashMap where given keys or items
 * are hashed by a function to produce a specific key so that one may
 * query it using the same strategies.
 */
var iterateOver = require('./utils/iterate.js');

var identity = function(x) {
  return x;
};

/**
 * Index.
 *
 * @constructor
 * @param {array|function} descriptor - Hash functions descriptor.
 */
function Index(descriptor) {
  this.items = new Map();
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
    throw new Error('mnemonist/Index.constructor: invalid hash function given.');

  if (typeof this.readHashFunction !== 'function')
    throw new Error('mnemonist/Index.constructor: invalid hash function given.');
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
Index.prototype.clear = function() {
  this.items.clear();

  // Properties
  this.size = 0;
};

/**
 * Method used to add an item to the index.
 *
 * @param  {any} item - Item to add.
 * @return {Index}
 */
Index.prototype.add = function(item) {
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
 * @return {Index}
 */
Index.prototype.set = function(key, item) {
  key = this.writeHashFunction(key);

  this.items.set(key, item);
  this.size = this.items.size;

  return this;
};

/**
 * Method used to retrieve an item from the index.
 *
 * @param  {any} key - Key to use.
 * @return {Index}
 */
Index.prototype.get = function(key) {
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
Index.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(function(value) {
    callback.call(scope, value, value);
  });
};

/**
 * Method returning an iterator over the index's values.
 *
 * @return {IndexIterator}
 */
Index.prototype.values = function() {
  return this.items.values();
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Index.prototype[Symbol.iterator] = Index.prototype.values;

/**
 * Convenience known method.
 */
Index.prototype.inspect = function() {
  var array = Array.from(this.items.values());

  Object.defineProperty(array, 'constructor', {
    value: Index,
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
 * @param  {boolean}        useSet     - Whether to use #.set or #.add
 * @return {Index}
 */
Index.from = function(iterable, descriptor, useSet) {
  var index = new Index(descriptor);

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
module.exports = Index;
