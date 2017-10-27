/**
 * Mnemonist SparseMultiArray
 * ===========================
 *
 * Memory-efficient representation of an array of arrays whose indices are
 * not densely populated. It has a read/write overhead but is very lean in
 * memory because it does not need to create subarrays. This structure is
 * particularly suited to indices that will need to merge arrays anyway
 * when queried and that are quite heavy and often hit such as a QuadTree.
 */
var Iterator = require('obliterator/iterator');

/**
 * SparseMultiArray.
 *
 * @constructor
 */
function SparseMultiArray() {
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SparseMultiArray.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;

  this.tails = {};
  this.lengths = {};
  this.pointers = [0];
  this.items = [];
};

SparseMultiArray.prototype.set = function(index, item) {
  var tail = this.tails[index],
      pointer;

  pointer = this.pointers.length;

  // This linked list does not exist yet. Let's create it
  if (typeof tail !== 'number') {
    this.dimension++;
    this.pointers.push(0);
    this.lengths[index] = 1;
  }

  // Appending to the list
  else {
    this.pointers.push(tail);
    this.lengths[index]++;
  }

  this.tails[index] = pointer;
  this.items.push(item);

  this.size++;

  return this;
};

SparseMultiArray.prototype.get = function(index) {
  var pointer = this.tails[index];

  if (typeof pointer !== 'number')
    return;

  var length = this.lengths[index],
      i = length;

  var array = new Array(length);


  while (pointer !== 0) {
    array[--i] = this.items[~-pointer];
    pointer = this.pointers[pointer];
  }

  return array;
};

SparseMultiArray.prototype.has = function(index) {
  var tail = this.tails[index];

  return typeof tail === 'number';
};

SparseMultiArray.prototype.containers = function() {
  return new Iterator(function() {

  });
};

// #.count
// #.entries
// #.containers
// #.associations
// #.values
// #.keys

/**
 * Convenience known methods.
 */
SparseMultiArray.prototype.inspect = function() {
  return this;
};

/**
 * Exporting.
 */
module.exports = SparseMultiArray;
