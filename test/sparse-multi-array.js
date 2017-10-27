/**
 * Mnemonist SparseMultiArray Unit Tests
 * ======================================
 */
var assert = require('assert'),
    SparseMultiArray = require('../sparse-multi-array.js');

describe('SparseMultiArray', function() {

  it('should be possible to add items ot a multi array.', function() {
    var array = new SparseMultiArray();

    array.set(3, 1);
    array.set(3, 2);
    array.set(3, 3);
    array.set(19, 4);
    array.set(19, 5);
    array.set(100, 6);

    assert.strictEqual(array.size, 6);
    assert.strictEqual(array.dimension, 3);
  });

  it('should be possible to get subarrays.', function() {
    var array = new SparseMultiArray();

    array.set(3, 1);
    array.set(3, 2);
    array.set(3, 3);
    array.set(19, 4);
    array.set(19, 5);
    array.set(100, 6);

    assert.deepEqual(array.get(1), undefined);
    assert.deepEqual(array.get(3), [1, 2, 3]);
    assert.deepEqual(array.get(19), [4, 5]);
    assert.deepEqual(array.get(100), [6]);
  });
});
