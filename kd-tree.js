/* eslint-disable */
/**
 * Mnemonist KDTree
 * =================
 *
 * Low-level JavaScript implementation of a k-dimensional tree.
 */
var forEach = require('obliterator/foreach');
var typed = require('./utils/typed-arrays.js');

function squaredDistance(dimensions, a, b) {
  var d;

  var dist = 0,
      step;

  for (d = 0; d < dimensions; d++) {
    step = a[d] - b[d];
    dist += step * step;
  }

  return dist;
}

function squaredDistanceAxes(dimensions, axes, pivot, b) {
  var d;

  var dist = 0,
      step;

  for (d = 0; d < dimensions; d++) {
    step = axes[d][pivot] - b[d];
    dist += step * step;
  }

  return dist;
}

function buildTree(dimensions, data) {
  var axes = new Array(dimensions),
      values = new Array(l),
      axis;

  var l = data.length;

  var PointerArray = typed.getPointerArray(l);

  var ids = new PointerArray(l);

  var d, i, row;

  var f = true;

  for (d = 0; d < dimensions; d++) {
    axis = new Float64Array(l);

    for (i = 0; i < l; i++) {
      row = data[i];
      axis[i] = row[1][d];

      if (f) {
        values[i] = row[0];
        ids[i] = i;
      }
    }

    f = false;
    axes[d] = axis;
  }

  // Building the tree
  var pivots = new PointerArray(l),
      lefts = new PointerArray(l),
      rights = new PointerArray(l);

  var stack = [[0, ids, -1, 0]],
      step,
      buffer,
      parent,
      direction,
      median,
      pivot;

  i = 0;

  var axisSorter = function(a, b) {
    a = axes[d][a];
    b = axes[d][b];

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  };

  while (stack.length !== 0) {
    step = stack.pop();
    d = step[0];
    buffer = step[1];
    parent = step[2];
    direction = step[3];

    buffer.sort(axisSorter);

    median = buffer.length >>> 1;
    pivot = buffer[median];
    pivots[i] = pivot;

    if (parent > -1) {
      if (direction === 0)
        lefts[parent] = i + 1;
      else
        rights[parent] = i + 1;
    }

    d = (d + 1) % dimensions;

    // Right
    if (median !== 0 && median !== buffer.length - 1) {
      stack.push([d, buffer.slice(median + 1), i, 1]);
    }

    // Left
    if (median !== 0) {
      stack.push([d, buffer.slice(0, median), i, 0]);
    }

    i++;
  }

  return {axes: axes, values: values, pivots: pivots, lefts: lefts, rights: rights};
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

KDTree.prototype.nearestNeighbor = function(query) {
  var bestDistance = Infinity,
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
      leftStart,
      leftStop,
      hasLeft,
      rightStart,
      rightStop,
      hasRight,
      dist,
      dx,
      d,
      w;

  while (stack.length !== 0) {
    visited++;

    step = stack.pop();
    depth = step[0];
    start = step[1];
    stop = step[2];

    d = depth % this.dimensions;

    length = stop - start + 1;
    half = length >>> 1;
    median = start + half;
    pivot = this.sortedAxes[d][median];
    console.log(this.values[pivot], depth, start, stop)
    leftStart = start;
    leftStop = median - 1;
    hasLeft = leftStop - leftStart > -1;

    rightStart = median + 1;
    rightStop = stop;
    hasRight = rightStop - rightStart > -1;

    dist = squaredDistanceAxes(
      this.dimensions,
      this.axes,
      pivot,
      query
    );

    dx = this.axes[d][pivot] - query[d];

    if (dist < bestDistance) {
      best = pivot;
      bestDistance = dist;
    }

    // Going the other way?
    if (dx * dx < bestDistance) {
      w = dx >= 0;

      if (w) {
        if (hasRight)
          stack.push([depth + 1, rightStart, rightStop]);
      }
      else {
        if (hasLeft)
          stack.push([depth + 1, leftStart, leftStop]);
      }
    }

    // Going the correct way?
    w = dx < 0;

    if (w) {
      if (hasRight)
        stack.push([depth + 1, rightStart, rightStop]);
    }
    else {
      if (hasLeft)
        stack.push([depth + 1, leftStart, leftStop]);
    }
  }

  console.log(this.axes, this.values, this.values[best], bestDistance, visited);
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
  var asciitree = require('asciitree');

  var D = [
    ['zero', [2, 3]],
    ['one', [5, 4]],
    ['two', [9, 6]],
    ['three', [4, 7]],
    ['four', [8, 1]],
    ['five', [7, 2]]
  ];

  var tree = buildTree(2, D);
  console.log(tree.pivots, tree.lefts, tree.rights);
  var children = (node) => {

    var row = [
      tree.lefts[node] ? (tree.lefts[node] - 1) : null,
      tree.rights[node] ? (tree.rights[node] - 1) : null
    ];

    if (row[0] === null && row[1] === null)
      return null;

    return row;
  };

  var title = (node) => {
    if (node === null)
      return '';

    node = tree.pivots[node];
    return '(' + [tree.axes[0][node], tree.axes[1][node]] + ')';
  };

  console.log(asciitree(0, title, children))

  // var tree = new KDTree(2, D);

  // console.log(tree);
  // console.log(tree.nearestNeighbor([5, 4]));

  // var D = [];
  // var N = 100000;

  // for (var i = 0; i < N; i++) {
  //   D.push([i, [Math.random(), Math.random()]]);
  // }

  // var tree = new KDTree(2, D);
  // tree.nearestNeighbor([Math.random(), Math.random()]);
  // console.log(Math.log2(N));
}
