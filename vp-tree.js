/**
 * Mnemonist Vantage Point Tree
 * =============================
 *
 * JavaScript implementation of the Vantage Point Tree storing the binary
 * tree as a flat byte array.
 *
 * Note that a VPTree has worst cases and is likely not to be perfectly
 * balanced because of median ambiguity. It is therefore not suitable
 * for hairballs and tiny datasets.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Vantage-point_tree
 */
var forEach = require('obliterator/foreach'),
    typed = require('./utils/typed-arrays.js'),
    Heap = require('./heap.js');

var getPointerArray = typed.getPointerArray;

// TODO: implement better selection technique for the vantage point
// The one minimizing spread of sample using stdev is usually the accepted one
// TODO: sort in place without memory consumption

// TODO: if sorting to get median, can split

/**
 * Heap comparator used by the #.nearestNeighbors method.
 */
function comparator(a, b) {
  if (a.distance < b.distance)
    return 1;
  if (a.distance > b.distance)
    return -1;

  if (a < b)
    return 1;
  if (a > b)
    return 1;

  return 0;
}

/**
 * Function used to create the binary tree.
 *
 * @param  {function}     distance - Distance function to use.
 * @param  {array}        items    - Items to index (will be mutated).
 * @param  {array}        indexes  - Indexes of the items.
 * @return {Float64Array}          - The flat binary tree.
 */
function createBinaryTree(distance, items, indexes) {
  var N = indexes.length;

  var PointerArray = getPointerArray(N);

  var C = 0,
      nodes = new PointerArray(N),
      lefts = new PointerArray(N),
      rights = new PointerArray(N),
      mus = new Float64Array(N),
      stack = [0],
      containerStack = [indexes],
      distances = [],
      sortedDistances = [],
      nodeIndex,
      currentIndexes,
      vantagePoint,
      medianIndex,
      mu,
      left,
      right,
      i,
      l,
      h;

  while (stack.length) {
    nodeIndex = stack.pop();
    currentIndexes = containerStack.pop();

    // Getting our vantage point
    vantagePoint = currentIndexes.pop();
    l = currentIndexes.length;

    // Storing vantage point
    nodes[nodeIndex] = vantagePoint;

    // If we only have few items left
    if (!l)
      continue;

    if (l === 1) {

      // We put remaining item to the right
      mu = distance(items[vantagePoint], items[currentIndexes[0]]);

      mus[nodeIndex] = mu;

      // Right
      C += 1;
      rights[nodeIndex] = C;
      nodes[C] = currentIndexes[0];

      continue;
    }

    // Computing distance from vantage point to other points
    distances.length = l;
    sortedDistances.length = l;

    for (i = 0; i < l; i++)
      distances[i] = distance(items[vantagePoint], items[currentIndexes[i]]);

    // Finding median of distances
    h = l / 2;
    sortedDistances = distances.slice().sort();
    medianIndex = h - 1;
    mu = (medianIndex === (medianIndex | 0)) ?
      (sortedDistances[medianIndex] + sortedDistances[medianIndex + 1]) / 2 :
      sortedDistances[Math.ceil(medianIndex)];

    // Storing mu
    mus[nodeIndex] = mu;

    // Dispatching the indexes left & right
    left = [];
    right = [];

    for (i = 0; i < l; i++) {
      if (distances[i] >= mu)
        right.push(currentIndexes[i]);
      else
        left.push(currentIndexes[i]);
    }

    // Right
    if (right.length) {
      C += 1;
      rights[nodeIndex] = C;
      stack.push(C);
      containerStack.push(right);
    }

    // Left
    if (left.length) {
      C += 1;
      lefts[nodeIndex] = C;
      stack.push(C);
      containerStack.push(left);
    }
  }

  return {
    nodes: nodes,
    lefts: lefts,
    rights: rights,
    mus: mus
  };
}

/**
 * VPTree.
 *
 * @constructor
 * @param {function} distance - Distance function to use.
 * @param {Iterable} items    - Items to store.
 */
