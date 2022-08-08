/**
 * Mnemonist Utils Unit Tests
 * ===========================
 */
var assert = require('assert'),
    typed = require('../utils/typed-arrays.js'),
    binarySearch = require('../utils/binary-search.js'),
    merge = require('../utils/merge.js'),
    hashTables = require('../utils/hash-tables.js'),
    iterables = require('../utils/iterables.js');

describe('utils', function() {

  describe('typed-arrays', function() {

    describe('#.getPointerArray', function() {
      var validatePointerArrayConstructor = function(min, max, expectedCtor) {
        it(`returns ${expectedCtor} for ${min}`, function() {
          assert.strictEqual(typed.getPointerArray(min), expectedCtor);
        });
        it(`returns ${expectedCtor} for ${(max - min) / 2}`, function() {
          assert.strictEqual(typed.getPointerArray((max - min) / 2), expectedCtor);
        });
        it(`returns ${expectedCtor} for ${max}`, function() {
          assert.strictEqual(typed.getPointerArray(max), expectedCtor);
        });
      };

      describe('returns Uint8Array for capacity <= Math.pow(2, 8)', function() {
        validatePointerArrayConstructor(0, Math.pow(2, 8), Uint8Array);
      });

      describe('returns Uint16Array for Math.pow(2, 8) < capacity <= Math.pow(2, 16)', function() {
        validatePointerArrayConstructor(Math.pow(2, 8) + 1, Math.pow(2, 16), Uint16Array);
      });

      describe('returns Uint32Array for Math.pow(2, 16) < capacity <= Math.pow(2, 32)', function() {
        validatePointerArrayConstructor(Math.pow(2, 16) + 1, Math.pow(2, 32), Uint32Array);
      });

      describe('throws error for capacity > Math.pow(2, 32)', function() {
        assert.throws(function() {
          typed.getPointerArray(Math.pow(2, 32) + 1);
        }, /Pointer Array of size > 4294967295 is not supported/);
      });
    });

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

        assert.deepStrictEqual(Array.from(ab), [1, 2, 3, 4, 5]);
        assert.deepStrictEqual(Array.from(abc), [1, 2, 3, 4, 5, 5, 5, 6]);
        assert.deepStrictEqual(Array.from(ba), [4, 5, 1, 2, 3]);
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

      it('should work with sorted indices.', function() {
        var array = [3, 6, 2, 5, 1, 0, 15];
        var argsort = [5, 4, 2, 0, 3, 1, 6];
        var sorted = [0, 1, 2, 3, 5, 6, 15];

        var tests = [5, -14, 0, 1, 3, 36, 6758];

        tests.forEach(function(n) {
          assert.strictEqual(
            binarySearch.lowerBoundIndices(array, argsort, n),
            binarySearch.lowerBound(sorted, n)
          );
        });
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
          assert.deepStrictEqual(merge.merge(test[0], test[1]), test[2]);
        });
      });

      it('should properly merge k arrays.', function() {
        var tests = [
          [[[], [], [], []], []],
          [[[1, 2, 3], [4, 5, 6], [1, 2, 3], [4, 7]], [1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7]]
        ];

        tests.forEach(function(test) {
          assert.deepStrictEqual(merge.merge.apply(null, test[0]), test[1]);
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
          assert.deepStrictEqual(merge.unionUnique(test[0], test[1]), test[2]);
        });
      });

      it('should properly perform the union of k unique arrays.', function() {
        var tests = [
          [[[], [], [], []], []],
          [[[1, 2, 3], [4, 5, 6], [1, 2, 3], [4, 7]], [1, 2, 3, 4, 5, 6, 7]]
        ];

        tests.forEach(function(test) {
          assert.deepStrictEqual(merge.unionUnique.apply(null, test[0]), test[1]);
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
          assert.deepStrictEqual(merge.intersectionUnique(test[0], test[1]), test[2]);
        });
      });

      it('should properly perform the intersection of k unique arrays.', function() {
        var tests = [
          [[[], [], [], []], []],
          [[[1, 2, 3], [4, 5, 6], [1, 2, 3], [4, 7]], []],
          [[[1, 2], [3, 4], [5, 6], [7, 8]], []],
          [[[1, 2, 3], [3, 4, 5], [1, 3, 4], [3, 567], [-14, 3]], [3]],
          [[[1, 2, 3, 4], [3, 4, 5], [1, 3, 4], [3, 4, 567], [-14, 3, 4]], [3, 4]],
        ];

        tests.forEach(function(test) {
          assert.deepStrictEqual(merge.intersectionUnique.apply(null, test[0]), test[1]);
        });
      });
    });
  });

  describe('hash-tables', function() {

    it('should be possible to use linear probing.', function() {
      var fn = hashTables.linearProbing;

      var h = hashTables.hashes.jenkinsInt32;

      var keys = new Uint32Array(8),
          values = new Uint32Array(8);

      var pairs = [
        [4563, 1],
        [534274, 2],
        [36464, 3],
        [45353, 4],
        [82754, 5],
        [8696007, 6],
        [344994, 7],
        [71654, 8]
      ];

      pairs.forEach(function(pair) {
        fn.set(h, keys, values, pair[0], pair[1]);
      });

      pairs.forEach(function(pair) {
        assert.strictEqual(fn.get(h, keys, values, pair[0]), pair[1]);
      });

      pairs.forEach(function(pair) {
        assert.strictEqual(fn.has(h, keys, pair[0]), true);
      });

      assert.throws(function() {
        fn.set(h, keys, values, 453, 9);
      }, /full/);

      assert.strictEqual(fn.get(h, keys, values, 485385), undefined);
      assert.strictEqual(fn.has(h, keys, 48753), false);
    });
  });

  describe('iterables', function() {
    describe('#.toArrayWithIndices', function() {
      it('should work correctly.', function() {
        var array = [4, 15, -3];
        var set = new Set(array);

        assert.deepStrictEqual(
          iterables.toArrayWithIndices(array),
          [[4, 15, -3], new Uint8Array([0, 1, 2])]
        );

        assert.deepStrictEqual(
          iterables.toArrayWithIndices(set),
          [[4, 15, -3], new Uint8Array([0, 1, 2])]
        );

        assert.deepStrictEqual(
          iterables.toArrayWithIndices(set.values()),
          [[4, 15, -3], [0, 1, 2]]
        );
      });
    });
  });
});
