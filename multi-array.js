/**
 * Mnemonist MultiArray
 * =====================
 *
 * Memory-efficient representation of an array of arrays. In JavaScript and
 * most high-level languages, creating objects has a cost. This implementation
 * is therefore able to represent nested containers without needing to create
 * objects. This works by storing singly linked lists in a single flat array.
 * However, this means that this structure comes with some read/write
 * overhead but consume very few memory.
 *
 * This structure should be particularly suited to indices that will need to
 * merge arrays anyway when queried and that are quite heavily hit (such as
 * an inverted index or a quad tree).
 */
var typed = require('./utils/typed-arrays.js'),
    Vector = require('./vector.js');

/**
 * MultiArray.
 *
 * @constructor
 */
function MultiArray(Container, capacity) {
  this.capacity = capacity || null;
  this.Container = Container || Array;
  this.hasFixedCapacity = this.capacity !== null;

  if (typeof this.Container !== 'function')
    throw new Error('mnemonist/multi-array.constructor: container should be a function.');

  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
MultiArray.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;

  // Storage
  if (this.hasFixedCapacity) {
    var capacity = this.capacity;

    var PointerArray = typed.getPointerArray(capacity + 1);

    var policy = function(currentCapacity) {
      var newCapacity = Math.max(1, Math.ceil(currentCapacity * 1.5));

      // Clamping max allocation
      return Math.min(newCapacity, capacity);
    };

    var initialCapacity = Math.max(256, capacity);

    this.tails = new Vector(PointerArray, {policy: policy, initialCapacity: initialCapacity});
    this.lengths = new Vector(PointerArray, {policy: policy, initialCapacity: initialCapacity});
    this.pointers = new Vector(PointerArray, {policy: policy, initialCapacity: initialCapacity});

    this.items = new this.Container(capacity);
  }
  else {
    this.tails = new Array();
    this.lengths = new Array();
    this.pointers = new Array();

    this.items = new this.Container();
  }

  this.pointers.push(0);
};

/**
 * Method used to add an item to the container at the given index.
 *
 * @param  {number} index - Index of the container.
 * @param  {any}    item  - Item to add.
 * @return {MultiArray}
 */
MultiArray.prototype.set = function(index, item) {
  var pointer = this.pointers.length;

  if (this.hasFixedCapacity) {

    if (index >= this.capacity || this.size === this.capacity)
      throw new Error('mnemonist/multi-array: attempting to allocate further than capacity.');

    // This linked list does not exist yet. Let's create it
    if (index >= this.dimension) {
      this.dimension++;
      this.pointers.push(0);
      this.lengths.push(1);
      this.tails.push(pointer);
    }

    // Appending to the list
    else {
      this.pointers.push(this.tails.array[index]);
      this.lengths.array[index]++;
      this.tails.array[index] = pointer;
    }

    this.items[pointer - 1] = item;
  }
  else {

    // This linked list does not exist yet. Let's create it
    if (index >= this.dimension) {
      this.dimension++;
      this.pointers.push(0);
      this.lengths.push(1);
      this.tails.push(pointer);
    }

    // Appending to the list
    else {
      this.pointers.push(this.tails[index]);
      this.lengths[index]++;
      this.tails[index] = pointer;
    }

    this.items.push(item);
  }

  this.size++;

  return this;
};

/**
 * Method used to get the desired container.
 *
 * @param  {number} index - Index of the container.
 * @return {array}
 */
MultiArray.prototype.get = function(index) {
  if (index >= this.dimension)
    return;

  var tails, lengths, pointers;

  if (this.hasFixedCapacity) {
    tails = this.tails.array;
    lengths = this.lengths.array;
    pointers = this.pointers.array;
  }
  else {
    tails = this.tails;
    lengths = this.lengths;
    pointers = this.pointers;
  }

  var pointer = tails[index],
      length = lengths[index],
      i = length;

  var array = new this.Container(length);

  while (pointer !== 0) {
    array[--i] = this.items[~-pointer];
    pointer = pointers[pointer];
  }

  return array;
};

/**
 * Method used to check if a container exists at the given index.
 *
 * @param  {number} index - Index of the container.
 * @return {boolean}
 */
MultiArray.prototype.has = function(index) {
  return index < this.dimension;
};

// TODO: throw on exceeded capacity
// #.iterate on a given sublist
// #.push?
// #.count
// #.entries
// #.containers
// #.associations
// #.values
// #.keys
// @.from
// Static version

/**
 * Convenience known methods.
 */
MultiArray.prototype.inspect = function() {
  var proxy = new Array(this.dimension),
      i,
      l;

  for (i = 0, l = this.dimension; i < l; i++)
    proxy[i] = this.get(i);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: MultiArray,
    enumerable: false
  });

  return proxy;
};

/**
 * Exporting.
 */
module.exports = MultiArray;
