/* eslint no-new: 0 */
/**
 * Mnemonist FixedStack Unit Tests
 * ================================
 */
var assert = require('assert'),
    FixedStack = require('../fixed-stack.js');

describe('FixedStack', function() {

  it('providing wrong arguments should throw.', function() {
    assert.throws(function() {
      new FixedStack();
    }, /Array class/);

    assert.throws(function() {
      new FixedStack(Array);
    }, /Array class/);

    assert.throws(function() {
      new FixedStack(Array, null);
    }, /number/);

    assert.throws(function() {
      new FixedStack(Array, -20);
    }, /number/);
  });

  it('should be possible to push values.', function() {
    var stack = new FixedStack(Array, 10);

    stack.push('test');

    assert.strictEqual(stack.size, 1);
    assert.strictEqual(stack.capacity, 10);
  });

  it('exceeding capacity should throw.', function() {
    var stack = new FixedStack(Array, 1);

    stack.push('test');

    assert.throws(function() {
      stack.push('test');
    }, /exceed/);
  });

  it('should be possible to clear the stack.', function() {
    var stack = new FixedStack(Array, 2);

    stack.push(2);
    stack.push(3);

    stack.clear();

    assert.strictEqual(stack.size, 0);
    assert.deepEqual(stack.toArray(), []);
  });

  it('should be possible to peek.', function() {
    var stack = new FixedStack(Array, 2);

    assert.strictEqual(stack.peek(), undefined);

    stack.push(1);

    assert.strictEqual(stack.peek(), 1);

    stack.push(2);

    assert.strictEqual(stack.peek(), 2);
  });

  it('should be possible to pop the stack.', function() {
    var stack = new FixedStack(Array, 3);

    stack.push(1);
    stack.push(2);
    stack.push(3);

    assert.strictEqual(stack.pop(), 3);
    assert.strictEqual(stack.pop(), 2);
    assert.strictEqual(stack.pop(), 1);
    assert.strictEqual(stack.pop(), undefined);
  });

  it('should be possible to iterate over the stack.', function() {
    var stack = new FixedStack(Array, 3);

    stack.push(1);
    stack.push(2);
    stack.push(3);

    var times = 0;

    stack.forEach(function(item, i, l) {
      assert.strictEqual(item, 3 - i);
      assert.strictEqual(stack, l);
      times++;
    });

    assert.strictEqual(times, 3);
  });

  it('should be possible to convert the stack to an array.', function() {
    var stack = new FixedStack(Uint8Array, 3);

    stack.push(1);
    stack.push(2);
    stack.push(3);

    assert.deepEqual(stack.toArray(), [3, 2, 1]);

    assert(stack.toArray() instanceof Uint8Array);
  });

  it('should be possible to create a stack from an arbitrary iterable.', function() {
    var stack = FixedStack.from([1, 2, 3], Array);

    assert.deepEqual(stack.toArray(), [3, 2, 1]);
  });

  it('should be possible to create a values iterator.', function() {
    var stack = FixedStack.from([1, 2, 3], Uint8Array, 45);

    var iterator = stack.values();

    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var stack = FixedStack.from([1, 2, 3], Float64Array, 5);

    assert.strictEqual(stack.size, 3);
    assert.strictEqual(stack.capacity, 5);

    var iterator = stack.entries();

    assert.deepEqual(iterator.next().value, [0, 3]);
    assert.deepEqual(iterator.next().value, [1, 2]);
    assert.deepEqual(iterator.next().value, [2, 1]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the stack.', function() {
    var array = Int8Array.from([1, 2, 3]);

    var stack = FixedStack.from(array, Array),
        i = 4;

    for (var item of stack)
      assert.strictEqual(item, --i);
  });
});
