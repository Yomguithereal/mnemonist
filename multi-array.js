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
var Iterator = require('obliterator/iterator');

/**
 * MultiArray.
 *
 * @constructor
 */
function MultiArray() {
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

  this.items = new Array();
  this.tails = new Array();
  this.lengths = new Array();
  this.pointers = new Array();
  this.pointers.push(0);
};

MultiArray.prototype.set = function(index, item) {
  var pointer = this.pointers.length;

  // This linked list does not exist yet. Let's create it
  if (index >= this.dimension) {
    this.dimension++;
    this.pointers.push(0);
    this.lengths[index] = 1;
  }

  // Appending to the list
  else {
    this.pointers.push(this.tails[index]);
    this.lengths[index]++;
  }

  this.tails[index] = pointer;
  this.items.push(item);

  this.size++;

  return this;
};

MultiArray.prototype.get = function(index) {
  if (index >= this.dimension)
    return;

  var pointer = this.tails[index],
      length = this.lengths[index],
      i = length;

  var array = new Array(length);

  while (pointer !== 0) {
    array[--i] = this.items[~-pointer];
    pointer = this.pointers[pointer];
  }

  return array;
};

MultiArray.prototype.has = function(index) {
  return index < this.dimension;
};

MultiArray.prototype.containers = function() {
  return new Iterator(function() {

  });
};

// #.iterate on a given sublist
// #.push?
// #.count
// #.entries
// #.containers
// #.associations
// #.values
// #.keys
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
