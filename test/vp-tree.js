/* eslint no-new: 0 */
/**
 * Mnemonist Vantage Point Tree Unit Tests
 * ========================================
 */
var assert = require('assert'),
    VPTree = require('../vp-tree.js'),
    levenshtein = require('leven');

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

// function print(tree) {
//   var data = tree.data,
//       stack = [[0, 0]],
//       L = data.length / 2;

//   while (stack.length) {
//     var [index, level] = stack.pop();

//     if (data[index + 1]) {
//       console.log('-'.repeat(level * 2) + '[' + tree.items[data[index]] + ', ' + data[index + 1] + ']');
//     }
//     else {
//       console.log('-'.repeat(level * 2) + '[' + tree.items[data[index]] + ']');
//     }

//     if (data[index + 2])
//       stack.push([data[index + 2], level + 1]);
//     if (data[index + 3])
//       stack.push([data[index + 3], level + 1]);
//   }
// }

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

    assert.deepStrictEqual(neighbors, [
      {distance: 1, item: 'book'},
      {distance: 1, item: 'lock'}
    ]);

    neighbors = tree.nearestNeighbors(5, 'look');

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

    assert.deepStrictEqual(tree.neighbors(2, 'look'), [
      {distance: 1, item: 'lock'},
      {distance: 1, item: 'book'},
      {distance: 2, item: 'bock'}
    ]);

    assert.deepStrictEqual(tree.neighbors(3, 'look'), [
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
});
