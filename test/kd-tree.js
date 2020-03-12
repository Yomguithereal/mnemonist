/* eslint no-new: 0 */
/**
 * Mnemonist KDTree Unit Tests
 * ============================
 */
var assert = require('assert'),
    KDTree = require('../kd-tree.js'),
    get = require('lodash/fp/get'),
    createTupleComparator = require('../utils/comparators.js').createTupleComparator;

var DATA = [
  ['zero', [2, 3]],
  ['one', [5, 4]],
  ['two', [9, 6]],
  ['three', [4, 7]],
  ['four', [8, 1]],
  ['five', [7, 2]]
];

function squaredDistance(a, b) {
  var dist = 0,
      step;

  for (var d = 0; d < a.length; d++) {
    step = a[d] - b[d];
    dist += step * step;
  }

  return dist;
}

function knn(k, q) {
  var candidates = DATA.map(function(item) {
    return [squaredDistance(q, item[1]), item];
  });

  candidates.sort(createTupleComparator(k));

  return candidates.slice(0, k).map(get([1, 0]));
}

describe('KDTree', function() {
  it('should be keep sane.', function() {
    var tree = KDTree.from(DATA, 2);

    DATA.forEach(function(item) {
      assert.strictEqual(tree.nearestNeighbor(item[1]), item[0]);
    });

    assert.strictEqual(tree.nearestNeighbor([8, 5]), 'two');

    assert.deepEqual(tree.pivots, new Uint8Array([5, 1, 0, 3, 2, 4]));
    assert.deepEqual(tree.lefts, new Uint8Array([2, 3, 0, 0, 6, 0]));
    assert.deepEqual(tree.rights, new Uint8Array([5, 4, 0, 0, 0, 0]));
  });

  it('should be possible to build a KDTree directly from axes.', function() {
    var labels = DATA.map(get(0)),
        axes = [DATA.map(get([1, 0])), DATA.map(get([1, 1]))];

    var tree = KDTree.fromAxes(axes, labels);

    DATA.forEach(function(item) {
      assert.strictEqual(tree.nearestNeighbor(item[1]), item[0]);
    });

    assert.strictEqual(tree.nearestNeighbor([8, 5]), 'two');

    assert.deepEqual(tree.pivots, new Uint8Array([5, 1, 0, 3, 2, 4]));
    assert.deepEqual(tree.lefts, new Uint8Array([2, 3, 0, 0, 6, 0]));
    assert.deepEqual(tree.rights, new Uint8Array([5, 4, 0, 0, 0, 0]));
  });

  it('should be possible to build a KDTree from axes and without labels.', function() {
    var axes = [DATA.map(get([1, 0])), DATA.map(get([1, 1]))];

    var tree = KDTree.fromAxes(axes);

    DATA.forEach(function(item, i) {
      assert.strictEqual(tree.nearestNeighbor(item[1]), i);
    });

    assert.strictEqual(tree.nearestNeighbor([8, 5]), 2);
  });

  it('should be possible to retrieve knn.', function() {
    var tree = KDTree.from(DATA, 2);

    DATA.forEach(function(item) {
      assert.strictEqual(tree.nearestNeighbor(item[1]), tree.kNearestNeighbors(1, item[1])[0]);

      var nn2 = knn(2, item[1]);
      assert.deepEqual(new Set(tree.kNearestNeighbors(2, item[1])), new Set(nn2));

      var nn3 = knn(3, item[1]);
      assert.deepEqual(new Set(tree.kNearestNeighbors(3, item[1])), new Set(nn3));
    });
  });
});
