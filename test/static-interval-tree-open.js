var assert = require('assert'),
    StaticIntervalTree = require('../static-interval-tree.js');

describe('StaticIntervalTree open bounds', function() {
  [false, true].forEach(function(openBegin) {
    [false, true].forEach(function(openEnd) {
      var options = {openBegin: openBegin, openEnd: openEnd};

      it('should query ' + (openBegin ? '(' : '[') + 'start,end' + (openEnd ? ')' : ']'), function() {
        var intervals = [[0, 0], [0, 1], [1, 1], [1, 2], [0, 3], [2, 3]],
            tree = new StaticIntervalTree(intervals),
            samples = [0, 0.5, 1, 1.5, 2, 2.5, 3];

        // Expand intervals into a finite set of boundary and interior points.
        // With integer endpoints, these samples distinguish all intersections.
        function members(interval) {
          var first = samples.indexOf(interval[0]),
              last = samples.indexOf(interval[1]);

          return samples.slice(first + (openBegin ? 1 : 0), last + (openEnd ? 0 : 1));
        }

        var sets = intervals.map(members);

        samples.forEach(function(point) {
          var expected = intervals.filter(function(interval, i) {
            return sets[i].indexOf(point) !== -1;
          });
          assert.deepStrictEqual(tree.intervalsContainingPoint(point, options).sort(), expected.sort());
        });

        intervals.forEach(function(query, j) {
          var expected = intervals.filter(function(interval, i) {
            return sets[i].some(function(point) {
              return sets[j].indexOf(point) !== -1;
            });
          });
          assert.deepStrictEqual(tree.intervalsOverlappingInterval(query, options).sort(), expected.sort());
        });
      });
    });
  });

  it('should retain inclusive defaults and support getters', function() {
    var interval = {from: 1, to: 2},
        tree = StaticIntervalTree.from([interval], [function(i) { return i.from; }, function(i) { return i.to; }]);

    assert.deepStrictEqual(tree.intervalsContainingPoint(2), [interval]);
    assert.deepStrictEqual(tree.intervalsContainingPoint(2, {openEnd: true}), []);
    assert.deepStrictEqual(tree.intervalsOverlappingInterval({from: 2, to: 3}, {openEnd: true}), []);
    assert.deepStrictEqual(tree.intervalsOverlappingInterval({from: 1.5, to: 3}, {openEnd: true}), [interval]);
    assert.deepStrictEqual(tree.intervalsContainingPoint(2, {}), [interval]);
  });
});
