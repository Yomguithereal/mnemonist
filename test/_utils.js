/**
 * Mnemonist Utils Unit Tests
 * ===========================
 */
var assert = require('assert'),
    iterate = require('../utils/iterate.js'),
    typed = require('../utils/typed-arrays.js'),
    binarySearch = require('../utils/binary-search.js');

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
  });

  describe('binary-search', function() {

    describe('#.search/#.searchWithComparator', function() {

      it('should properly return the index.', function() {
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
  });
});
