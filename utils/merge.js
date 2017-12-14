/**
 * Mnemonist Merge Helpers
 * ========================
 *
 * Various merge algorithms used to handle sorted lists.
 */
var typed = require('./typed-arrays.js'),
    isArrayLike = require('./iterate.js').isArrayLike,
    FibonacciHeap = require('../fibonacci-heap.js');

/**
 * Merge two sorted array-like structures into one.
 *
 * @param  {array} a - First array.
 * @param  {array} b - Second array.
 * @return {array}
 */
function mergeArrays(a, b) {

  // One of the arrays is empty
  if (a.length === 0)
    return b.slice();
  if (b.length === 0)
    return a.slice();

  // Finding min array
  var tmp;

  if (a[0] > b[0]) {
    tmp = a;
    a = b;
    b = tmp;
  }

  // If array have non overlapping ranges, we can just concatenate them
  var aStart = a[0],
      aEnd = a[a.length - 1],
      bStart = b[0],
      bEnd = b[b.length - 1];

  if (aEnd <= bStart) {
    if (typed.isTypedArray(a))
      return typed.concat(a, b);
    return a.concat(b);
  }
  else if (bEnd <= aStart) {
    if (typed.isTypedArray(a))
      return typed.concat(b, a);
    return b.concat(a);
  }

  // Initializing target
  var array = new a.constructor(a.length + b.length);

  // Iterating until we overlap
  var i, l, v;

  for (i = 0, l = a.length; i < l; i++) {
    v = a[i];

    if (v <= bStart)
      array[i] = v;
    else
      break;
  }

  // Handling overlap
  var aPointer = i,
      aLength = a.length,
      bPointer = 0,
      bLength = b.length,
      aHead,
      bHead;

  while (aPointer < aLength && bPointer < bLength) {
    aHead = a[aPointer];
    bHead = b[bPointer];

    if (aHead <= bHead) {
      array[i++] = aHead;
      aPointer++;
    }
    else {
      array[i++] = bHead;
      bPointer++;
    }
  }

  // Filling
  while (aPointer < aLength)
    array[i++] = a[aPointer++];
  while (bPointer < bLength)
    array[i++] = b[bPointer++];

  return array;
}

/**
 * Merge k sorted array-like structures into one.
 *
 * @param  {array<array>} arrays - Arrays to merge.
 * @return {array}
 */
function kWayMergeArrays(arrays) {
  var length = 0,
      max = -Infinity,
      al,
      i,
      l;

  var filtered = [];

  for (i = 0, l = arrays.length; i < l; i++) {
    al = arrays[i].length;

    if (al === 0)
      continue;

    filtered.push(arrays[i]);

    length += al;

    if (al > max)
      max = al;
  }

  if (filtered.length === 0)
    return new arrays[0].constructor(0);

  if (filtered.length === 1)
    return filtered[0].slice();

  if (filtered.length === 2)
    return mergeArrays(filtered[0], filtered[1]);

  arrays = filtered;

  var array = new arrays[0].constructor(length);

  var PointerArray = typed.getPointerArray(max);

  var pointers = new PointerArray(arrays.length);

  // TODO: benchmark vs. a binomial heap
  var heap = new FibonacciHeap(function(a, b) {
    a = arrays[a][pointers[a]];
    b = arrays[b][pointers[b]];

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  });

  for (i = 0; i < l; i++)
    heap.push(i);

  i = 0;

  var p,
      v;

  while (heap.size) {
    p = heap.pop();
    v = arrays[p][pointers[p]++];
    array[i++] = v;

    if (pointers[p] < arrays[p].length)
      heap.push(p);
  }

  return array;
}

/**
 * Variadic function using all of the above to return the desired result.
 *
 * @param  {...array}
 * @return {array}
 */
module.exports = function merge() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return mergeArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return kWayMergeArrays(arguments);
  }

  return null;
};
