/* eslint no-new: 0 */
/**
 * Mnemonist DynamicArray Unit Tests
 * ==================================
 */
var assert = require('assert'),
    DynamicArray = require('../dynamic-array.js');

describe('DynamicArray', function() {

  it('should throw if given too few arguments.', function() {
    assert.throws(function() {
      new DynamicArray();
    }, /dynamic-array/);
  });

  it('should be possible to create a dynamic array.', function() {
    var array = new DynamicArray(Uint8Array, 5);

    assert.strictEqual(array.length, 0);
    assert.strictEqual(array.allocated, 5);
  });

  it('should be possible to set and get values.', function() {
    var array = new DynamicArray(Uint8Array, 5);

    array.set(2, 24);

    assert.strictEqual(array.length, 3);

    assert.strictEqual(array.get(2), 24);
  });

  it('should be possible to push values.', function() {
    var array = new DynamicArray(Uint8Array, 5);

    for (var i = 0; i < 250; i++)
      array.push(i);

    assert.strictEqual(array.length, 250);
    assert.strictEqual(array.allocated, 315);
    assert.strictEqual(array.get(34), 34);
  });

  it('should be possible to pop values.', function() {
    var array = new DynamicArray(Uint32Array, 3);

    array.push(1);
    array.push(2);

    assert.strictEqual(array.pop(), 2);
    assert.strictEqual(array.length, 1);
    assert.strictEqual(array.pop(), 1);
    assert.strictEqual(array.length, 0);
    assert.strictEqual(array.pop(), undefined);
    assert.strictEqual(array.length, 0);

    array.push(34);
    array.push(35);

    assert.strictEqual(array.get(1), 35);
    assert.strictEqual(array.length, 2);
  });

  it('should throw if the policy returns an irrelevant size.', function() {
    var array = new DynamicArray(Uint8Array, {
      initialSize: 1,
      policy: function(allocated) {
        return allocated;
      }
    });

    array.push(3);

    assert.throws(function() {
      array.push(4);
    }, /policy/);
  });

  it('should be possible to use a custom policy.', function() {
    var array = new DynamicArray(Uint8Array, {
      initialSize: 2,
      policy: function(allocated) {
        return allocated + 2;
      }
    });

    array.push(1);
    array.push(2);
    array.push(3);

    assert.strictEqual(array.length, 3);
    assert.strictEqual(array.allocated, 4);
  });

  it('should be possible to use the subclasses.', function() {
    var array = new DynamicArray.DynamicFloat64Array(4);

    array.set(2, 24);

    assert.strictEqual(array.length, 3);

    assert.strictEqual(array.get(2), 24);
  });
});
