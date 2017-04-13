/* eslint-disable */
/**
 * Mnemonist Set Functions Unit Tests
 * ===================================
 */
var assert = require('assert'),
    functions = require('../set.js');

describe('Set functions', function() {

  describe('#.intersection', function() {

    it('should properly compute the intersection of two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var I = functions.intersection(A, B);

      assert.deepEqual(Array.from(I), [2, 3]);
    });

    it('should be variadic.', function() {
      var A = new Set([1, 2, 3, 4]),
          B = new Set([2, 3, 4]),
          C = new Set([1, 4]),
          D = new Set([4, 5, 6]);

      var I = functions.intersection(A, B, C, D);

      assert.deepEqual(Array.from(I), [4]);
    });
  });

  describe('#.union', function() {

    it('should properly compute the union of two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var U = functions.union(A, B);

      assert.deepEqual(Array.from(U), [1, 2, 3, 4]);
    });

    it('should be variadic.', function() {
      var A = new Set([1, 2, 3, 4]),
          B = new Set([2, 3, 4]),
          C = new Set([1, 4]),
          D = new Set([4, 5, 6]);

      var U = functions.union(A, B, C, D);

      assert.deepEqual(Array.from(U), [1, 2, 3, 4, 5, 6]);
    });
  });

  describe('#.difference', function() {

    it('should properly compute the difference of two sets.', function() {
      var A = new Set([1, 2, 3, 4, 5]),
          B = new Set([2, 3]);

      var D = functions.difference(A, B);

      assert.deepEqual(Array.from(D), [1, 4, 5]);
    });
  });
});
