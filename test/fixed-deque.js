/* eslint no-new: 0 */
/**
 * Mnemonist FixedDeque Unit Tests
 * ================================
 */
var assert = require('assert'),
    FixedDeque = require('../fixed-deque.js');

describe('FixedDeque', function() {

  it('providing wrong arguments should throw.', function() {
    assert.throws(function() {
      new FixedDeque();
    }, /Array class/);

    assert.throws(function() {
      new FixedDeque(Array);
    }, /Array class/);

    assert.throws(function() {
      new FixedDeque(Array, null);
    }, /number/);

    assert.throws(function() {
      new FixedDeque(Array, -20);
    }, /number/);
  });

  it('should be possible to push values.', function() {
    var deque = new FixedDeque(Array, 10);

    deque.push('test');

    assert.strictEqual(deque.size, 1);
    assert.strictEqual(deque.capacity, 10);
  });

  it('exceeding capacity should throw.', function() {
    var deque = new FixedDeque(Array, 1);

    deque.push('test');

    assert.throws(function() {
      deque.push('test');
    }, /exceed/);

    assert.throws(function() {
      deque.unshift('test');
    }, /exceed/);
  });

  it('should be possible to clear the deque.', function() {
    var deque = new FixedDeque(Array, 2);

    deque.push(2);
    deque.push(3);

    deque.clear();

    assert.strictEqual(deque.size, 0);
    assert.deepStrictEqual(deque.toArray(), []);
  });

  it('should be possible to peek.', function() {
    var deque = new FixedDeque(Array, 3);

    assert.strictEqual(deque.peekFirst(), undefined);
    assert.strictEqual(deque.peekLast(), undefined);

    deque.push(1);

    assert.strictEqual(deque.peekFirst(), 1);
    assert.strictEqual(deque.peekLast(), 1);

    deque.push(2);
    deque.push(3);

    assert.strictEqual(deque.peekFirst(), 1);
    assert.strictEqual(deque.peekLast(), 3);

    assert.strictEqual(deque.get(0), 1);
    assert.strictEqual(deque.get(1), 2);
    assert.strictEqual(deque.get(2), 3);
    assert.strictEqual(deque.get(3), undefined);
  });

  it('should be possible to pop the deque.', function() {
    var deque = new FixedDeque(Array, 3);

    deque.push(1);
    deque.push(2);
    deque.push(3);

    assert.strictEqual(deque.pop(), 3);
    assert.strictEqual(deque.pop(), 2);
    assert.strictEqual(deque.pop(), 1);
    assert.strictEqual(deque.pop(), undefined);
    assert.strictEqual(deque.size, 0);

    deque.push(4);

    assert.strictEqual(deque.size, 1);
    assert.strictEqual(deque.peekLast(), 4);

    var deque2 = new FixedDeque(Array, 6);

    deque2.push(1);
    deque2.push(2);
    deque2.push(3);
    deque2.unshift(4);
    deque2.unshift(5);
    deque2.unshift(6);

    assert.strictEqual(deque2.pop(), 3);
    assert.strictEqual(deque2.size, 5);
  });

  it('should be possible to shift the deque.', function() {
    var deque = new FixedDeque(Uint8Array, 3);

    deque.push(1);
    deque.push(2);
    deque.push(3);

    assert.strictEqual(deque.shift(), 1);
    assert.strictEqual(deque.shift(), 2);
    assert.strictEqual(deque.shift(), 3);

    assert.strictEqual(deque.size, 0);

    deque.push(4);
    deque.push(5);

    assert.strictEqual(deque.size, 2);
    assert.strictEqual(deque.pop(), 5);
    assert.strictEqual(deque.shift(), 4);
  });

  it('should be possible to unshift the deque.', function() {
    var deque = new FixedDeque(Uint8Array, 6);

    deque.push(10);
    deque.push(11);
    deque.push(12);

    assert.strictEqual(deque.unshift(13), 4);
    assert.strictEqual(deque.unshift(14), 5);
    assert.strictEqual(deque.unshift(15), 6);

    assert.strictEqual(deque.size, 6);
    assert.strictEqual(deque.start, 3);

    assert.strictEqual(deque.pop(), 12);
    assert.strictEqual(deque.shift(), 15);
  });

  it('should be consistent over time.', function() {
    var deque = new FixedDeque(Uint8Array, 3);

    deque.push(1);
    deque.push(2);
    deque.pop();

    assert.deepStrictEqual(deque.toArray(), new Uint8Array([1]));

    deque.push(3);
    deque.push(4);

    assert.deepStrictEqual(deque.toArray(), new Uint8Array([1, 3, 4]));

    deque.shift();
    deque.shift();

    assert.deepStrictEqual(deque.toArray(), new Uint8Array([4]));
    deque.pop();
    assert.deepStrictEqual(deque.toArray(), new Uint8Array([]));

    deque.push(5);
    deque.push(6);

    assert.deepStrictEqual(deque.toArray(), new Uint8Array([5, 6]));

    deque.shift();

    assert.deepStrictEqual(deque.toArray(), new Uint8Array([6]));
  });

  it('should be possible to iterate over the deque.', function() {
    var deque = new FixedDeque(Array, 3);

    deque.push(1);
    deque.push(2);
    deque.push(3);

    var times = 0;

    deque.forEach(function(item, i, l) {
      assert.strictEqual(item, i + 1);
      assert.strictEqual(deque, l);
      times++;
    });

    assert.strictEqual(times, 3);
  });

  it('should be possible to convert the deque to an array.', function() {
    var deque = new FixedDeque(Uint8Array, 3);

    deque.push(1);
    deque.push(2);
    deque.push(3);

    assert.deepStrictEqual(deque.toArray(), new Uint8Array([1, 2, 3]));

    assert(deque.toArray() instanceof Uint8Array);
  });

  it('should be possible to create a deque from an arbitrary iterable.', function() {
    var deque = FixedDeque.from([1, 2, 3], Array);

    assert.deepStrictEqual(deque.toArray(), [1, 2, 3]);
  });

  it('should be possible to create a values iterator.', function() {
    var deque = FixedDeque.from([1, 2, 3], Uint8Array, 45);

    var iterator = deque.values();

    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var deque = FixedDeque.from([1, 2, 3], Float64Array, 5);

    assert.strictEqual(deque.size, 3);
    assert.strictEqual(deque.capacity, 5);

    var iterator = deque.entries();

    assert.deepStrictEqual(iterator.next().value, [0, 1]);
    assert.deepStrictEqual(iterator.next().value, [1, 2]);
    assert.deepStrictEqual(iterator.next().value, [2, 3]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the deque.', function() {
    var array = Int8Array.from([1, 2, 3]);

    var deque = FixedDeque.from(array, Array),
        i = 1;

    for (var item of deque)
      assert.strictEqual(item, i++);
  });

  it('should handle tricky situations.', function() {
    var deque = new FixedDeque(Uint8Array, 6);

    deque.push(1);
    deque.push(2);
    deque.push(3);

    assert.strictEqual(deque.unshift(4), 4);
    assert.strictEqual(deque.unshift(5), 5);

    assert.strictEqual(deque.peekFirst(), 5);
    assert.strictEqual(deque.peekLast(), 3);
    assert.strictEqual(deque.get(1), 4);

    assert.strictEqual(deque.size, 5);
    assert.strictEqual(deque.start, 4);

    assert.strictEqual(deque.pop(), 3);
    assert.strictEqual(deque.shift(), 5);
    assert.strictEqual(deque.unshift(5), 4);
    assert.strictEqual(deque.peekFirst(), 5);
  });
});
