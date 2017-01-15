/**
 * Mnemonist Queue Unit Tests
 * ===========================
 */
var assert = require('assert'),
    Queue = require('../queue.js');

describe('Queue', function() {

  it('should be possible to enqueue values.', function() {
    var queue = new Queue();

    queue.enqueue('test');

    assert.strictEqual(queue.size, 1);
  });

  it('should be possible to clear the queue.', function() {
    var queue = new Queue();

    queue.enqueue(2);
    queue.enqueue(3);

    queue.clear();

    assert.strictEqual(queue.size, 0);
    assert.deepEqual(queue.toArray(), []);
  });

  it('should be possible to peek.', function() {
    var queue = new Queue();

    assert.strictEqual(queue.peek(), undefined);

    queue.enqueue(1);

    assert.strictEqual(queue.peek(), 1);

    queue.enqueue(2);

    assert.strictEqual(queue.peek(), 1);
  });

  it('should be possible to dequeue.', function() {
    var queue = new Queue();

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    assert.strictEqual(queue.dequeue(), 1);
    assert.strictEqual(queue.dequeue(), 2);
    assert.strictEqual(queue.dequeue(), 3);
    assert.strictEqual(queue.dequeue(), undefined);
  });

  it('should be possible to iterate over the queue.', function() {
    var queue = new Queue();

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    var times = 0;

    queue.forEach(function(item, i, l) {
      assert.strictEqual(item, i + 1);
      assert.strictEqual(queue, l);
      times++;
    });

    assert.strictEqual(times, 3);
  });

  it('should be possible to convert the queue to an array.', function() {
    var queue = new Queue();

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    assert.deepEqual(queue.toArray(), [1, 2, 3]);
  });

  it('should be possible to create a queue from an arbitrary iterable.', function() {
    var queue = Queue.from([1, 2, 3]);

    assert.deepEqual(queue.toArray(), [1, 2, 3]);
  });

  it('should be possible to create a values iterator.', function() {
    var queue = Queue.from([1, 2, 3]);

    var iterator = queue.values();

    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var queue = Queue.from([1, 2, 3]);

    var iterator = queue.entries();

    assert.deepEqual(iterator.next().value, [1, 0]);
    assert.deepEqual(iterator.next().value, [2, 1]);
    assert.deepEqual(iterator.next().value, [3, 2]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the queue.', function() {
    var queue = Queue.from([1, 2, 3]),
        i = 0;

    for (var item of queue)
      assert.strictEqual(item, ++i);
  });
});
