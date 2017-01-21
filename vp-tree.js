/**
 * Mnemonist Vantage Point Tree
 * =============================
 *
 * JavaScript implementation of the Vantage Point Tree storing the binary
 * tree as a flat byte array.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Vantage-point_tree
 */
var iterateOver = require('./utils/iterate.js');

/**
 * Function used to create the binary tree.
 *
 * @param  {function}     distance - Distance function to use.
 * @param  {array}        items    - Items to index (will be mutated).
 * @param  {array}        indexes  - Indexes of the items.
 * @return {Float64Array}          - The flat binary tree.
 */
function createBinaryTree(distance, items, indexes) {
  var n = indexes.length,
      k = Math.ceil(Math.log2(n + 1) - 1),
      L = Math.pow(2, k + 1) - 1;

  var data = new Float64Array(L * 2),
      stack = [0, indexes],
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
    currentIndexes = stack.pop();
    nodeIndex = stack.pop();

    // Getting our vantage point
    vantagePoint = currentIndexes.pop();
    l = currentIndexes.length;

    // Storing vantage point
    data[nodeIndex] = vantagePoint;

    // If we only have few items left
    if (!l)
      continue;

    if (l === 1) {

      // We put remaining item to the left
      mu = distance(items[vantagePoint], items[currentIndexes[0]]);

      data[L + nodeIndex] = mu;
      data[nodeIndex * 2 + 1] = currentIndexes[0];

      continue;
    }

    if (l === 2) {

      // We put last two items to the left & right respectively
      mu = (
        distance(items[vantagePoint], items[currentIndexes[0]]) +
        distance(items[vantagePoint], items[currentIndexes[1]])
      ) / 2;

      data[L + nodeIndex] = mu;
      data[nodeIndex * 2 + 1] = currentIndexes[0];
      data[nodeIndex * 2 + 2] = currentIndexes[1];

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
    data[L + nodeIndex] = mu;

    // Dispatching the indexes left & right
    left = [];
    right = [];
    h = Math.floor(h);

    for (i = 0; i < l; i++) {
      if (distances[i] >= mu && right.length < h)
        right.push(currentIndexes[i]);
      else
        left.push(currentIndexes[i]);
    }

    stack.push(2 * nodeIndex + 2);
    stack.push(right);

    stack.push(2 * nodeIndex + 1);
    stack.push(left);
  }

  return data;
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
  // NOTE: this.items starts with a null value so that we may use `0` as
  // an empty value in our Float64Array, making the stored indices 1-based.
  this.distance = distance;
  this.items = [null];

  var indexes = [],
      self = this,
      i = 1;

  iterateOver(items, function(value) {
    self.items.push(value);
    indexes.push(i++);
  });

  // Creating the binary tree
  this.size = indexes.length;
  this.data = createBinaryTree(distance, this.items, indexes);
}

/**
 * Static @.from function taking an abitrary iterable & converting it into
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
