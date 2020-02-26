/* eslint-disable */
/**
 * Mnemonist KDTree
 * =================
 *
 * Low-level JavaScript implementation of a k-dimensional tree.
 */
var forEach = require('obliterator/foreach');
var typed = require('./utils/typed-arrays.js');

function buildTree(dimensions, data) {
  var axes = new Array(dimensions),
      sortedAxes = new Array(dimensions),
      values = new Array(l),
      axis,
      sortedAxis;

  var l = data.length;

  var PointerArray = typed.getPointerArray(l);

  var d, i, row;

  var f = true;

  for (d = 0; d < dimensions; d++) {
    axis = new Float64Array(l);
    sortedAxis = new PointerArray(l);

    for (i = 0; i < l; i++) {
      row = data[i];
      axis[i] = row[1][d];
      sortedAxis[i] = i;

      if (f)
        values[i] = row[0];
    }

    f = false;
    axes[d] = axis;
    sortedAxes[d] = sortedAxis.sort(function(a, b) {
      a = axis[a];
      b = axis[b];

      if (a < b)
        return -1;

      if (a > b)
        return 1;

      return 0;
    });
  }

  return {axes: axes, sortedAxes: sortedAxes, values: values};
}

/**
 * KDTree.
 *
 * @constructor
 */
function KDTree(dimensions, data) {
  var result = buildTree(dimensions, data);

  this.dimensions = dimensions;

  this.axes = result.axes;
  this.sortedAxes = result.sortedAxes;
  this.values = result.values;

  this.size = this.values.length;
}

KDTree.prototype.nearestNeighbor = function(point) {
  var bestDistance = -Infinity,
      best = null;

  var visited = 0;

  var stack = [[0, 0, this.size - 1]],
      step,
      depth,
      start,
      stop,
      length,
      half,
      median,
      pivot,
      d;

  while (stack.length !== 0) {
    visited++;

    step = stack.pop();
    depth = step[0];
    start = step[1];
    stop = step[2];

    d = depth % this.dimensions;

    length = stop - start + 1;

    // TODO: bitwise opt.
    half = (length / 2) | 0;
    median = start + half;
    pivot = this.sortedAxes[d][median];

    console.log(this.values[pivot]);
  }
};

/**
 * Convenience known methods.
 */
KDTree.prototype.inspect = function() {
  var dummy = new Map();

  dummy.dimensions = this.dimensions;

  Object.defineProperty(dummy, 'constructor', {
    value: KDTree,
    enumerable: false
  });

  return dummy;
};

if (typeof Symbol !== 'undefined')
  KDTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = KDTree.prototype.inspect;

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {KDTree}
 */
KDTree.from = function(iterable) {

};

/**
 * Exporting.
 */
module.exports = KDTree;

if (require.main === module) {
  var D = [
    ['zero', [2, 3]],
    ['one', [5, 4]],
    ['two', [9, 6]],
    ['three', [4, 7]],
    ['four', [8, 1]],
    ['five', [7, 2]]
  ];

  var tree = new KDTree(2, D);

  console.log(tree);
  console.log(tree.nearestNeighbor([3, 4]));
}
