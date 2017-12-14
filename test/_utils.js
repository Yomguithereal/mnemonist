/**
 * Mnemonist Utils Unit Tests
 * ===========================
 */
var assert = require('assert'),
    iterate = require('../utils/iterate.js'),
    typed = require('../utils/typed-arrays.js'),
    binarySearch = require('../utils/binary-search.js'),
    merge = require('../utils/merge.js');

describe('utils', function() {

  describe('iterate', function() {

    it('should properly iterate over an array.', function() {
      var array = [1, 2, 3],
          i = 0;

      iterate(array, function(value, key) {
        assert.strictEqual(i, key);
        assert.strictEqual(value, i + 1);
        i++;
      });
    });

    it('should properly iterate over a string.', function() {
      var string = 'abc',
          map = ['a', 'b', 'c'],
          i = 0;

      iterate(string, function(value, key) {
        assert.strictEqual(i, key);
        assert.strictEqual(value, map[i]);
        i++;
      });
    });

    it('should properly iterate over an object.', function() {
      var object = Object.create({four: 5});
      object.one = 1;
      object.two = 2;
      object.three = 3;

      var keys = Object.keys(object),
          i = 1;

      iterate(object, function(value, key) {
        assert.strictEqual(value, i);
        assert.strictEqual(key, keys[i - 1]);
        i++;
      });
    });

    it('should properly iterate over a set.', function() {
      var set = new Set([1, 2, 3]),
          i = 0;

      iterate(set, function(value, key) {
        assert.strictEqual(value, ++i);
        assert.strictEqual(key, i);
      });
    });

    it('should properly iterate over a map.', function() {
      var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
          values = [1, 2, 3],
          keys = ['one', 'two', 'three'],
          i = 0;

      iterate(map, function(value, key) {
        assert.strictEqual(value, values[i]);
        assert.strictEqual(key, keys[i]);
        i++;
      });
    });

    it('should properly iterate over an arbitrary iterator.', function() {
      var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
          i = 0;

      iterate(map.values(), function(value, key) {
        assert.strictEqual(value, i + 1);
        assert.strictEqual(key, i);
        i++;
      });
    });

    it('should properly iterate over an arbitrary iterable.', function() {
      function Iterable() {}

      Iterable[Symbol.iterator] = function() {
        var i = 0;

        return {
          next: function() {
            if (i < 3)
              return {value: i++};
            return {done: true};
          }
        };
      };

      var j = 0;

      iterate(new Iterable(), function(value, key) {
        assert.strictEqual(value, j + 1);
        assert.strictEqual(key, j);
        j++;
      });
    });
  });

  describe('typed-arrays', function() {

    describe('#.getMinimalRepresentation', function() {

      it('should return the correct type.', function() {

        var tests = [
          [[1, 2, 3, 4, 5], Uint8Array],
          [[1, 2, -3, 4, 5], Int8Array],
          [[1, 3, 4, 3.4], Float64Array]
        ];

        tests.forEach(function(test) {
          var type = typed.getMinimalRepresentation(test[0]);
          assert.strictEqual(type, test[1], test[0] + ' => ' + test[1].name + ' but got ' + type.name);
        });
      });
    });

    describe('#.concat', function() {
      it('should properly concat every given byte array.', function() {
        var a = new Uint8Array([1, 2, 3]),
            b = new Uint8Array([4, 5]),
            c = new Uint8Array([5, 5, 6]);

        var ab = typed.concat(a, b),
            abc = typed.concat(a, b, c),
            ba = typed.concat(b, a);

        assert.deepEqual(Array.from(ab), [1, 2, 3, 4, 5]);
        assert.deepEqual(Array.from(abc), [1, 2, 3, 4, 5, 5, 5, 6]);
        assert.deepEqual(Array.from(ba), [4, 5, 1, 2, 3]);
      });
    });
  });

  describe('binary-search', function() {

    describe('#.search/#.searchWithComparator', function() {

      it('should return the correct index.', function() {
        var array = [1, 2, 3, 4, 5];

        array.forEach(function(v, i) {
          assert.strictEqual(binarySearch.search(array, v), i);
        });

        assert.strictEqual(binarySearch.search(array, 56), -1);
      });

      it('should work with a custom comparator.', function() {
        var array = [5, 4, 3, 2, 1];

        function comparator(a, b) {
          a = 4 - a;
          b = 4 - b;

          if (a < b)
            return -1;
          else if (a > b)
            return 1;

          return 0;
        }

        array.forEach(function(v, i) {
          assert.strictEqual(binarySearch.searchWithComparator(comparator, array, v), i);
        });

        assert.strictEqual(binarySearch.searchWithComparator(comparator, array, 56), -1);
      });
    });

    describe('#.lowerBound/#.lowerBoundWithComparator', function() {
      it('should return the correct index.', function() {
        var array = [1, 2, 3, 3, 3, 4, 4, 5, 5];

        assert.strictEqual(binarySearch.lowerBound(array, 56), array.length);
        assert.strictEqual(binarySearch.lowerBound(array, -4), 0);
        assert.strictEqual(binarySearch.lowerBound(array, 3), 2);
        assert.strictEqual(binarySearch.lowerBound(array, 4), 5);
        assert.strictEqual(binarySearch.lowerBound(array, 1), 0);
        assert.strictEqual(binarySearch.lowerBound(array, 2), 1);
        assert.strictEqual(binarySearch.lowerBound(array, 5), 7);

        assert.strictEqual(binarySearch.lowerBound([1, 2, 3, 4, 5, 5, 5, 6, 7, 9], 8), 9);
      });

      it('should work with a custom comparator.', function() {
        var array = ['one', 'two', 'three', 'three', 'three', 'four', 'four', 'five', 'five'];

        var values = {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5
        };

        var comparator = function(a, b) {
          a = typeof a === 'number' ? a : values[a];
          b = typeof b === 'number' ? b : values[b];

          if (a < b)
            return -1;
          else if (a > b)
            return 1;

          return 0;
        };

        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, 56), array.length);
        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, -4), 0);
        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, 'three'), 2);
        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, 'four'), 5);
        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, 'one'), 0);
        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, 'two'), 1);
        assert.strictEqual(binarySearch.lowerBoundWithComparator(comparator, array, 'five'), 7);
      });
    });

    describe('#.upperBound/#.upperBoundWithComparator', function() {
      it('should return the correct index.', function() {
        var array = [1, 2, 3, 3, 3, 4, 4, 5, 5];

        assert.strictEqual(binarySearch.upperBound(array, 56), array.length);
        assert.strictEqual(binarySearch.upperBound(array, -4), 0);
        assert.strictEqual(binarySearch.upperBound(array, 3), 5);
        assert.strictEqual(binarySearch.upperBound(array, 4), 7);
        assert.strictEqual(binarySearch.upperBound(array, 1), 1);
        assert.strictEqual(binarySearch.upperBound(array, 2), 2);
        assert.strictEqual(binarySearch.upperBound(array, 5), 9);

        assert.strictEqual(binarySearch.lowerBound([1, 2, 3, 4, 5, 5, 5, 6, 7, 9], 8), 9);
      });

      it('should work with a custom comparator.', function() {
        var array = ['one', 'two', 'three', 'three', 'three', 'four', 'four', 'five', 'five'];

        var values = {
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5
        };

        var comparator = function(a, b) {
          a = typeof a === 'number' ? a : values[a];
          b = typeof b === 'number' ? b : values[b];

          if (a < b)
            return -1;
          else if (a > b)
            return 1;

          return 0;
        };

        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, 56), array.length);
        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, -4), 0);
        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, 'three'), 5);
        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, 'four'), 7);
        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, 'one'), 1);
        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, 'two'), 2);
        assert.strictEqual(binarySearch.upperBoundWithComparator(comparator, array, 'five'), 9);
      });
    });
  });

  describe('merge', function() {

    describe('#.merge', function() {
      it('should properly merge two arrays.', function() {
        var tests = [
          [[1, 2, 3], [], [1, 2, 3]],
          [[], [1, 2, 3], [1, 2, 3]],
          [[], [], []],
          [[1, 2, 3], [4, 5, 6], [1, 2, 3, 4, 5, 6]],
          [[4, 5, 6], [1, 2, 3], [1, 2, 3, 4, 5, 6]],
          [[1, 2, 2, 3], [2, 3, 3, 4], [1, 2, 2, 2, 3, 3, 3, 4]]
        ];

        tests.forEach(function(test) {
          assert.deepEqual(merge.merge(test[0], test[1]), test[2]);
        });
      });

      it('should properly merge k arrays.', function() {
        var tests = [
          [[[], [], [], []], []],
          [[[1, 2, 3], [4, 5, 6], [1, 2, 3], [4, 7]], [1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7]]
        ];

        tests.forEach(function(test) {
          assert.deepEqual(merge.merge.apply(null, test[0]), test[1]);
        });
      });
    });

    describe('#.unionUnique', function() {
      it('should properly perform the union of two unique arrays.', function() {
        var tests = [
          [[1, 2, 3], [], [1, 2, 3]],
          [[], [1, 2, 3], [1, 2, 3]],
          [[], [], []],
          [[1, 2, 3], [4, 5, 6], [1, 2, 3, 4, 5, 6]],
          [[4, 5, 6], [1, 2, 3], [1, 2, 3, 4, 5, 6]],
          [[1, 2], [2, 4], [1, 2, 4]],
          [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6]]
        ];

        tests.forEach(function(test) {
          assert.deepEqual(merge.unionUnique(test[0], test[1]), test[2]);
        });
      });

      it('should properly perform the union of k unique arrays.', function() {
        var tests = [
          [[[], [], [], []], []],
          [[[1, 2, 3], [4, 5, 6], [1, 2, 3], [4, 7]], [1, 2, 3, 4, 5, 6, 7]]
        ];

        tests.forEach(function(test) {
          assert.deepEqual(merge.unionUnique.apply(null, test[0]), test[1]);
        });
      });
    });

    describe('#.intersectionUnique', function() {
      it('should properly perform the intersection of two unique arrays.', function() {
        var tests = [
          [[1, 2, 3], [], []],
          [[], [1, 2, 3], []],
          [[], [], []],
          [[1, 2, 3], [4, 5, 6], []],
          [[4, 5, 6], [1, 2, 3], []],
          [[1, 2], [2, 4], [2]],
          [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [2, 3, 4, 5]],
          [[1, 2, 3, 4], [2, 4, 6], [2, 4]]
        ];

        tests.forEach(function(test) {
          assert.deepEqual(merge.intersectionUnique(test[0], test[1]), test[2]);
        });
      });

      it('should properly perform the intersection of k unique arrays.', function() {
        var tests = [
          [[[], [], [], []], []],
          [[[1, 2, 3], [4, 5, 6], [1, 2, 3], [4, 7]], []],
          [[[1, 2, 3], [3, 4, 5], [1, 3, 4], [3, 567], [-14, 3]], [3]]
        ];

        tests.forEach(function(test) {
          assert.deepEqual(merge.intersectionUnique.apply(null, test[0]), test[1]);
        });
      });
    });
  });
});
