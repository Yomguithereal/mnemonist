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
  return +(a === b);
}

// function print(tree) {
//   var data = tree.data,
//       stack = [[0, 0]],
//       L = data.length / 2;

//   while (stack.length) {
//     var [index, level] = stack.pop();

//     if (data[L + index]) {
//       console.log('-'.repeat(level * 2) + '[' + tree.items[data[index]] + ', ' + data[L + index] + ']');
//     }
//     else {
//       console.log('-'.repeat(level * 2) + '[' + tree.items[data[index]] + ']');
//     }

//     if (index * 2 + 2 < L && data[index * 2 + 2])
//       stack.push([index * 2 + 2, level + 1]);
//     if (index * 2 + 1 < L && data[index * 2 + 1])
//       stack.push([index * 2 + 1, level + 1]);
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
    assert.deepEqual(tree.data, [15, 14, 7, 13, 10, 6, 3, 11, 12, 8, 9, 4, 5, 1, 2, 6, 6, 9, 4, 6.5, 2.5, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('should also work in the worst case scenario.', function() {
    var tree = new VPTree(identity, WORST_CASE);

    assert.strictEqual(tree.size, 8);
    assert.deepEqual(tree.data, [8, 7, 3, 6, 4, 1, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});
