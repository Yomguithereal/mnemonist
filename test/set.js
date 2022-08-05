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
      var Exemplar = new Set([2, 3, 1]);
      var Equiv    = new Set([1, 2, 3]);
      var Missing1 = new Set([2, 3]);
      var Extra45  = new Set([1, 2, 3, 4, 5]);
      var Disjoint = new Set([7, 8, 9]);
      var Empty    = new Set([])
      //
      var WithItself   = functions.intersection(Exemplar, Exemplar);
      assert.deepStrictEqual(Array.from(WithItself), [2, 3, 1]);
      var WithEquiv    = functions.intersection(Exemplar, Equiv);
      assert.deepStrictEqual(Array.from(WithEquiv), [2, 3, 1]);
      var WithSubset   = functions.intersection(Exemplar, Missing1);
      assert.deepStrictEqual(Array.from(WithSubset), [2, 3]);
      var WithExtras   = functions.intersection(Exemplar, Extra45);
      assert.deepStrictEqual(Array.from(WithExtras), [2, 3, 1]);
      var WithDisjoint = functions.intersection(Exemplar, Disjoint);
      assert.deepStrictEqual(Array.from(WithDisjoint), []);
      var WithEmpty    = functions.intersection(Exemplar, Empty);
      assert.deepStrictEqual(Array.from(WithEmpty), []);
    });

    it('Makes no guarantees for element ordering.', function() {
      // To be clear: it *currently* preserves the order of the earliest of
      // sets with the smallest size, but do not depend on this behavior.
      //
      var Exemplar = new Set([2, 3, 99, 1, 10]);
      var Equiv    = new Set([1, 2, 3, 10, 99]);
      var SubsetA  = new Set([99, 3, 2]);
      var SubsetB  = new Set([3, 99, 2]);
      //
      var R1  = functions.intersection(Exemplar, Equiv);
      assert.deepStrictEqual(Array.from(R1), [2, 3, 99, 1, 10]);
      //
      var R2  = functions.intersection(Equiv, Exemplar);
      assert.deepStrictEqual(Array.from(R2), [1, 2, 3, 10, 99]);
      //
      var R3  = functions.intersection(Exemplar, Equiv, SubsetA);
      assert.deepStrictEqual(Array.from(R3), [99, 3, 2]);
      //
      var R4  = functions.intersection(Exemplar, SubsetB, Equiv, SubsetA);
      assert.deepStrictEqual(Array.from(R4), [3, 99, 2]);
    });

    it('compares identity, not equivalence.', function() {
      var arrE1   = []
      var arrE2   = []
      var arrN1   = [1]
      var arrN2   = [1]
      var Exemplar      = new Set([1, 2, 3, 'same', arrE1, arrN1]);
      var NoneIdentical = new Set([2, 3, 'same', arrE2, arrN2]);
      var SomeIdentical = new Set([arrN2, 2, 3, 'same', arrE1]);
      //
      var WithNoneI  = functions.intersection(Exemplar, NoneIdentical);
      assert.deepStrictEqual(Array.from(WithNoneI), [2, 3, 'same']);
      var WithSomeI  = functions.intersection(Exemplar, SomeIdentical);
      assert.deepStrictEqual(Array.from(WithSomeI), [2, 3, 'same', arrE1]);
    });

    it('returns a new set, modifying none', function() {
      var Exemplar = new Set([1, 2, 3]);
      var Missing1 = new Set([2, 3]);
      var Extra45  = new Set([1, 2, 3, 4, 5]);
      var Disjoint = new Set([7, 8, 9]);
      //
      functions.intersection(Exemplar, Missing1, Extra45, Disjoint);
      //
      assert.deepStrictEqual(Array.from(Exemplar), [1, 2, 3]);
      assert.deepStrictEqual(Array.from(Missing1), [2, 3]);
      assert.deepStrictEqual(Array.from(Extra45),  [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(Array.from(Disjoint), [7, 8, 9]);
    });

    it('should be variadic (work with multiple sets).', function() {
      var Exemplar = new Set([1, 2, 3]);
      var Equiv    = new Set([1, 2, 3]);
      var Missing1 = new Set([2, 3]);
      var Extra45  = new Set([1, 2, 3, 4, 5]);
      var Disjoint = new Set([7, 8, 9]);
      var Empty    = new Set([])

      var I1 = functions.intersection(Exemplar, Missing1, Extra45);

      assert.deepStrictEqual(Array.from(I1), [2, 3]);

      var I2 = functions.intersection(Exemplar, Missing1, Extra45, Disjoint);

      assert.deepStrictEqual(Array.from(I2), []);
    });
  });

  describe('#.union', function() {

    it('should properly compute the union of two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var U = functions.union(A, B);

      assert.deepStrictEqual(Array.from(U), [1, 2, 3, 4]);
    });

    it('should be variadic.', function() {
      var A = new Set([1, 2, 3, 4]),
          B = new Set([2, 3, 4]),
          C = new Set([1, 4]),
          D = new Set([4, 5, 6]);

      var U = functions.union(A, B, C, D);

      assert.deepStrictEqual(Array.from(U), [1, 2, 3, 4, 5, 6]);
    });
  });

  describe('#.difference', function() {

    it('should properly compute the difference of two sets.', function() {
      var A = new Set([1, 2, 3, 4, 5]),
          B = new Set([2, 3]);

      var D = functions.difference(A, B);

      assert.deepStrictEqual(Array.from(D), [1, 4, 5]);
    });
  });

  describe('#.symmetricDifference', function() {

    it('should properly compute the symmetric difference of two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([3, 4, 5]);

      var S = functions.symmetricDifference(A, B);

      assert.deepStrictEqual(Array.from(S), [1, 2, 4, 5]);
    });
  });

  describe('#.isSubset', function() {
    it('should properly return if the first set is a subset of the second.', function() {
      var A = new Set([1, 2]),
          B = new Set([1, 2, 3]),
          C = new Set([2, 4]),
          Empty = new Set([]);

      assert.strictEqual(functions.isSubset(A, B), true);
      assert.strictEqual(functions.isSubset(C, B), false);
      assert.strictEqual(functions.isSubset(Empty, B), true);
      assert.strictEqual(functions.isSubset(B, Empty), false);
      assert.strictEqual(functions.isSubset(Empty, Empty), true);
    });
  });

  describe('#.isEqual', function() {
    it('should properly return if the first set is equal to the second set.', function() {
      var Exemplar     = new Set([1, 2, 3]),
          SameObj      = Exemplar,
          YepEqualsTo  = new Set([1, 2, 3]),
          MoreEls      = new Set([1, 2, 3, 4]),
          FewerEls     = new Set([1]),
          DifferentEls = new Set([1, 2, 4]),
          Empty = new Set([]);

      assert.strictEqual(functions.isEqual(Exemplar,     Exemplar), true);
      assert.strictEqual(functions.isEqual(SameObj,      Exemplar), true);
      assert.strictEqual(functions.isEqual(YepEqualsTo,  Exemplar), true);
      assert.strictEqual(functions.isEqual(Empty,        Empty),    true);
      //
      assert.strictEqual(functions.isEqual(MoreEls,      Exemplar), false);
      assert.strictEqual(functions.isEqual(FewerEls,     Exemplar), false);
      assert.strictEqual(functions.isEqual(DifferentEls, Exemplar), false);
      assert.strictEqual(functions.isEqual(Empty,        Exemplar), false);
      assert.strictEqual(functions.isEqual(Exemplar,     Empty),    false);
    });
  });

  describe('#.isSuperset', function() {
    it('should properly return if the first set is a superset of the second.', function() {
      var A = new Set([1, 2]),
          B = new Set([1, 2, 3]),
          C = new Set([2, 4]),
          Empty = new Set([]);

      assert.strictEqual(functions.isSuperset(B, A), true);
      assert.strictEqual(functions.isSuperset(B, C), false);
      assert.strictEqual(functions.isSuperset(B, Empty), true);
      assert.strictEqual(functions.isSuperset(Empty, B), false);
      assert.strictEqual(functions.isSuperset(Empty, Empty), true);
    });
  });

  describe('#.add', function() {
    it('should properly add the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.add(A, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(A), [1, 2, 3]);

      functions.add(A, new Set());

      assert.deepStrictEqual(Array.from(A), [1, 2, 3]);
    });
  });

  describe('#.subtract', function() {
    it('should properly subtract the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.subtract(A, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(A), [1]);

      functions.subtract(A, new Set());

      assert.deepStrictEqual(Array.from(A), [1]);
    });

    it('should properly subtract sets from an empty set.', function() {
      var Empty = new Set([]);

      functions.subtract(Empty, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(Empty), []);

      functions.subtract(Empty, new Set());

      assert.deepStrictEqual(Array.from(Empty), []);
    });
  });

  describe('#.intersect', function() {
    var Equiv    = new Set([1, 2, 3]);
    var Missing1 = new Set([2, 3]);
    var Disjoint = new Set([7, 8, 9]);
    var Empty    = new Set([])

    it('should properly intersect overlapping sets.', function() {
      var Exemplar = new Set([1, 2, 3]);
      functions.intersect(Exemplar, Missing1)

      assert.deepStrictEqual(Array.from(Exemplar), [2, 3]);
      assert.deepStrictEqual(Array.from(Missing1), [2, 3]);
    });

    it('should properly intersect equivalent sets.', function() {
      var Exemplar = new Set([1, 2, 3]);
      functions.intersect(Exemplar, Exemplar)

      assert.deepStrictEqual(Array.from(Exemplar), [1, 2, 3]);

      functions.intersect(Exemplar, Equiv)

      assert.deepStrictEqual(Array.from(Exemplar), [1, 2, 3]);
      assert.deepStrictEqual(Array.from(Equiv), [1, 2, 3]);
    });

    it('should properly intersect disjoint sets.', function() {
      var Exemplar = new Set([1, 2, 3]);

      functions.intersect(Exemplar, Disjoint);

      assert.deepStrictEqual(Array.from(Exemplar), []);
      assert.deepStrictEqual(Array.from(Disjoint), [7, 8, 9]);

      Exemplar = new Set([1, 2, 3]);

      functions.intersect(Exemplar, Empty);

      assert.deepStrictEqual(Array.from(Exemplar), []);
      assert.deepStrictEqual(Array.from(Empty), []);
    });
  });

  describe('#.disjunct', function() {
    it('should properly disjunct the second set to the first.', function() {
      var A = new Set([1, 2]);

      functions.disjunct(A, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(A), [1, 3]);
    });
  });

  describe('#.intersectionSize', function() {
    it('should properly return the size of the intersection.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var N = new Set([]);

      assert.strictEqual(functions.intersectionSize(A, B), 2);
      assert.strictEqual(functions.intersectionSize(A, N), 0);
    });
  });

  describe('#.unionSize', function() {
    it('should properly return the size of the union.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var N = new Set([]);

      assert.strictEqual(functions.unionSize(A, B), 4);
      assert.strictEqual(functions.unionSize(A, N), 3);
    });
  });

  describe('#.jaccard', function() {
    it('should properly return the Jaccard similarity between two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var N = new Set([]);

      assert.strictEqual(functions.jaccard(A, B), 2 / 4);
      assert.strictEqual(functions.jaccard(A, N), 0);

      assert.strictEqual(functions.jaccard(new Set('contact'), new Set('context')), 4 / 7);
    });
  });

  describe('#.overlap', function() {
    it('should properly return the overlap coefficient between two sets.', function() {
      var A = new Set([1, 2, 3]),
          B = new Set([2, 3, 4]);

      var N = new Set([]);

      assert.strictEqual(functions.overlap(A, B), 2 / 3);
      assert.strictEqual(functions.overlap(A, N), 0);

      assert.strictEqual(functions.overlap(new Set('contact'), new Set('context')), 4 / 5);
    });
  });
});
