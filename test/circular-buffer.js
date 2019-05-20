/* eslint no-new: 0 */
/**
 * Mnemonist CircularBuffer Unit Tests
 * ====================================
 */
var assert = require('assert'),
    CircularBuffer = require('../circular-buffer.js');

describe('CircularBuffer', function() {

  it('providing wrong arguments should throw.', function() {
    assert.throws(function() {
      new CircularBuffer();
    }, /Array class/);

    assert.throws(function() {
      new CircularBuffer(Array);
    }, /Array class/);

    assert.throws(function() {
      new CircularBuffer(Array, null);
    }, /number/);

    assert.throws(function() {
      new CircularBuffer(Array, -20);
    }, /number/);
  });

  it('should be possible to push values.', function() {
    var buffer = new CircularBuffer(Array, 10);

    buffer.push('test');

    assert.strictEqual(buffer.size, 1);
    assert.strictEqual(buffer.capacity, 10);
  });

  it('should be possible to wrap buffer around when pushing.', function() {
    var buffer = new CircularBuffer(Array, 3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    buffer.push(4);

    assert.deepEqual(buffer.toArray(), [2, 3, 4]);
    assert.strictEqual(buffer.size, 3);

    buffer.push(5);

    assert.deepEqual(buffer.toArray(), [3, 4, 5]);
    assert.strictEqual(buffer.size, 3);

    buffer.push(6);

    assert.deepEqual(buffer.toArray(), [4, 5, 6]);
    assert.strictEqual(buffer.size, 3);

    buffer.push(7);
    buffer.push(8);

    assert.deepEqual(buffer.toArray(), [6, 7, 8]);
    assert.strictEqual(buffer.size, 3);
  });

  it('should be possible to wrap buffer around when unshifting.', function() {
    var buffer = new CircularBuffer(Array, 3);

    buffer.unshift(1);
    buffer.unshift(2);
    buffer.unshift(3);
    buffer.unshift(4);

    assert.deepEqual(buffer.toArray(), [4, 3, 2]);
    assert.strictEqual(buffer.size, 3);

    buffer.unshift(5);

    assert.deepEqual(buffer.toArray(), [5, 4, 3]);
    assert.strictEqual(buffer.size, 3);

    buffer.unshift(6);

    assert.deepEqual(buffer.toArray(), [6, 5, 4]);
    assert.strictEqual(buffer.size, 3);

    buffer.unshift(7);
    buffer.unshift(8);

    assert.deepEqual(buffer.toArray(), [8, 7, 6]);
    assert.strictEqual(buffer.size, 3);
  });

  it('should be possible to clear the buffer.', function() {
    var buffer = new CircularBuffer(Array, 2);

    buffer.push(2);
    buffer.push(3);

    buffer.clear();

    assert.strictEqual(buffer.size, 0);
    assert.deepEqual(buffer.toArray(), []);
  });

  it('should be possible to peek.', function() {
    var buffer = new CircularBuffer(Array, 3);

    assert.strictEqual(buffer.peekFirst(), undefined);
    assert.strictEqual(buffer.peekLast(), undefined);

    buffer.push(1);

    assert.strictEqual(buffer.peekFirst(), 1);
    assert.strictEqual(buffer.peekLast(), 1);

    buffer.push(2);
    buffer.push(3);

    assert.strictEqual(buffer.peekFirst(), 1);
    assert.strictEqual(buffer.peekLast(), 3);

    assert.strictEqual(buffer.get(0), 1);
    assert.strictEqual(buffer.get(1), 2);
    assert.strictEqual(buffer.get(2), 3);
    assert.strictEqual(buffer.get(3), undefined);
  });

  it('should be possible to pop the buffer.', function() {
    var buffer = new CircularBuffer(Array, 3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);

    assert.strictEqual(buffer.pop(), 3);
    assert.strictEqual(buffer.pop(), 2);
    assert.strictEqual(buffer.pop(), 1);
    assert.strictEqual(buffer.pop(), undefined);
    assert.strictEqual(buffer.size, 0);

    buffer.push(4);

    assert.strictEqual(buffer.size, 1);
    assert.strictEqual(buffer.peekLast(), 4);

    var buffer2 = new CircularBuffer(Array, 6);

    buffer2.push(1);
    buffer2.push(2);
    buffer2.push(3);
    buffer2.unshift(4);
    buffer2.unshift(5);
    buffer2.unshift(6);

    assert.strictEqual(buffer2.pop(), 3);
    assert.strictEqual(buffer2.size, 5);
  });

  it('should be possible to shift the buffer.', function() {
    var buffer = new CircularBuffer(Uint8Array, 3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);

    assert.strictEqual(buffer.shift(), 1);
    assert.strictEqual(buffer.shift(), 2);
    assert.strictEqual(buffer.shift(), 3);

    assert.strictEqual(buffer.size, 0);

    buffer.push(4);
    buffer.push(5);

    assert.strictEqual(buffer.size, 2);
    assert.strictEqual(buffer.pop(), 5);
    assert.strictEqual(buffer.shift(), 4);
  });

  it('should be possible to unshift the buffer.', function() {
    var buffer = new CircularBuffer(Uint8Array, 6);

    buffer.push(10);
    buffer.push(11);
    buffer.push(12);

    assert.strictEqual(buffer.unshift(13), 4);
    assert.strictEqual(buffer.unshift(14), 5);
    assert.strictEqual(buffer.unshift(15), 6);

    assert.strictEqual(buffer.size, 6);
    assert.strictEqual(buffer.start, 3);

    assert.strictEqual(buffer.pop(), 12);
    assert.strictEqual(buffer.shift(), 15);
  });

  it('should be consistent over time.', function() {
    var buffer = new CircularBuffer(Uint8Array, 3);

    buffer.push(1);
    buffer.push(2);
    buffer.pop();

    assert.deepEqual(buffer.toArray(), new Uint8Array([1]));

    buffer.push(3);
    buffer.push(4);

    assert.deepEqual(buffer.toArray(), new Uint8Array([1, 3, 4]));

    buffer.shift();
    buffer.shift();

    assert.deepEqual(buffer.toArray(), new Uint8Array([4]));
    buffer.pop();
    assert.deepEqual(buffer.toArray(), new Uint8Array([]));

    buffer.push(5);
    buffer.push(6);

    assert.deepEqual(buffer.toArray(), new Uint8Array([5, 6]));

    buffer.shift();

    assert.deepEqual(buffer.toArray(), new Uint8Array([6]));
  });

  it('should be possible to iterate over the buffer.', function() {
    var buffer = new CircularBuffer(Array, 3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);

    var times = 0;

    buffer.forEach(function(item, i, l) {
      assert.strictEqual(item, i + 1);
      assert.strictEqual(buffer, l);
      times++;
    });

    assert.strictEqual(times, 3);
  });

  it('should be possible to convert the buffer to an array.', function() {
    var buffer = new CircularBuffer(Uint8Array, 3);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);

    assert.deepEqual(buffer.toArray(), new Uint8Array([1, 2, 3]));

    assert(buffer.toArray() instanceof Uint8Array);
  });

  it('should be possible to create a buffer from an arbitrary iterable.', function() {
    var buffer = CircularBuffer.from([1, 2, 3], Array);

    assert.deepEqual(buffer.toArray(), [1, 2, 3]);
  });

  it('should be possible to create a values iterator.', function() {
    var buffer = CircularBuffer.from([1, 2, 3], Uint8Array, 45);

    var iterator = buffer.values();

    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var buffer = CircularBuffer.from([1, 2, 3], Float64Array, 5);

    assert.strictEqual(buffer.size, 3);
    assert.strictEqual(buffer.capacity, 5);

    var iterator = buffer.entries();

    assert.deepEqual(iterator.next().value, [0, 1]);
    assert.deepEqual(iterator.next().value, [1, 2]);
    assert.deepEqual(iterator.next().value, [2, 3]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the buffer.', function() {
    var array = Int8Array.from([1, 2, 3]);

    var buffer = CircularBuffer.from(array, Array),
        i = 1;

    for (var item of buffer)
      assert.strictEqual(item, i++);
  });

  it('should handle tricky situations.', function() {
    var buffer = new CircularBuffer(Uint8Array, 6);

    buffer.push(1);
    buffer.push(2);
    buffer.push(3);

    assert.strictEqual(buffer.unshift(4), 4);
    assert.strictEqual(buffer.unshift(5), 5);

    assert.strictEqual(buffer.peekFirst(), 5);
    assert.strictEqual(buffer.peekLast(), 3);
    assert.strictEqual(buffer.get(1), 4);

    assert.strictEqual(buffer.size, 5);
    assert.strictEqual(buffer.start, 4);

    assert.strictEqual(buffer.pop(), 3);
    assert.strictEqual(buffer.shift(), 5);
    assert.strictEqual(buffer.unshift(5), 4);
    assert.strictEqual(buffer.peekFirst(), 5);
  });
});
