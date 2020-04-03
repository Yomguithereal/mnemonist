/**
 * Mnemonist SparseQueueSet Unit Tests
 * ====================================
 */
var assert = require('assert'),
    SparseQueueSet = require('../sparse-queue-set.js'),
    obliterator = require('obliterator');

describe('SparseQueueSet', function() {

  it('should be possible to enqueue items to the queue.', function() {
    var queue = new SparseQueueSet(10);

    queue.enqueue(3);
    queue.enqueue(4);
    queue.enqueue(3);

    assert.strictEqual(queue.size, 2);
    assert.strictEqual(queue.length, 10);
  });

  it('should be possible to test the existence of items in the queue.', function() {
    var queue = new SparseQueueSet(10);

    queue.enqueue(3);
    assert.strictEqual(queue.has(3), true);
    assert.strictEqual(queue.has(1), false);
  });

  it('should be possible to delete items from the queue.', function() {
    var queue = new SparseQueueSet(10);

    queue.enqueue(3);
    queue.delete(3);
    queue.delete(4);

    assert.strictEqual(queue.size, 0);
  });

  it('should be possible to clear the queue.', function() {
    var queue = new SparseQueueSet(10);

    for (var i = 0; i < 6; i++)
      queue.enqueue(i);

    queue.clear();

    assert.strictEqual(queue.size, 0);
    assert.strictEqual(queue.has(1), false);
  });

  it('should be possible to iterate over the queue\'s items.', function() {
    var queue = new SparseQueueSet(10);

    queue.enqueue(3);
    queue.enqueue(6);
    queue.enqueue(9);

    var array = [3, 6, 9],
        i = 0;

    queue.forEach(function(number) {
      assert.strictEqual(number, array[i++]);
    });
  });

  it('should be possible to create an iterator over the queue\'s values.', function() {
    var queue = new SparseQueueSet(10);

    queue.enqueue(3);
    queue.enqueue(6);
    queue.enqueue(9);

    assert.deepEqual(obliterator.take(queue.values()), [3, 6, 9]);
  });
});
