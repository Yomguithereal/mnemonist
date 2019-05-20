/**
 * Mnemonist LRUMap
 * =================
 *
 * Variant of the LRUCache class that leverages an ES6 Map instead of an object.
 * It might be faster for some use case but it is still hard to understand
 * when a Map can outperform an object in v8.
 */
var LRUCache = require('./lru-cache.js'),
    forEach = require('obliterator/foreach'),
    typed = require('./utils/typed-arrays.js'),
    iterables = require('./utils/iterables.js');

/**
 * LRUMap.
 *
 * @constructor
 * @param {function} Keys     - Array class for storing keys.
 * @param {function} Values   - Array class for storing values.
 * @param {number}   capacity - Desired capacity.
 */
function LRUMap(Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  this.capacity = capacity;

  if (typeof this.capacity !== 'number' || this.capacity <= 0)
    throw new Error('mnemonist/lru-map: capacity should be positive number.');

  var PointerArray = typed.getPointerArray(capacity);

  this.forward = new PointerArray(capacity);
  this.backward = new PointerArray(capacity);
  this.K = typeof Keys === 'function' ? new Keys(capacity) : new Array(capacity);
  this.V = typeof Values === 'function' ? new Values(capacity) : new Array(capacity);

  // Properties
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items = new Map();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
LRUMap.prototype.clear = function() {
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items.clear();
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @param  {function} callback - Callback function to be called
 * when evicting items from cache
 * @return {undefined}
 */
LRUMap.prototype.set = function(key, value, callback) {

  // The key already exists, we just need to update the value and splay on top
  var pointer = this.items.get(key);

  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    this.V[pointer] = value;

    return;
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    pointer = this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    if (callback) {
      callback(this.items[this.K[pointer]]);
    }
    this.items.delete(this.K[pointer]);
  }

  // Storing key & value
  this.items.set(key, pointer);
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;
};

/**
 * Method used to check whether the key exists in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}
 */
LRUMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to get the value attached to the given key. Will move the
 * related key to the front of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUMap.prototype.get = function(key) {
  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined')
    return;

  this.splayOnTop(pointer);

  return this.V[pointer];
};

/**
 * Method used to get the value attached to the given key. Does not modify
 * the ordering of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUMap.prototype.peek = function(key) {
  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined')
    return;

  return this.V[pointer];
};

/**
 * Methods that can be reused as-is from LRUCache.
 */
LRUMap.prototype.splayOnTop = LRUCache.prototype.splayOnTop;
LRUMap.prototype.forEach = LRUCache.prototype.forEach;
LRUMap.prototype.keys = LRUCache.prototype.keys;
LRUMap.prototype.values = LRUCache.prototype.values;
LRUMap.prototype.entries = LRUCache.prototype.entries;

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  LRUMap.prototype[Symbol.iterator] = LRUMap.prototype.entries;

/**
 * Convenience known methods.
 */
LRUMap.prototype.inspect = LRUCache.prototype.inspect;

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {LRUMap}
 */
LRUMap.from = function(iterable, Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  var cache = new LRUMap(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

/**
 * Exporting.
 */
module.exports = LRUMap;
