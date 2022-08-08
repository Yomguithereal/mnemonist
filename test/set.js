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
      var exemplar = new Set([2, 3, 1]);
      var equiv    = new Set([1, 2, 3]);
      var missing1 = new Set([2, 3]);
      var extra45  = new Set([1, 2, 3, 4, 5]);
      var disjoint = new Set([7, 8, 9]);
      var empty    = new Set([])
      //
      var withItself   = functions.intersection(exemplar, exemplar);
      assert.deepStrictEqual(Array.from(withItself), [2, 3, 1]);
      var withEquiv    = functions.intersection(exemplar, equiv);
      assert.deepStrictEqual(Array.from(withEquiv), [2, 3, 1]);
      var withSubset   = functions.intersection(exemplar, missing1);
      assert.deepStrictEqual(Array.from(withSubset), [2, 3]);
      var withExtras   = functions.intersection(exemplar, extra45);
      assert.deepStrictEqual(Array.from(withExtras), [2, 3, 1]);
      var withDisjoint = functions.intersection(exemplar, disjoint);
      assert.deepStrictEqual(Array.from(withDisjoint), []);
      var withEmpty    = functions.intersection(exemplar, empty);
      assert.deepStrictEqual(Array.from(withEmpty), []);
    });

    it('makes no guarantees for element ordering.', function() {
      // To be clear: it *currently* preserves the order of the earliest of
      // sets with the smallest size, but do not depend on this behavior.
      //
      var exemplar = new Set([2, 3, 99, 1, 10]);
      var equiv    = new Set([1, 2, 3, 10, 99]);
      var subsetA  = new Set([99, 3, 2]);
      var subsetB  = new Set([3, 99, 2]);
      //
      var r1  = functions.intersection(exemplar, equiv);
      assert.deepStrictEqual(Array.from(r1), [2, 3, 99, 1, 10]);
      //
      var r2  = functions.intersection(equiv, exemplar);
      assert.deepStrictEqual(Array.from(r2), [1, 2, 3, 10, 99]);
      //
      var r3  = functions.intersection(exemplar, equiv, subsetA);
      assert.deepStrictEqual(Array.from(r3), [99, 3, 2]);
      //
      var r4  = functions.intersection(exemplar, subsetB, equiv, subsetA);
      assert.deepStrictEqual(Array.from(r4), [3, 99, 2]);
    });

    it('compares identity, not equivalence.', function() {
      var arrE1   = []
      var arrE2   = []
      var arrN1   = [1]
      var arrN2   = [1]
      var exemplar      = new Set([1, 2, 3, 'same', arrE1, arrN1]);
      var noneIdentical = new Set([2, 3, 'same', arrE2, arrN2]);
      var someIdentical = new Set([arrN2, 2, 3, 'same', arrE1]);
      //
      var withNoneI  = functions.intersection(exemplar, noneIdentical);
      assert.deepStrictEqual(Array.from(withNoneI), [2, 3, 'same']);
      var withSomeI  = functions.intersection(exemplar, someIdentical);
      assert.deepStrictEqual(Array.from(withSomeI), [2, 3, 'same', arrE1]);
    });

    it('returns a new set, modifying none', function() {
      var exemplar = new Set([1, 2, 3]);
      var missing1 = new Set([2, 3]);
      var extra45  = new Set([1, 2, 3, 4, 5]);
      var disjoint = new Set([7, 8, 9]);
      //
      functions.intersection(exemplar, missing1, extra45, disjoint);
      //
      assert.deepStrictEqual(Array.from(exemplar), [1, 2, 3]);
      assert.deepStrictEqual(Array.from(missing1), [2, 3]);
      assert.deepStrictEqual(Array.from(extra45),  [1, 2, 3, 4, 5]);
      assert.deepStrictEqual(Array.from(disjoint), [7, 8, 9]);
    });

    it('should be variadic (work with multiple sets).', function() {
      var exemplar = new Set([1, 2, 3]);
      var equiv    = new Set([1, 2, 3]);
      var missing1 = new Set([2, 3]);
      var extra45  = new Set([1, 2, 3, 4, 5]);
      var disjoint = new Set([7, 8, 9]);
      var empty    = new Set([])

      var intersectioned1 = functions.intersection(exemplar, missing1, extra45);

      assert.deepStrictEqual(Array.from(intersectioned1), [2, 3]);

      var intersectioned2 = functions.intersection(exemplar, missing1, extra45, disjoint);

      assert.deepStrictEqual(Array.from(intersectioned2), []);
    });
  });

  describe('#.union', function() {

    it('should properly compute the union of two sets.', function() {
      var setA = new Set([1, 2, 3]),
          setB = new Set([2, 3, 4]);

      var unioned = functions.union(setA, setB);

      assert.deepStrictEqual(Array.from(unioned), [1, 2, 3, 4]);
    });

    it('should be variadic.', function() {
      var setA = new Set([1, 2, 3, 4]),
          setB = new Set([2, 3, 4]),
          setC = new Set([1, 4]),
          setD = new Set([4, 5, 6]);

      var unioned = functions.union(setA, setB, setC, setD);

      assert.deepStrictEqual(Array.from(unioned), [1, 2, 3, 4, 5, 6]);
    });
  });

  describe('#.difference', function() {

    it('should properly compute the difference of two sets.', function() {
      var setA = new Set([1, 2, 3, 4, 5]),
          setB = new Set([2, 3]);

      var differenced = functions.difference(setA, setB);

      assert.deepStrictEqual(Array.from(differenced), [1, 4, 5]);
    });
  });

  describe('#.symmetricDifference', function() {

    it('should properly compute the symmetric difference of two sets.', function() {
      var setA = new Set([1, 2, 3]),
          setB = new Set([3, 4, 5]);

      var symDiffed = functions.symmetricDifference(setA, setB);

      assert.deepStrictEqual(Array.from(symDiffed), [1, 2, 4, 5]);
    });
  });

  describe('#.isSubset', function() {
    it('should properly return if the first set is a subset of the second.', function() {
      var setA = new Set([1, 2]),
          setB = new Set([1, 2, 3]),
          setC = new Set([2, 4]),
          empty = new Set([]);

      assert.strictEqual(functions.isSubset(setA, setB), true);
      assert.strictEqual(functions.isSubset(setC, setB), false);
      assert.strictEqual(functions.isSubset(empty, setB), true);
      assert.strictEqual(functions.isSubset(setB, empty), false);
      assert.strictEqual(functions.isSubset(empty, empty), true);
    });
  });

  describe('#.isEqual', function() {
    it('should properly return if the first set is equal to the second set.', function() {
      var exemplar = new Set([1, 2, 3]),
          sameObj = exemplar,
          yepEqualsTo = new Set([1, 2, 3]),
          moreEls = new Set([1, 2, 3, 4]),
          fewerEls = new Set([1]),
          differentEls = new Set([1, 2, 4]),
          empty = new Set([]);

      assert.strictEqual(functions.isEqual(exemplar,     exemplar), true);
      assert.strictEqual(functions.isEqual(sameObj,      exemplar), true);
      assert.strictEqual(functions.isEqual(yepEqualsTo,  exemplar), true);
      assert.strictEqual(functions.isEqual(empty,        empty),    true);
      //
      assert.strictEqual(functions.isEqual(moreEls,      exemplar), false);
      assert.strictEqual(functions.isEqual(fewerEls,     exemplar), false);
      assert.strictEqual(functions.isEqual(differentEls, exemplar), false);
      assert.strictEqual(functions.isEqual(empty,        exemplar), false);
      assert.strictEqual(functions.isEqual(exemplar,     empty),    false);
    });
  });

  describe('#.isSuperset', function() {
    it('should properly return if the first set is a superset of the second.', function() {
      var setA = new Set([1, 2]),
          setB = new Set([1, 2, 3]),
          setC = new Set([2, 4]),
          empty = new Set([]);

      assert.strictEqual(functions.isSuperset(setB, setA), true);
      assert.strictEqual(functions.isSuperset(setB, setC), false);
      assert.strictEqual(functions.isSuperset(setB, empty), true);
      assert.strictEqual(functions.isSuperset(empty, setB), false);
      assert.strictEqual(functions.isSuperset(empty, empty), true);
    });
  });

  describe('#.add', function() {
    it('should properly add the second set to the first.', function() {
      var setA = new Set([1, 2]);

      functions.add(setA, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(setA), [1, 2, 3]);

      functions.add(setA, new Set());

      assert.deepStrictEqual(Array.from(setA), [1, 2, 3]);
    });
  });

  describe('#.subtract', function() {
    it('should properly subtract the second set to the first.', function() {
      var setA = new Set([1, 2]);

      functions.subtract(setA, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(setA), [1]);

      functions.subtract(setA, new Set());

      assert.deepStrictEqual(Array.from(setA), [1]);
    });

    it('should properly subtract sets from an empty set.', function() {
      var empty = new Set([]);

      functions.subtract(empty, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(empty), []);

      functions.subtract(empty, new Set());

      assert.deepStrictEqual(Array.from(empty), []);
    });
  });

  describe('#.intersect', function() {
    var equiv    = new Set([1, 2, 3]);
    var missing1 = new Set([2, 3]);
    var disjoint = new Set([7, 8, 9]);
    var empty    = new Set([])

    it('should properly intersect overlapping sets.', function() {
      var exemplar = new Set([1, 2, 3]);
      functions.intersect(exemplar, missing1)

      assert.deepStrictEqual(Array.from(exemplar), [2, 3]);
      assert.deepStrictEqual(Array.from(missing1), [2, 3]);
    });

    it('should properly intersect equivalent sets.', function() {
      var exemplar = new Set([1, 2, 3]);
      functions.intersect(exemplar, exemplar)

      assert.deepStrictEqual(Array.from(exemplar), [1, 2, 3]);

      functions.intersect(exemplar, equiv)

      assert.deepStrictEqual(Array.from(exemplar), [1, 2, 3]);
      assert.deepStrictEqual(Array.from(equiv), [1, 2, 3]);
    });

    it('should properly intersect disjoint sets.', function() {
      var exemplar = new Set([1, 2, 3]);

      functions.intersect(exemplar, disjoint);

      assert.deepStrictEqual(Array.from(exemplar), []);
      assert.deepStrictEqual(Array.from(disjoint), [7, 8, 9]);

      exemplar = new Set([1, 2, 3]);

      functions.intersect(exemplar, empty);

      assert.deepStrictEqual(Array.from(exemplar), []);
      assert.deepStrictEqual(Array.from(empty), []);
    });
  });

  describe('#.disjunct', function() {
    it('should properly disjunct the second set to the first.', function() {
      var setA = new Set([1, 2]);

      functions.disjunct(setA, new Set([2, 3]));

      assert.deepStrictEqual(Array.from(setA), [1, 3]);
    });
  });

  describe('#.intersectionSize', function() {
    it('should properly return the size of the intersection.', function() {
      var setA = new Set([1, 2, 3]),
          setB = new Set([2, 3, 4]);

      var emptySet = new Set([]);

      assert.strictEqual(functions.intersectionSize(setA, setB), 2);
      assert.strictEqual(functions.intersectionSize(setA, emptySet), 0);
    });
  });

  describe('#.unionSize', function() {
    it('should properly return the size of the union.', function() {
      var setA = new Set([1, 2, 3]),
          setB = new Set([2, 3, 4]);

      var emptySet = new Set([]);

      assert.strictEqual(functions.unionSize(setA, setB), 4);
      assert.strictEqual(functions.unionSize(setA, emptySet), 3);
    });
  });

  describe('#.jaccard', function() {
    it('should properly return the Jaccard similarity between two sets.', function() {
      var setA = new Set([1, 2, 3]),
          setB = new Set([2, 3, 4]);

      var emptySet = new Set([]);

      assert.strictEqual(functions.jaccard(setA, setB), 2 / 4);
      assert.strictEqual(functions.jaccard(setA, emptySet), 0);

      assert.strictEqual(functions.jaccard(new Set('contact'), new Set('context')), 4 / 7);
    });
  });

  describe('#.overlap', function() {
    it('should properly return the overlap coefficient between two sets.', function() {
      var setA = new Set([1, 2, 3]),
          setB = new Set([2, 3, 4]);

      var emptySet = new Set([]);

      assert.strictEqual(functions.overlap(setA, setB), 2 / 3);
      assert.strictEqual(functions.overlap(setA, emptySet), 0);

      assert.strictEqual(functions.overlap(new Set('contact'), new Set('context')), 4 / 5);
    });
  });
});
