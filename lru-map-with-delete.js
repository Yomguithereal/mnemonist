/**
 * Mnemonist LRUMapWithDelete
 * ===================
 *
 * An extension of LRUMap with delete functionality.
 */

var LRUMap = require('./lru-map.js'),
    forEach = require('obliterator/foreach'),
    typed = require('./utils/typed-arrays.js'),
    iterables = require('./utils/iterables.js');

// The only complication with deleting items is that the LRU's
// performance depends on having a fixed-size list of pointers; the
// doubly-linked-list is happy to expand and contract.
//
// On delete, we record the position of the former item's pointer in a
// list of "holes" in the pointer array. On insert, if there is a hole
// the new pointer slots in to fill the hole; otherwise, it is
// appended as usual. (Note: we are only talking here about the
// internal pointer list. set'ing or get'ing an item promotes it
// to the top of the LRU ranking no matter what came before)

function LRUMapWithDelete(Keys, Values, capacity) {
  if (arguments.length < 2) {
    LRUMap.call(this, Keys);
  }
  else {
    LRUMap.call(this, Keys, Values, capacity);
  }
  var PointerArray = typed.getPointerArray(this.capacity);
  this.deleted = new PointerArray(this.capacity);
  this.deletedSize = 0;
}

LRUMapWithDelete.prototype = Object.create(LRUMap.prototype);
LRUMapWithDelete.prototype.constructor = LRUMapWithDelete;

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
 LRUMapWithDelete.prototype.clear = function() {
  LRUMap.prototype.clear.call(this);
  this.deletedSize = 0;
};

/**
 * Method used to set the value for the given key in the map.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUMapWithDelete.prototype.set = function(key, value) {
  this.setpop(key, value);
};

/**
 * Method used to set the value for the given key in the map
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
LRUMapWithDelete.prototype.setpop = function(key, value) {
  var oldValue = null;
  var oldKey = null;
  // The key already exists, we just need to update the value and splay on top
  var pointer = this.items.get(key);

  if (typeof pointer !== 'undefined') {
    this.splayOnTop(pointer);
    oldValue = this.V[pointer];
    this.V[pointer] = value;
    return {evicted: false, key: key, value: oldValue};
  }

  // The map is not yet full
  if (this.size < this.capacity) {
    if (this.deletedSize > 0) {
      // If there is a "hole" in the pointer list, reuse it
      pointer = this.deleted[--this.deletedSize];
    }
    else {
      // otherwise append to the pointer list
      pointer = this.size;
    }
    this.size++;
  }

  // Map is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    oldValue = this.V[pointer];
    oldKey = this.K[pointer];
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

  // Return object if eviction took place, otherwise return null
  if (oldKey) {
    return {evicted: true, key: oldKey, value: oldValue};
  }
  else {
    return null;
  }
};

/**
 * Method used to delete the value for the given key in the map.
 *
 * @param  {any} key   - Key.
 * @return {undefined}
 */
LRUMapWithDelete.prototype.delete = function(key) {

  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined') {
    return undefined;
  }

  const dead = this.V[pointer];
  this.items.delete(key);

  if (this.size === 1) {
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.deletedSize = 0;
    return dead;
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

  this.size--;
  this.deleted[this.deletedSize++] = pointer;

  return dead;
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Map's capacity.
 * @return {LRUMapWithDelete}
 */
 LRUMapWithDelete.from = function(iterable, Keys, Values, capacity) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-map.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
  }

  var map = new LRUMapWithDelete(Keys, Values, capacity);

  forEach(iterable, function(value, key) {
    map.set(key, value);
  });

  return map;
};

module.exports = LRUMapWithDelete;
