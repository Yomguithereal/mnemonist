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
});
