/**
 * Mnemonist MultiArray Unit Tests
 * ================================
 */
var assert = require('assert'),
    MultiArray = require('../multi-array.js');

describe('MultiArray', function() {

  it('should be possible to add items to a multi array.', function() {
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

  it('should be possible to push containers to a multi array.', function() {
    var array = new MultiArray();

    array.push(1);
    array.push(2);
    array.push(3);

    assert.strictEqual(array.size, 3);
    assert.strictEqual(array.dimension, 3);
    assert.deepEqual(array.get(0), [1]);
    assert.deepEqual(array.get(1), [2]);
    assert.deepEqual(array.get(2), [3]);

    array.set(0, 4);
    array.set(1, 5);
    array.set(2, 6);

    assert.strictEqual(array.size, 6);
    assert.strictEqual(array.dimension, 3);
    assert.deepEqual(array.get(0), [1, 4]);
    assert.deepEqual(array.get(1), [2, 5]);
    assert.deepEqual(array.get(2), [3, 6]);

    array = new MultiArray(Uint8Array, 6);

    array.push(1);
    array.push(2);
    array.push(3);

    assert.strictEqual(array.size, 3);
    assert.strictEqual(array.dimension, 3);
    assert.deepEqual(array.get(0), [1]);
    assert.deepEqual(array.get(1), [2]);
    assert.deepEqual(array.get(2), [3]);

    array.set(0, 4);
    array.set(1, 5);
    array.set(2, 6);

    assert.strictEqual(array.size, 6);
    assert.strictEqual(array.dimension, 3);
    assert.deepEqual(array.get(0), [1, 4]);
    assert.deepEqual(array.get(1), [2, 5]);
    assert.deepEqual(array.get(2), [3, 6]);

    assert.throws(function() {
      array.push(45);
    }, /capacity/);
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

  it('should be possible to test the existence of a container.', function() {
    var array = new MultiArray();

    array.set(0, 4);
    array.set(0, 5);

    assert.strictEqual(array.has(0), true);
    assert.strictEqual(array.has(3), false);
    assert.strictEqual(array.has(1), false);
  });

  it('should be possible to count subarrays.', function() {
    var array = new MultiArray();

    array.set(0, 4);
    array.set(0, 5);

    assert.strictEqual(array.count(0), 2);
    assert.strictEqual(array.count(3), 0);
    assert.strictEqual(array.count(1), 0);
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

  it('should be possible to insert in random order.', function() {
    var array = new MultiArray();

    array.set(34, 3);
    array.set(2, 4);
    array.set(2, 5);

    assert.strictEqual(array.size, 3);
    assert.strictEqual(array.dimension, 35);
    assert.deepEqual(array.get(2), [4, 5]);
    assert.deepEqual(array.get(34), [3]);

    array = new MultiArray(Uint8Array, 40);

    array.set(34, 3);
    array.set(2, 4);
    array.set(2, 5);

    assert.strictEqual(array.size, 3);
    assert.strictEqual(array.dimension, 35);
    assert.deepEqual(Array.from(array.get(2)), [4, 5]);
    assert.deepEqual(Array.from(array.get(34)), [3]);
  });
});
