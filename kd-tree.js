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

  // NOTE: partial sorting would be more memory-efficient
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

  return {
    axes: axes,
    values: values,
    pivots: pivots,
    lefts: lefts,
    rights: rights
  };
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
  this.values = result.values;

  this.pivots = result.pivots;
  this.lefts = result.lefts;
  this.rights = result.rights;

  this.size = this.values.length;
}

KDTree.prototype.nearestNeighbor = function(query) {
  var bestDistance = Infinity,
      best = null;

  var dimensions = this.dimensions,
      axes = this.axes,
      pivots = this.pivots,
      lefts = this.lefts,
      rights = this.rights;

  var visited = 0;

  function recurse(d, node) {
    visited++;

    var left = lefts[node],
        right = rights[node],
        pivot = pivots[node];

    var dist = squaredDistanceAxes(
      dimensions,
      axes,
      pivot,
      query
    );

    if (dist < bestDistance) {
      best = pivot;
      bestDistance = dist;

      if (dist === 0)
        return;
    }

    dx = axes[d][pivot] - query[d];

    d = (d + 1) % dimensions;

    // Going the correct way?
    if (dx > 0) {
      if (left !== 0)
        recurse(d, left - 1);
    }
    else {
      if (right !== 0)
        recurse(d, right - 1);
    }

    // Going the other way?
    if (dx * dx < bestDistance) {
      if (dx > 0) {
        if (right !== 0)
          recurse(d, right - 1);
      }
      else {
        if (left !== 0)
          recurse(d, left - 1);
      }
    }
  }

  recurse(0, 0);

  return [visited, best];
};


// nearest(dx > 0 ? root->left : root->right, nd, i, dim, best, best_dist);
// if (dx2 >= *best_dist) return;
// nearest(dx > 0 ? root->right : root->left, nd, i, dim, best, best_dist);

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
  // TODO: sanity tests
  // TODO: find tipping point for k, wrt d

  var asciitree = require('asciitree');

  var D = [
    ['zero', [2, 3]],
    ['one', [5, 4]],
    ['two', [9, 6]],
    ['three', [4, 7]],
    ['four', [8, 1]],
    ['five', [7, 2]]
  ];

  // var tree = buildTree(2, D);
  // console.log(tree.pivots, tree.lefts, tree.rights);
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
    return '(' + [tree.axes[0][node].toString().slice(0,4), tree.axes[1][node].toString().slice(0,4)] + ')';
  };

  // console.log(asciitree(0, title, children))

  var tree = new KDTree(2, D);

  console.log(tree);
  D.forEach(p => console.log(p[1], D[tree.nearestNeighbor(p[1])[1]]));

  var D = [];
  var N = 1000000;

  for (var i = 0; i < N; i++) {
    D.push([i, [Math.random(), Math.random()]]);
  }

  console.time('build');
  var tree = new KDTree(2, D);
  console.timeEnd('build');
  // console.log(asciitree(0, title, children))

  var T = 1000,
      s = 0;

  for (i = 0; i < T; i++) {
    s += tree.nearestNeighbor([Math.random(), Math.random()])[0];
  }

  console.log(Math.log2(N), s / T);
}
