/**
 * Mnemonist Merge Helpers
 * ========================
 *
 * Various merge algorithms used to handle sorted lists. Note that the given
 * functions are optimized and won't accept mixed arguments.
 *
 * Note: maybe this piece of code belong to sortilege, along with binary-search.
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
 * Perform the union of two already unique sorted array-like structures into one.
 *
 * @param  {array} a - First array.
 * @param  {array} b - Second array.
 * @return {array}
 */
function unionUniqueArrays(a, b) {

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

  if (aEnd < bStart) {
    if (typed.isTypedArray(a))
      return typed.concat(a, b);
    return a.concat(b);
  }
  else if (bEnd < aStart) {
    if (typed.isTypedArray(a))
      return typed.concat(b, a);
    return b.concat(a);
  }

  // Initializing target
  var array = new a.constructor();

  // Iterating until we overlap
  var i, l, v;

  for (i = 0, l = a.length; i < l; i++) {
    v = a[i];

    if (v < bStart)
      array.push(v);
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

      if (array.length === 0 || array[array.length - 1] !== aHead)
        array.push(aHead);

      aPointer++;
    }
    else {
      if (array.length === 0 || array[array.length - 1] !== bHead)
        array.push(bHead);

      bPointer++;
    }
  }

  // Filling
  while (aPointer < aLength) {
    aHead = a[aPointer++];

    if (array.length === 0 || array[array.length - 1] !== aHead)
      array.push(aHead);
  }
  while (bPointer < bLength) {
    bHead = b[bPointer++];

    if (array.length === 0 || array[array.length - 1] !== bHead)
      array.push(bHead);
  }

  return array;
}

/**
 * Perform the intersection of two already unique sorted array-like structures into one.
 *
 * @param  {array} a - First array.
 * @param  {array} b - Second array.
 * @return {array}
 */
function intersectionUniqueArrays(a, b) {

  // One of the arrays is empty
  if (a.length === 0 || b.length === 0)
    return new a.constructor(0);

  // Finding min array
  var tmp;

  if (a[0] > b[0]) {
    tmp = a;
    a = b;
    b = tmp;
  }

  // If array have non overlapping ranges, there is no intersection
  var aStart = a[0],
      aEnd = a[a.length - 1],
      bStart = b[0],
      bEnd = b[b.length - 1];

  if (aEnd < bStart || bEnd < aStart)
    return new a.constructor(0);

  // Initializing target
  var array = new a.constructor();

  // Iterating until we overlap
  var i, l, v;

  for (i = 0, l = a.length; i < l; i++) {
    v = a[i];

    if (v >= bStart)
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

    if (aHead < bHead) {
      aPointer++;
    }
    else if (aHead > bHead) {
      bPointer++;
    }
    else {
      array.push(aHead);
      aPointer++;
      bPointer++;
    }
  }

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
 * Perform the union of k sorted unique array-like structures into one.
 *
 * @param  {array<array>} arrays - Arrays to merge.
 * @return {array}
 */
function kWayUnionUniqueArrays(arrays) {
  var max = -Infinity,
      al,
      i,
      l;

  var filtered = [];

  for (i = 0, l = arrays.length; i < l; i++) {
    al = arrays[i].length;

    if (al === 0)
      continue;

    filtered.push(arrays[i]);

    if (al > max)
      max = al;
  }

  if (filtered.length === 0)
    return new arrays[0].constructor(0);

  if (filtered.length === 1)
    return filtered[0].slice();

  if (filtered.length === 2)
    return unionUniqueArrays(filtered[0], filtered[1]);

  arrays = filtered;

  var array = new arrays[0].constructor();

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

  var p,
      v;

  while (heap.size) {
    p = heap.pop();
    v = arrays[p][pointers[p]++];

    if (array.length === 0 || array[array.length - 1] !== v)
      array.push(v);

    if (pointers[p] < arrays[p].length)
      heap.push(p);
  }

  return array;
}

/**
 * Perform the intersection of k sorted array-like structures into one.
 *
 * @param  {array<array>} arrays - Arrays to merge.
 * @return {array}
 */
function kWayIntersectionUniqueArrays(arrays) {
  var max = -Infinity,
      al,
      i,
      l;

  for (i = 0, l = arrays.length; i < l; i++) {
    al = arrays[i].length;

    // If one of the arrays is empty, so is the intersection
    if (al === 0)
      return new arrays[0].constructor(0);

    if (al > max)
      max = al;
  }

  var array = new arrays[0].constructor();

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

  var counter = 0,
      buffer;

  var p,
      v;

  while (heap.size) {
    p = heap.pop();
    v = arrays[p][pointers[p]++];

    if (counter === 0) {
      buffer = v;
      counter++;
    }
    else if (buffer === v) {
      counter++;

      if (counter === l) {
        counter = 0;
        array.push(v);
      }
    }
    else {
      counter = 1;
      buffer = v;
    }

    if (pointers[p] < arrays[p].length)
      heap.push(p);
  }

  return array;
}

/**
 * Variadic merging all of the given arrays.
 *
 * @param  {...array}
 * @return {array}
 */
function merge() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return mergeArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return kWayMergeArrays(arguments);
  }

  return null;
}

/**
 * Variadic function performing the union of all the given unique arrays.
 *
 * @param  {...array}
 * @return {array}
 */
function unionUnique() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return unionUniqueArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return kWayUnionUniqueArrays(arguments);
  }

  return null;
}

/**
 * Variadic function performing the intersection of all the given unique arrays.
 *
 * @param  {...array}
 * @return {array}
 */
function intersectionUnique() {
  if (arguments.length === 2) {
    if (isArrayLike(arguments[0]))
      return intersectionUniqueArrays(arguments[0], arguments[1]);
  }
  else {
    if (isArrayLike(arguments[0]))
      return kWayIntersectionUniqueArrays(arguments);
  }

  return null;
}

/**
 * Exporting.
 */
merge.merge = merge;
merge.unionUnique = unionUnique;
merge.intersectionUnique = intersectionUnique;
module.exports = merge;
