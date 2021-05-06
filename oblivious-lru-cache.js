/**
 * Mnemonist ObliviousLRUCache
 * ===================
 *
 * An extension of LRUCache with delete functionality.
 */

var LRUCache = require('./lru-cache.js'),
    forEach = require('obliterator/foreach'),
    typed = require('./utils/typed-arrays.js'),
    iterables = require('./utils/iterables.js');

function ObliviousLRUCache(Keys, Values, capacity) {
  if (arguments.length < 2) {
    LRUCache.call(this, Keys);
  }
  else {
    LRUCache.call(this, Keys, Values, capacity);
  }
  var PointerArray = typed.getPointerArray(this.capacity);
  this.deleted = new PointerArray(this.capacity);
  this.deletedSize = 0;
}

ObliviousLRUCache.prototype = Object.create(LRUCache.prototype);
ObliviousLRUCache.prototype.constructor = ObliviousLRUCache;

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
 ObliviousLRUCache.prototype.clear = function() {
  LRUCache.prototype.clear.call(this);
  this.deletedSize = 0;
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
ObliviousLRUCache.prototype.set = function(key, value) {
  this.setpop(key, value);
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
ObliviousLRUCache.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;
  // The key already exists, we just need to update the value and splay on top
  var pointer = this.items[key];

  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    return {evicted: false, key: key, value: oldValue};
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    if (this.deletedSize > 0) {
      pointer = this.deleted[--this.deletedSize];
    }
    else {
      pointer = this.size;
    }
    this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    oldValue = this.V[pointer];
    oldKey = this.K[pointer];
    delete this.items[this.K[pointer]];
  }

  // Storing key & value
  this.items[key] = pointer;
  this.K[pointer] = key;
  this.V[pointer] = value;

  // Moving the item at the front of the list
  this.forward[pointer] = this.head;
  this.backward[this.head] = pointer;
  this.head = pointer;

  // Return object if eviction took place, otherwise return null
  if (oldKey) {
    return {evicted: true, key: oldKey, value: oldValue};
  }
  else {
    return null;
  }
};

/**
 * Method used to delete the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @return {undefined}
 */
 ObliviousLRUCache.prototype.delete = function(key) {

  var pointer = this.items[key];

  if (typeof pointer === 'undefined') {
    return;
  }

  if (this.head === pointer && this.tail === pointer) {
    this.clear();
    return;
  }

  var previous = this.backward[pointer],
      next = this.forward[pointer];

  if (this.head === pointer) {
    this.head = next;
  }
  if (this.tail === pointer) {
    this.tail = previous;
  }

  this.forward[previous] = next;
  this.backward[next] = previous;

  delete this.items[key];
  this.size--;
  this.deleted[this.deletedSize++] = pointer;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {ObliviousLRUCache}
 */
 ObliviousLRUCache.from = function(iterable, Keys, Values, capacity) {
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

  var cache = new ObliviousLRUCache(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

module.exports = ObliviousLRUCache;
