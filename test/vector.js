/* eslint no-new: 0 */
/**
 * Mnemonist Vector Unit Tests
 * ============================
 */
var assert = require('assert'),
    Vector = require('../vector.js');

describe('Vector', function() {

  it('should throw if given too few arguments.', function() {
    assert.throws(function() {
      new Vector();
    }, /vector/);
  });

  it('should be possible to create a dynamic vector.', function() {
    var vector = new Vector(Uint8Array, 5);

    assert.strictEqual(vector.length, 0);
    assert.strictEqual(vector.capacity, 5);
  });

  it('should be possible to set and get values.', function() {
    var vector = new Vector(Uint8Array, {initialLength: 3});

    vector.set(2, 24);

    assert.strictEqual(vector.length, 3);

    assert.strictEqual(vector.get(2), 24);
  });

  it('should return undefined on out-of-bound values.', function() {
    var vector = new Vector(Uint8Array, 5);

    assert.strictEqual(vector.get(2), undefined);
  });

  it('setting an out-of-bound index should throw.', function() {
    var vector = new Vector(Uint8Array, 4);

    assert.throws(function() {
      vector.set(56, 4);
    }, /bounds/);
  });

  it('should be possible to push values.', function() {
    var vector = new Vector(Uint8Array, 5);

    for (var i = 0; i < 250; i++)
      vector.push(i);

    assert.strictEqual(vector.length, 250);
    assert.strictEqual(vector.capacity, 315);
    assert.strictEqual(vector.get(34), 34);
  });

  it('should be possible to pop values.', function() {
    var vector = new Vector(Uint32Array, 3);

    vector.push(1);
    vector.push(2);

    assert.strictEqual(vector.pop(), 2);
    assert.strictEqual(vector.length, 1);
    assert.strictEqual(vector.pop(), 1);
    assert.strictEqual(vector.length, 0);
    assert.strictEqual(vector.pop(), undefined);
    assert.strictEqual(vector.length, 0);

    vector.push(34);
    vector.push(35);

    assert.strictEqual(vector.get(1), 35);
    assert.strictEqual(vector.length, 2);
  });

  it('should be possible to reallocate.', function() {
    var vector = new Vector(Uint8Array, 10);

    vector.push(1);
    vector.push(2);
    vector.push(3);

    vector.reallocate(20);

    assert.strictEqual(vector.capacity, 20);
    assert.strictEqual(vector.length, 3);

    vector.reallocate(2);

    assert.strictEqual(vector.capacity, 2);
    assert.strictEqual(vector.length, 2);
  });

  it('should be possible to grow the vector.', function() {
    var vector = new Vector(Uint8Array, {
      initialCapacity: 2,
      policy: function(capacity) {
        return capacity + 2;
      }
    });

    vector.grow(5);

    assert.strictEqual(vector.capacity, 6);

    vector.grow(2);

    assert.strictEqual(vector.capacity, 6);

    vector.grow();

    assert.strictEqual(vector.capacity, 8);
  });

  it('should be possible to resize the vector.', function() {
    var vector = new Vector(Uint8Array, {initialLength: 23});

    vector.resize(20);

    assert.strictEqual(vector.capacity, 23);
    assert.strictEqual(vector.length, 20);

    vector.resize(30);

    assert.strictEqual(vector.capacity, 30);
    assert.strictEqual(vector.length, 30);
  });

  it('should throw if the policy returns an irrelevant size.', function() {
    var vector = new Vector(Uint8Array, {
      initialCapacity: 1,
      policy: function(capacity) {
        return capacity;
      }
    });

    vector.push(3);

    assert.throws(function() {
      vector.push(4);
    }, /policy/);
  });

  it('should be possible to use a custom policy.', function() {
    var vector = new Vector(Uint8Array, {
      initialCapacity: 2,
      policy: function(capacity) {
        return capacity + 2;
      }
    });

    vector.push(1);
    vector.push(2);
    vector.push(3);

    assert.strictEqual(vector.length, 3);
    assert.strictEqual(vector.capacity, 4);
  });

  it('should be possible to use the subclasses.', function() {
    var vector = new Vector.Float64Vector({initialLength: 3});

    vector.set(2, 24);

    assert.strictEqual(vector.length, 3);

    assert.strictEqual(vector.get(2), 24);
  });

  it('should be possible to create a vector from an arbitrary iterable.', function() {
    var vector = Vector.from([1, 2, 3], Uint8Array);

    assert.strictEqual(vector.length, 3);
    assert.strictEqual(vector.capacity, 3);
    assert.deepEqual(Array.from(vector), [1, 2, 3]);

    vector = Vector.from([1, 2, 3], Uint8Array, 10);

    assert.strictEqual(vector.length, 3);
    assert.strictEqual(vector.capacity, 10);
    assert.deepEqual(Array.from(vector), [1, 2, 3]);

    vector = Vector.Uint8Vector.from([1, 2, 3]);

    assert.strictEqual(vector.length, 3);
    assert.strictEqual(vector.capacity, 3);
    assert.deepEqual(Array.from(vector), [1, 2, 3]);
  });

  it('should be possible to create a values iterator.', function() {
    var vector = Vector.from([1, 2, 3], Uint8Array);

    var iterator = vector.values();

    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var vector = Vector.from([1, 2, 3], Uint8Array);

    var iterator = vector.entries();

    assert.deepEqual(iterator.next().value, [0, 1]);
    assert.deepEqual(iterator.next().value, [1, 2]);
    assert.deepEqual(iterator.next().value, [2, 3]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the vector.', function() {
    var vector = Vector.from([1, 2, 3], Uint8Array),
        i = 0;

    for (var item of vector)
      assert.strictEqual(item, ++i);
  });

  it('should be possible to create a pointer vector.', function() {
    var vector = new Vector.PointerVector();

    assert(vector.array instanceof Uint8Array);

    for (var i = 0; i < 500; i++)
      vector.push(i);

    assert.strictEqual(vector.length, 500);
    assert(vector.array instanceof Uint16Array);
  });
});
