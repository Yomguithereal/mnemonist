/* eslint-disable */


/**
 * Mnemonist StaticIntervalTree
 * =============================
 *
 * JavaScript implementation of a static interval tree. This tree is static in
 * that you are required to know all its items beforehand and to built it
 * from an iterable.
 *
 * This implementation represents the interval tree as an augmented balanced
 * binary search tree. It works by sorting the intervals by startpoint first
 * then proceeds building the augmented balanced BST bottom-up from the
 * sorted list.
 *
 * Note that this implementation considers every given intervals as closed for
 * simplicity's sake.
 *
 * For more information: https://en.wikipedia.org/wiki/Interval_tree
 */
var iterate = require('./utils/iterate.js'),
    typed = require('./utils/typed-arrays.js');

/**
 * Helpers.
 */
function buildBST(intervals, endGetter, sortedIndices, tree, augmentations, i, low, high) {
  var mid = (low + (high - low) / 2) | 0,
      midMinusOne = ~-mid,
      midPlusOne = -~mid;

  var current = sortedIndices[mid];
  tree[i] = current + 1;

  var end = endGetter ? endGetter(intervals[current]) : intervals[current][1];

  var left = i * 2 + 1,
      right = i * 2 + 2;

  var result,
      leftEnd = -Infinity,
      rightEnd = -Infinity;

  if (low <= midMinusOne) {
    leftEnd = buildBST(
      intervals,
      endGetter,
      sortedIndices,
      tree,
      augmentations,
      left,
      low,
      midMinusOne
    );
  }

  if (midPlusOne <= high) {
    rightEnd = buildBST(
      intervals,
      endGetter,
      sortedIndices,
      tree,
      augmentations,
      right,
      midPlusOne,
      high
    );
  }

  var augmentation = Math.max(end, leftEnd, rightEnd);

  var augmentationPointer = current;

  if (augmentation === leftEnd)
    augmentationPointer = augmentations[tree[left] - 1];
  else if (augmentation === rightEnd)
    augmentationPointer = augmentations[tree[right] - 1];

  augmentations[current] = augmentationPointer;

  return augmentation;
}

/**
 * StaticIntervalTree.
 *
 * @constructor
 */
function StaticIntervalTree(intervals, getters) {

  // Properties
  this.size = intervals.length;
  this.intervals = intervals;

  var startGetter = null,
      endGetter = null;

  if (Array.isArray(getters)) {
    startGetter = getters[0];
    endGetter = getters[1];
  }

  // Building the indices array
  var length = intervals.length;

  var IndicesArray = typed.getPointerArray(length + 1);

  var indices = new IndicesArray(length);

  var i;

  for (i = 1; i < length; i++)
    indices[i] = i;

  // Sorting indices array
  // TODO: check if radix sort can outperform here
  indices.sort(function(a, b) {
    a = intervals[a];
    b = intervals[b];

    if (startGetter) {
      a = startGetter(a);
      b = startGetter(b);
    }
    else {
      a = a[0];
      b = b[0];
    }

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  });

  // Building the binary tree
  var height = Math.ceil(Math.log2(length + 1)),
      size = Math.pow(2, height) - 1;

  var tree = new IndicesArray(size);

  var augmentations = new IndicesArray(length);

  // TODO: store height to be able to use FiniteStack

  buildBST(
    intervals,
    endGetter,
    indices,
    tree,
    augmentations,
    0,
    0,
    length - 1
  );

  // DEBUG
  console.log(indices, tree, augmentations);

  var s = [[0, 0]];

  while (s.length) {
    var r = s.pop();
    var node = r[0];
    var level = r[1];

    if (tree[node] === 0)
      continue;

    var pointer = tree[node] - 1;

    console.log((new Array(level)).fill(' ').join('') + '[' + intervals[pointer].join(', ') + '] ' + intervals[augmentations[pointer]][1]);

    var left = node * 2 + 1,
        right = node * 2 + 2;

    if (right < tree.length)
      s.push([right, level + 1]);

    if (left < tree.length)
      s.push([left, level + 1]);
  }
}

/**
 * Convenience known methods.
 */
StaticIntervalTree.prototype.inspect = function() {
  return this;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {StaticIntervalTree}
 */
StaticIntervalTree.from = function(iterable) {

};

/**
 * Exporting.
 */
module.exports = StaticIntervalTree;
