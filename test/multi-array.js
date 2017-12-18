/**
 * Mnemonist MultiArray Unit Tests
 * ================================
 */
var assert = require('assert'),
    MultiArray = require('../multi-array.js');

describe('MultiArray', function() {

  it('should be possible to add items ot a multi array.', function() {
    var array = new MultiArray();

    array.set(0, 1);
    array.set(0, 2);
    array.set(0, 3);
    array.set(1, 4);
    array.set(1, 5);
    array.set(2, 6);

    assert.strictEqual(array.size, 6);
    assert.strictEqual(array.dimension, 3);
  });

  it('should be possible to get subarrays.', function() {
    var array = new MultiArray();

    array.set(0, 1);
    array.set(0, 2);
    array.set(0, 3);
    array.set(1, 4);
    array.set(1, 5);
    array.set(2, 6);

    assert.deepEqual(array.get(4), undefined);
    assert.deepEqual(array.get(0), [1, 2, 3]);
    assert.deepEqual(array.get(1), [4, 5]);
    assert.deepEqual(array.get(2), [6]);

    assert.strictEqual(array.has(4), false);
    assert.strictEqual(array.has(0), true);
    assert.strictEqual(array.has(1), true);
    assert.strictEqual(array.has(2), true);
  });

  it('should be possible to use static containers.', function() {
    var array = new MultiArray(Uint8Array, 6);

    array.set(0, 1);
    array.set(0, 2);
    array.set(0, 3);
    array.set(1, 4);
    array.set(1, 5);
    array.set(2, 6);

    assert(array.get(1).constructor, Uint8Array);
  });
});
