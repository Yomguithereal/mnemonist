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

  describe('#.symmetricDifference', function() {

    it('should properly compute the symmetric difference of two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([3, 4, 5]);

      var S = functions.symmetricDifference(A, B);

      assert.deepEqual(Array.from(S), [1, 2, 4, 5]);
    });
  });

  describe('#.isSubset', function() {
    it('should properly return if the first set is a subset of the second.', function() {
      var A = new Set([1, 2]),
          B = new Set([1, 2, 3]),
          C = new Set([2, 4]);

      assert.strictEqual(functions.isSubset(A, B), true);
      assert.strictEqual(functions.isSubset(C, B), false);
    });
  });

  describe('#.isSuperset', function() {
    it('should properly return if the first set is a subset of the second.', function() {
      var A = new Set([1, 2]),
          B = new Set([1, 2, 3]),
          C = new Set([2, 4]);

      assert.strictEqual(functions.isSuperset(B, A), true);
      assert.strictEqual(functions.isSuperset(B, C), false);
    });
  });

  describe('#.add', function() {
    it('should properly add the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.add(A, new Set([2, 3]));

      assert.deepEqual(Array.from(A), [1, 2, 3]);
    });
  });

  describe('#.subtract', function() {
    it('should properly subtract the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.subtract(A, new Set([2, 3]));

      assert.deepEqual(Array.from(A), [1]);
    });
  });

  describe('#.intersect', function() {
    it('should properly intersect the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.intersect(A, new Set([2, 3]));

      assert.deepEqual(Array.from(A), [2]);
    });
  });

  describe('#.disjunct', function() {
    it('should properly disjunct the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.disjunct(A, new Set([2, 3]));

      assert.deepEqual(Array.from(A), [1, 3]);
    });
  });
});