function VPTree(distance, items) {
  if (typeof distance !== 'function')
    throw new Error('mnemonist/VPTree.constructor: given `distance` must be a function.');

  if (!items)
    throw new Error('mnemonist/VPTree.constructor: you must provide items to the tree. A VPTree cannot be updated after its creation.');

  // Properties
  this.distance = distance;
  this.items = [];
  this.heap = new Heap(comparator);

  var indexes = [],
      self = this,
      i = 0;

  forEach(items, function(value) {
    self.items.push(value);
    indexes.push(i++);
  });

  // Creating the binary tree
  this.size = indexes.length;

  var result = createBinaryTree(distance, this.items, indexes);

  this.nodes = result.nodes;
  this.lefts = result.lefts;
  this.rights = result.rights;
  this.mus = result.mus;
}

/**
 * Function used to retrieve the k nearest neighbors of the query.
 *
 * @param  {number} k     - Number of neighbors to retrieve.
 * @param  {any}    query - The query.
 * @return {array}
 */
VPTree.prototype.nearestNeighbors = function(k, query) {
  var neighbors = this.heap,
      stack = [0],
      tau = Infinity,
      nodeIndex,
      itemIndex,
      vantagePoint,
      leftIndex,
      rightIndex,
      mu,
      d;

  while (stack.length) {
    nodeIndex = stack.pop();
    itemIndex = this.nodes[nodeIndex];
    vantagePoint = this.items[itemIndex];

    // Distance between query & the current vantage point
    d = this.distance(vantagePoint, query);

    if (d < tau) {
      neighbors.push({distance: d, item: vantagePoint});

      // Trimming
      if (neighbors.size > k)
        neighbors.pop();

      // Adjusting tau (only if we already have k items, else it stays Infinity)
      if (neighbors.size >= k)
       tau = neighbors.peek().distance;
    }

    leftIndex = this.lefts[nodeIndex];
    rightIndex = this.rights[nodeIndex];

    // We are a leaf
    if (!leftIndex && !rightIndex)
      continue;

    mu = this.mus[nodeIndex];

    if (d < mu) {
      if (leftIndex && d < mu + tau)
        stack.push(leftIndex);
      if (rightIndex && d >= mu - tau) // ALT
        stack.push(rightIndex);
    }
    else {
      if (rightIndex && d >= mu - tau)
        stack.push(rightIndex);
      if (leftIndex && d < mu + tau) // ALT
        stack.push(leftIndex);
    }
  }

  var array = new Array(neighbors.size);

  for (var i = neighbors.size - 1; i >= 0; i--)
    array[i] = neighbors.pop();

  return array;
};

/**
 * Function used to retrieve every neighbors of query in the given radius.
 *
 * @param  {number} radius - Radius.
 * @param  {any}    query  - The query.
 * @return {array}
 */
VPTree.prototype.neighbors = function(radius, query) {
  var neighbors = [],
      stack = [0],
      nodeIndex,
      itemIndex,
      vantagePoint,
      leftIndex,
      rightIndex,
      mu,
      d;

  while (stack.length) {
    nodeIndex = stack.pop();
    itemIndex = this.nodes[nodeIndex];
    vantagePoint = this.items[itemIndex];

    // Distance between query & the current vantage point
    d = this.distance(vantagePoint, query);

    if (d <= radius)
      neighbors.push({distance: d, item: vantagePoint});

    leftIndex = this.lefts[nodeIndex];
    rightIndex = this.rights[nodeIndex];

    // We are a leaf
    if (!leftIndex && !rightIndex)
      continue;

    mu = this.mus[nodeIndex];

    if (d < mu) {
      if (leftIndex && d < mu + radius)
        stack.push(leftIndex);
      if (rightIndex && d >= mu - radius) // Might not be necessary to test
        stack.push(rightIndex);
    }
    else {
      if (rightIndex && d >= mu - radius)
        stack.push(rightIndex);
      if (leftIndex && d < mu + radius) // Might not be necessary to test
        stack.push(leftIndex);
    }
  }

  return neighbors;
};

/**
 * Convenience known methods.
 */
VPTree.prototype.inspect = function() {
  var array = this.items.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: VPTree,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  VPTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = VPTree.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a tree.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} distance - Distance function to use.
 * @return {VPTree}
 */
VPTree.from = function(iterable, distance) {
  return new VPTree(distance, iterable);
};

/**
 * Exporting.
 */
module.exports = VPTree;
