/**
 * Mnemonist Binary Heap
 * ======================
 *
 * Binary heap implementation.
 */
var comparators = require('./utils/heap-comparators.js');

var DEFAULT_COMPARATOR = comparators.DEFAULT_COMPARATOR,
    reverseComparator = comparators.reverseComparator;

/**
 * Binary Minimum Heap.
 *
 * @constructor
 */
function Heap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/Heap.constructor: given comparator should be a function.');
}

/**
 * Method used to clear the heap.
 *
 * @return {undefined}
 */
Heap.prototype.clear = function() {

  // Properties
  this.items = [];
  this.size = 0;
};

/**
 * Function used to bubble up.
 *
 * @param {function} compare - Comparator function.
 * @param {array}    data    - Data to edit.
 * @param {number}   index   - Target index.
 */
function bubbleUp(compare, items, index) {
  // Item needing to be moved
  var item = items[index],
      parentIndex = ((index - 1) / 2) | 0;

  // Iterating
  while (index > 0 && compare(items[parentIndex], item) > 0) {
    items[index] = items[parentIndex];
    items[parentIndex] = item;
    index = parentIndex;
    parentIndex = ((index - 1) / 2) | 0;
  }
}

/**
 * Function used to sink down.
 *
 * @param {function} compare - Comparator function.
 * @param {array}    data    - Data to edit.
 * @param {number}   index   - Target index.
 */
function sinkDown(compare, items, index) {
  var size = items.length,
      item = items[index],
      left = 2 * index + 1,
      right = 2 * index + 2,
      min;

  if (right >= size) {
    if (left >= size)
      min = -1;
    else
      min = left;
  }
  else if (compare(items[left], items[right]) <= 0) {
    min = left;
  }
  else {
    min = right;
  }

  while (min >= 0 && compare(items[index], items[min]) > 0) {
    items[index] = items[min];
    items[min] = item;
    index = min;

    left = 2 * index + 1;
    right = 2 * index + 2;

    if (right >= size) {
      if (left >= size)
        min = -1;
      else
        min = left;
    }
    else if (compare(items[left], items[right]) <= 0) {
      min = left;
    }
    else {
      min = right;
    }
  }
}

/**
 * Method used to push an item into the heap.
 *
 * @param  {any}    item - Item to push.
 * @return {number}
 */
Heap.prototype.push = function(item) {
  this.items.push(item);
  bubbleUp(this.comparator, this.items, this.size);
  return ++this.size;
};

/**
 * Method used to retrieve the "first" item of the heap.
 *
 * @return {any}
 */
Heap.prototype.peek = function() {
  return this.items[0];
};

/**
 * Method used to retrieve & remove the "first" item of the heap.
 *
 * @return {any}
 */
Heap.prototype.pop = function() {
  if (!this.size)
    return undefined;

  var item = this.items[0],
      last = this.items.pop();

  this.size--;

  if (this.size) {
    this.items[0] = last;
    sinkDown(this.comparator, this.items, 0);
  }

  return item;
};

/**
 * Binary Maximum Heap.
 *
 * @constructor
 */
function MaxHeap(comparator) {
  this.clear();
  this.comparator = comparator || DEFAULT_COMPARATOR;

  if (typeof this.comparator !== 'function')
    throw new Error('mnemonist/Heap.constructor: given comparator should be a function.');

  this.comparator = reverseComparator(this.comparator);
}

MaxHeap.prototype = Heap.prototype;

/**
 * Exporting.
 */
Heap.MinHeap = Heap;
Heap.MaxHeap = MaxHeap;
module.exports = Heap;
