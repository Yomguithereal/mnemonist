/**
 * Mnemonist SieveMap
 * ===================
 *
 * JavaScript implementation of the Sieve cache eviction algorithm. To save up
 * memory and allocations this implementation represents its underlying
 * doubly-linked list as static arrays and pointers. Thus, memory is allocated
 * only once at instantiation and JS objects are never created to serve as
 * pointers. This also means this implementation does not trigger too many
 * garbage collections.
 *
 * This impelementation uses an ES6 `Map` over an object to hold the items.
 */

var SieveCache = require('./sieve-cache.js'),
    forEach = require('obliterator/foreach'),
    typed = require('./utils/typed-arrays.js'),
    iterables = require('./utils/iterables.js');

/**
 * SieveCache map implementation.
 *
 * @constructor
 * @param {function} Keys     - Array class for storing keys.
 * @param {function} Values   - Array class for storing values.
 * @param {number}   capacity - Desired capacity.
 */
export function SieveMap(Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  this.capacity = capacity;

  if (typeof this.capacity !== 'number' || this.capacity <= 0)
    throw new Error('mnemonist/sieve-cache-map: capacity should be positive number.');
  else if (!isFinite(this.capacity) || Math.floor(this.capacity) !== this.capacity)
    throw new Error('mnemonist/sieve-cache-map: capacity should be a finite positive integer.');

  var PointerArray = typed.getPointerArray(capacity);

  this.forward = new PointerArray(capacity);
  this.backward = new PointerArray(capacity);
  this.visited = new PointerArray(capacity);
  this.K = typeof Keys === 'function' ? new Keys(capacity) : new Array(capacity);
  this.V = typeof Values === 'function' ? new Values(capacity) : new Array(capacity);

  // Properties
  this.size = 0;
  this.ptr = -1;
  this.head = 0;
  this.tail = 0;
  this.items = new Map();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SieveMap.prototype.clear = function() {
  this.size = 0;
  this.ptr = -1;
  this.head = 0;
  this.tail = 0;
  this.items.clear();
};

SieveMap.prototype.evict = function(key, value) {

  let pointer = this.ptr;

  if (pointer === -1) {
    pointer = this.tail;
  }

  while (pointer !== this.head && this.visited[pointer]) {
    this.visited[pointer] = false;
    pointer = this.backward[pointer];
  }

  if (pointer === this.head && this.visited[pointer]) {
    this.visited[pointer] = false;
    pointer = this.tail;
  }

  while (pointer !== this.head && this.visited[pointer]) {
    this.visited[pointer] = false;
    pointer = this.backward[pointer];
  }

  this.items.delete(this.K[pointer]);

  if (pointer === this.head) {
    this.ptr = this.tail;
    this.head = this.forward[pointer];
  } else {
    this.ptr = this.backward[pointer];
  }

  return pointer;
}

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
SieveMap.prototype.set = function(key, value) {
  var pointer = this.items.get(key);

  // The key already exists, we just need to update the value and mark visited
  if (pointer !== undefined) {
    this.visited[pointer] = true;
    this.V[pointer] = value;

    return;
  }

  pointer = this.size < this.capacity ? ++this.size : this.evict(key, value);

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
 * Method used to set the value for the given key in the cache
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
SieveMap.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;

  var pointer = this.items.get(key);

  // The key already exists, we just need to update the value
  if (pointer !== undefined) {
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    this.visited[pointer] = true;
    return {evicted: false, key: key, value: oldValue};
  }

  pointer = this.size < this.capacity ? ++this.size : this.evict(key, value);

  // Storing key & value
  this.items.set(key, pointer);
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;

  // Return object if eviction took place, otherwise return null
  return oldKey ? {evicted: true, key: oldKey, value: oldValue} : null;
};

/**
 * Method used to check whether the key exists in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}
 */
SieveMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to get the value attached to the given key. Will move the
 * related key to the front of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
SieveMap.prototype.get = function(key) {
  var pointer = this.items.get(key);

  if (pointer === undefined)
    return;

	this.visited[pointer] = true;
  return this.V[pointer];
};

/**
 * Method used to get the value attached to the given key. Does not modify
 * the ordering of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
SieveMap.prototype.peek = function(key) {
  var pointer = this.items[key];

  if (pointer === undefined)
    return;

  return this.V[pointer];
};

SieveMap.prototype.forEach = SieveCache.prototype.forEach;
SieveMap.prototype.keys = SieveCache.prototype.keys;
SieveMap.prototype.values = SieveCache.prototype.values;
SieveMap.prototype.entries = SieveCache.prototype.entries;

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  SieveMap.prototype[Symbol.iterator] = SieveMap.prototype.entries;

/**
 * Convenience known methods.
 */
SieveMap.prototype.inspect = SieveCache.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {SieveMap}
 */
SieveMap.from = function(iterable, Keys, Values, capacity) {
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

  var cache = new SieveMap(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

/**
 * Exporting.
 */
module.exports = SieveMap;
