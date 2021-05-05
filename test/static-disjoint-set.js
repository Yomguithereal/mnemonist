/**
 * Mnemonist SparseSet Unit Tests
 * ===============================
 */
var assert = require('assert'),
    StaticDisjointSet = require('../static-disjoint-set.js');

describe('StaticDisjointSet', function() {

  it('should be possible to have a set working.', function() {
    var sets = new StaticDisjointSet(10);

    sets.union(0, 1);
    sets.union(1, 5);
    sets.union(0, 7);

    sets.union(8, 9);

    sets.union(2, 3);
    sets.union(2, 4);

    assert.strictEqual(sets.size, 10);
    assert.strictEqual(sets.dimension, 4);
    assert.strictEqual(sets.connected(1, 7), true);
    assert.strictEqual(sets.connected(6, 0), false);

    var mapping = sets.mapping();

    assert.deepStrictEqual(Array.from(mapping), [0, 0, 1, 1, 1, 0, 2, 0, 3, 3]);

    var compiled = sets.compile();
    assert.deepStrictEqual(Array.from(compiled, a => Array.from(a)), [[0, 1, 5, 7], [2, 3, 4], [6], [8, 9]]);
  });
});
