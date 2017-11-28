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

  var DESCRIBED_INTERVALS = BASIC_INTERVALS.map(function(interval) {
    return {
      start: interval[0],
      end: interval[1]
    };
  });

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
    var tree = StaticIntervalTree.from(BASIC_INTERVALS);

    var intervals = tree.intervalsContainingPoint(134);

    assert.deepEqual(intervals, []);

    intervals = tree.intervalsContainingPoint(13);

    assert.deepEqual(intervals, [[10, 15], [3, 41]]);

    intervals = tree.intervalsContainingPoint(0);

    assert.deepEqual(intervals, [[0, 1]]);

    intervals = tree.intervalsContainingPoint(4);

    assert.deepEqual(intervals, [[3, 41]]);

    intervals = tree.intervalsContainingPoint(25);

    assert.deepEqual(intervals, [[20, 36], [3, 41]]);
  });

  it('should be possible to query by interval.', function() {
    var tree = StaticIntervalTree.from(BASIC_INTERVALS);

    var intervals = tree.intervalsOverlappingInterval([-34, 4]);

    assert.deepEqual(intervals, [[0, 1], [3, 41]]);

    intervals = tree.intervalsOverlappingInterval([-100, 100]);

    assert.deepEqual(intervals, [[10, 15], [20, 36], [29, 99], [0, 1], [3, 41]]);
  });

  it('should be possible to use getters.', function() {
    var startGetter = function(x) {
      return x.start;
    };

    var endGetter = function(x) {
      return x.end;
    };

    var tree = StaticIntervalTree.from(DESCRIBED_INTERVALS, [startGetter, endGetter]);

    var intervals = tree.intervalsContainingPoint(0);

    assert.deepEqual(intervals, [{start: 0, end: 1}]);

    intervals = tree.intervalsOverlappingInterval({start: -34, end: 4});

    assert.deepEqual(intervals, [{start: 0, end: 1}, {start: 3, end: 41}]);
  });
});
