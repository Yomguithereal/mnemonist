/**
 * Mnemonist StaticIntervalTree Unit Tests
 * ========================================
 */
var assert = require('assert'),
    StaticIntervalTree = require('../static-interval-tree.js');

describe('StaticIntervalTree', function() {
  var BASIC_INTERVALS = [
    [20, 36],
    [3, 41],
    [0, 1],
    [29, 99],
    [10, 15]
  ];

  // var DESCRIBED_INTERVALS = BASIC_INTERVALS.map(function(interval) {
  //   return {
  //     start: interval[0],
  //     end: interval[1]
  //   };
  // });

  it('should be possible to create a tree from an arbitraty iterable.', function() {
    var tree = StaticIntervalTree.from(BASIC_INTERVALS);

    assert.strictEqual(tree.size, 5);
    assert.strictEqual(tree.height, 3);

    var map = new Map();
    map.set(20, 36);
    map.set(29, 99);

    tree = StaticIntervalTree.from(map);

    assert.strictEqual(tree.size, 2);
    assert.strictEqual(tree.height, 2);
  });

  it('should be possible to query by point.', function() {
    // TODO
  });

  it('should be possible to query by interval.', function() {
    // TODO
  });

  it('should be possible to use getters.', function() {
    // TODO write & get
  });
});
