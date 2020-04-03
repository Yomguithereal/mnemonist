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
    assert.strictEqual(queue.capacity, 10);
  });

  it('should be possible to test the existence of items in the queue.', function() {
    var queue = new SparseQueueSet(10);

    queue.enqueue(3);
    assert.strictEqual(queue.has(3), true);
    assert.strictEqual(queue.has(1), false);
  });

  it('should be possible to clear the queue.', function() {
    var queue = new SparseQueueSet(10);

    for (var i = 0; i < 6; i++)
      queue.enqueue(i);

    queue.clear();

    assert.strictEqual(queue.size, 0);
    assert.strictEqual(queue.has(1), false);
  });

  it('should be possible to dequeue items.', function() {
    var queue = new SparseQueueSet(4);

    queue.enqueue(2);
    queue.enqueue(3);
    queue.enqueue(0);
    queue.enqueue(1);

    assert.strictEqual(queue.dequeue(), 2);
    assert.strictEqual(queue.size, 3);

    assert.strictEqual(queue.dequeue(), 3);
    assert.strictEqual(queue.size, 2);

    assert.strictEqual(queue.dequeue(), 0);
    assert.strictEqual(queue.size, 1);

    assert.strictEqual(queue.dequeue(), 1);
    assert.strictEqual(queue.size, 0);
  });

  it('should not break when wrapping aroung.', function() {
    var queue = new SparseQueueSet(4);

    var values = [2, 3, 1];

    var r = 13;

    function run() {
      values.forEach(function(v, i) {
        assert.strictEqual(queue.has(v), false);
        queue.enqueue(v);
        assert.strictEqual(queue.size, i + 1);
      });

      assert.deepEqual(obliterator.take(queue.values()), values);

      var contained = [];

      queue.forEach(function(v) {
        contained.push(v);
      });

      assert.deepEqual(contained, values);

      values.forEach(function(v, i) {
        assert.strictEqual(queue.has(v), true);
        assert.strictEqual(queue.dequeue(), v);
        assert.strictEqual(queue.size, values.length - i - 1);
      });
    }

    for (var i = 0; i < r; i++)
      run();

    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    queue.enqueue(2);
    queue.enqueue(3);
    queue.enqueue(0);
    queue.enqueue(1);

    assert.deepEqual(obliterator.take(queue.values()), [0, 1, 2, 3]);
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
