/* eslint no-new: 0 */
/**
 * Mnemonist Vantage Point Tree Unit Tests
 * ========================================
 */
var assert = require('assert'),
    VPTree = require('../vp-tree.js'),
    levenshtein = require('leven'),
    random = require('pandemonium/random');

var WORDS = [
  'book',
  'back',
  'bock',
  'lock',
  'mack',
  'shock',
  'ephemeral',
  'magistral',
  'shawarma',
  'falafel',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze'
];

var WORST_CASE = [
  'abc',
  'abc',
  'abc',
  'bde',
  'bde',
  'cd',
  'cd',
  'abc'
];

function identity(a, b) {
  return +(a !== b);
}

function euclid2d(a, b) {
  var dx = a[0] - b[0],
      dy = a[1] - b[1];

  return Math.sqrt(dx * dx + dy * dy);
}

function serialize(results) {
  return new Set(results.map(function(d) {
    return d.distance + '§' + (typeof d.item === 'string' ? d.item : d.item.join('&'));
  }));
}

function assertSameNeighbors(A, B) {
  assert.deepStrictEqual(serialize(A), serialize(B));
}

function assertKNNInvariant(results) {
  var currentDistance = -Infinity;

  assert(results.every(function(d) {
    var gte = d.distance >= currentDistance;
    currentDistance = d.distance;

    return gte;
  }));
}

describe('VPTree', function() {

  it('should throw if invalid arguments are given.', function() {

    assert.throws(function() {
      new VPTree(null);
    }, /distance/);

    assert.throws(function() {
      new VPTree(Function.prototype);
    }, /items/);
  });

  it('should properly build the tree.', function() {
    var tree = new VPTree(levenshtein, WORDS);

    assert.strictEqual(tree.size, 15);

    assert.deepStrictEqual(tree.nodes, new Uint8Array([14, 6, 12, 13, 11, 10, 3, 8, 7, 9, 5, 2, 0, 4, 1]));
    assert.deepStrictEqual(tree.lefts, new Uint8Array([2, 7, 0, 0, 0, 0, 11, 9, 0, 0, 0, 0, 14, 0, 0]));
    assert.deepStrictEqual(tree.rights, new Uint8Array([1, 6, 3, 4, 5, 0, 10, 8, 0, 0, 12, 0, 13, 0, 0]));
    assert.deepStrictEqual(tree.mus, new Float64Array([6, 8, 4, 5, 2, 0, 2, 7, 0, 0, 3, 0, 2.5, 0, 0]));
  });

  it('should also work in the worst case scenario.', function() {
    var tree = new VPTree(identity, WORST_CASE);

    assert.strictEqual(tree.size, 8);

    assert.deepStrictEqual(tree.nodes, new Uint8Array([7, 6, 2, 1, 0, 3, 5, 4]));
    assert.deepStrictEqual(tree.lefts, new Uint8Array([2, 6, 0, 0, 0, 0, 0, 0]));
    assert.deepStrictEqual(tree.rights, new Uint8Array([1, 5, 3, 4, 0, 7, 0, 0]));
    assert.deepStrictEqual(tree.mus, new Float64Array([1, 1, 0, 0, 0, 0, 0, 0]));
  });

  it('should be possible to find the k nearest neighbors.', function() {
    var tree = new VPTree(levenshtein, WORDS);

    var neighbors = tree.nearestNeighbors(2, 'look');
    assertKNNInvariant(neighbors);

    assert.deepStrictEqual(neighbors, [
      {distance: 1, item: 'book'},
      {distance: 1, item: 'lock'}
    ]);

    neighbors = tree.nearestNeighbors(5, 'look');
    assertKNNInvariant(neighbors);

    assert.deepStrictEqual(neighbors, [
      {distance: 1, item: 'lock'},
      {distance: 1, item: 'book'},
      {distance: 2, item: 'bock'},
      {distance: 3, item: 'mack'},
      {distance: 3, item: 'back'}
    ]);
  });

  it('should be possible to find every neighbor within radius.', function() {
    var tree = new VPTree(levenshtein, WORDS);

    assertSameNeighbors(tree.neighbors(2, 'look'), [
      {distance: 1, item: 'lock'},
      {distance: 1, item: 'book'},
      {distance: 2, item: 'bock'}
    ]);

    assertSameNeighbors(tree.neighbors(3, 'look'), [
      {distance: 1, item: 'lock'},
      {distance: 3, item: 'shock'},
      {distance: 1, item: 'book'},
      {distance: 3, item: 'mack'},
      {distance: 3, item: 'back'},
      {distance: 2, item: 'bock'}
    ]);
  });

  it('should be possible to create a tree from an arbitrary iterable.', function() {
    var tree = VPTree.from(new Set(WORDS), levenshtein);

    assert.strictEqual(tree.size, 15);

    assert.deepStrictEqual(tree.nearestNeighbors(2, 'look'), [
      {distance: 1, item: 'book'},
      {distance: 1, item: 'lock'}
    ]);
  });

  it('should be possible to insert arbitrary items in the tree.', function() {
    var items = WORDS.map(function(item) {
      return {value: item};
    });

    var tree = new VPTree(function(a, b) {
      return levenshtein(a.value, b.value);
    }, items);

    assert.deepStrictEqual(tree.nearestNeighbors(2, {value: 'look'}), [
      {distance: 1, item: {value: 'book'}},
      {distance: 1, item: {value: 'lock'}}
    ]);
  });

  it('should return all nearest neighbors correctly (issue #147).', function() {
    var tree = new VPTree(euclid2d, [[-100, -100], [100, 100]]);

    var neighbors = tree.nearestNeighbors(2, [100, 100]);

    assert.deepStrictEqual(neighbors, [
      {distance: 0, item: [100, 100]},
      {distance: Math.sqrt(80000), item: [-100, -100]}
    ]);

    tree = new VPTree(euclid2d, [[-100, -100], [100, 100], [100, 100], [100, 100]]);

    neighbors = tree.nearestNeighbors(3, [100, 100]);

    assert.deepStrictEqual(neighbors, [
      {distance: 0, item: [100, 100]},
      {distance: 0, item: [100, 100]},
      {distance: 0, item: [100, 100]}
    ]);
  });

  it('should work with medium scale random data.', function() {
    var N = 10000;
    var vectors = new Array(N);

    var i;

    function randomVector() {
      return [
        random(-100, 100),
        random(-100, 100),
        random(-100, 100)
      ];
    }

    for (i = 0; i < N; i++)
      vectors[i] = randomVector();

    var query = randomVector();

    function linearAllNeighbors(items, radius, q) {
      var results = [];

      items.forEach(function(item) {
        var distance = euclid2d(q, item);
        if (distance <= radius)
          results.push({distance: distance, item: item});
      });

      return results;
    }

    var linearResults = linearAllNeighbors(vectors, 50, query);

    var tree = new VPTree(euclid2d, vectors);

    var treeResults = tree.neighbors(50, query);

    assertSameNeighbors(linearResults, treeResults);
  });
});
