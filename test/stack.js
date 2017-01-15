/**
 * Mnemonist Stack Unit Tests
 * ===========================
 */
var assert = require('assert'),
    Stack = require('../stack.js');

describe('Stack', function() {

  it('should be possible to push values.', function() {
    var stack = new Stack();

    stack.push('test');

    assert.strictEqual(stack.size, 1);
  });

  it('should be possible to clear the stack.', function() {
    var stack = new Stack();

    stack.push(2);
    stack.push(3);

    stack.clear();

    assert.strictEqual(stack.size, 0);
    assert.deepEqual(stack.toArray(), []);
  });

  it('should be possible to peek.', function() {
    var stack = new Stack();

    assert.strictEqual(stack.peek(), undefined);

    stack.push(1);

    assert.strictEqual(stack.peek(), 1);

    stack.push(2);

    assert.strictEqual(stack.peek(), 2);
  });

  it('should be possible to pop the stack.', function() {
    var stack = new Stack();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    assert.strictEqual(stack.pop(), 3);
    assert.strictEqual(stack.pop(), 2);
    assert.strictEqual(stack.pop(), 1);
    assert.strictEqual(stack.pop(), undefined);
  });

  it('should be possible to iterate over the stack.', function() {
    var stack = new Stack();

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
    var stack = new Stack();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    assert.deepEqual(stack.toArray(), [3, 2, 1]);
  });

  it('should be possible to create a stack from an arbitrary iterable.', function() {
    var stack = Stack.from([1, 2, 3]);

    assert.deepEqual(stack.toArray(), [3, 2, 1]);
  });

  it('should be possible to create a values iterator.', function() {
    var stack = Stack.from([1, 2, 3]);

    var iterator = stack.values();

    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var stack = Stack.from([1, 2, 3]);

    var iterator = stack.entries();

    assert.deepEqual(iterator.next().value, [3, 0]);
    assert.deepEqual(iterator.next().value, [2, 1]);
    assert.deepEqual(iterator.next().value, [1, 2]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the stack.', function() {
    var stack = Stack.from([1, 2, 3]),
        i = 4;

    for (var item of stack)
      assert.strictEqual(item, --i);
  });
});
