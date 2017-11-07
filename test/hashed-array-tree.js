/* eslint no-new: 0 */
/**
 * Mnemonist HashedArrayTree Unit Tests
 * =====================================
 */
var assert = require('assert'),
    HashedArrayTree = require('../hashed-array-tree.js');

describe('HashedArrayTree', function() {

  it('should throw if given too few arguments.', function() {
    assert.throws(function() {
      new HashedArrayTree();
    }, /hashed-array/);
  });

  it('should throw if given a block size that is not a power of two.', function() {
    assert.throws(function() {
      new HashedArrayTree(Uint8Array, {blockSize: 27});
    }, /power of two/);
  });

  it('should be possible to create a dynamic array.', function() {
    var array = new HashedArrayTree(Uint8Array, 5);

    assert.strictEqual(array.length, 0);
    assert.strictEqual(array.capacity, 1024);
  });

  it('should be possible to set and get values.', function() {
    var array = new HashedArrayTree(Uint8Array, {initialLength: 3});

    array.set(2, 24);

    assert.strictEqual(array.length, 3);

    assert.strictEqual(array.get(2), 24);
  });

  it('should return undefined on out-of-bound values.', function() {
    var array = new HashedArrayTree(Uint8Array, 5);

    assert.strictEqual(array.get(2), undefined);
  });

  it('setting an out-of-bound index should throw.', function() {
    var array = new HashedArrayTree(Uint8Array, 4);

    assert.throws(function() {
      array.set(56, 4);
    }, /bounds/);
  });

  it('should be possible to push values.', function() {
    var array = new HashedArrayTree(Uint8Array, {blockSize: 128});

    for (var i = 0; i < 250; i++)
      array.push(i);

    assert.strictEqual(array.length, 250);
    assert.strictEqual(array.capacity, 256);
    assert.strictEqual(array.get(34), 34);
  });

  it('should be possible to pop values.', function() {
    var array = new HashedArrayTree(Uint32Array);

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

  it('should be possible to grow the array.', function() {
    var array = new HashedArrayTree(Uint8Array, {blockSize: 2});

    array.grow(5);

    assert.strictEqual(array.capacity, 6);

    array.grow(2);

    assert.strictEqual(array.capacity, 6);

    array.grow();

    assert.strictEqual(array.capacity, 8);
  });

  it('should be possible to resize the array.', function() {
    var array = new HashedArrayTree(Uint8Array, {initialLength: 23, blockSize: 8});

    array.resize(20);

    assert.strictEqual(array.capacity, 24);
    assert.strictEqual(array.length, 20);

    array.resize(30);

    assert.strictEqual(array.capacity, 32);
    assert.strictEqual(array.length, 30);
  });
});
