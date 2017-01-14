/**
 * Mnemonist Utils Unit Tests
 * ===========================
 */
var assert = require('assert'),
    iterationHelpers = require('../utils/iteration.js');

describe('utils', function() {

  describe('iteration', function() {

    describe('#.iterate', function() {

      it('should properly iterate over an array.', function() {
        var array = [1, 2, 3],
            i = 0;

        iterationHelpers.iterate(array, function(value, key) {
          assert.strictEqual(i, key);
          assert.strictEqual(value, i + 1);
          i++;
        });
      });

      it('should properly iterate over an object.', function() {
        var object = {
          one: 1,
          two: 2,
          three: 3
        };

        var keys = Object.keys(object),
            i = 1;

        iterationHelpers.iterate(object, function(value, key) {
          assert.strictEqual(value, i);
          assert.strictEqual(key, keys[i - 1]);
          i++;
        });
      });

      it('should properly iterate over a set.', function() {
        var set = new Set([1, 2, 3]),
            i = 0;

        iterationHelpers.iterate(set, function(value, key) {
          assert.strictEqual(value, ++i);
          assert.strictEqual(key, i);
        });
      });

      it('should properly iterate over a map.', function() {
        var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
            values = [1, 2, 3],
            keys = ['one', 'two', 'three'],
            i = 0;

        iterationHelpers.iterate(map, function(value, key) {
          assert.strictEqual(value, values[i]);
          assert.strictEqual(key, keys[i]);
          i++;
        });
      });

      it('should properly iterate over an arbitrary iterator.', function() {
        var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
            i = 0;

        iterationHelpers.iterate(map.values(), function(value, key) {
          assert.strictEqual(value, i + 1);
          assert.strictEqual(key, i);
          i++;
        });
      });
    });
  });
});
