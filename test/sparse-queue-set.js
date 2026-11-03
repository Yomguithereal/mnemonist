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

      assert.deepStrictEqual(obliterator.take(queue.values()), values);

      var contained = [];

      queue.forEach(function(v) {
        contained.push(v);
      });

      assert.deepStrictEqual(contained, values);

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

    assert.deepStrictEqual(obliterator.take(queue.values()), [0, 1, 2, 3]);
  });

  [255, 256, 257, 65535, 65536, 65537].forEach(function(capacity) {
    it('should forget dequeued members at capacity ' + capacity + '.', function() {
      var queue = new SparseQueueSet(capacity);

      queue.enqueue(0);
      queue.enqueue(1);
      assert.strictEqual(queue.dequeue(), 0);
      assert.strictEqual(queue.has(0), false);

      queue.enqueue(0);
      queue.enqueue(1);
      assert.strictEqual(queue.size, 2);
      assert.deepStrictEqual(Array.from(queue), [1, 0]);
      assert.strictEqual(queue.dequeue(), 1);
      assert.strictEqual(queue.dequeue(), 0);
      assert.strictEqual(queue.dequeue(), undefined);
      assert.strictEqual(queue.has(0), false);
    });

    it('should preserve membership through full wraps at capacity ' + capacity + '.', function() {
      var queue = new SparseQueueSet(capacity),
          i;

      for (i = 0; i < capacity; i++)
        queue.enqueue(i);

      queue.enqueue(0);
      assert.strictEqual(queue.size, capacity);
      assert.strictEqual(queue.dequeue(), 0);
      assert.strictEqual(queue.has(0), false);
      queue.enqueue(0);
      assert.strictEqual(queue.has(0), true);
      assert.strictEqual(queue.size, capacity);

      for (i = 1; i < capacity; i++) {
        assert.strictEqual(queue.has(i), true);
        assert.strictEqual(queue.dequeue(), i);
      }

      assert.strictEqual(queue.dequeue(), 0);
      assert.strictEqual(queue.size, 0);
      queue.enqueue(capacity - 1);
      queue.clear();
      assert.strictEqual(queue.has(capacity - 1), false);
      queue.enqueue(0);
      assert.deepStrictEqual(Array.from(queue), [0]);
    });

    it('should match a FIFO Set through mixed operations at capacity ' + capacity + '.', function() {
      var queue = new SparseQueueSet(capacity),
          reference = new Set(),
          seed = 17,
          i;

      // Start close to the end so that short schedules also cross the wrap.
      for (i = 0; i < capacity - 3; i++) {
        queue.enqueue(0);
        queue.dequeue();
      }

      for (i = 0; i < 1000; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;

        var member = (seed >>> 8) % capacity;

        if (i > 0 && i % 97 === 0) {
          queue.clear();
          reference.clear();
        }
        else if (seed % 3 === 0) {
          var first = reference.values().next().value;

          assert.strictEqual(queue.dequeue(), first);
          reference.delete(first);
        }
        else {
          queue.enqueue(member);
          reference.add(member);
        }

        assert.strictEqual(queue.size, reference.size);
        assert.deepStrictEqual(Array.from(queue), Array.from(reference));
        assert.strictEqual(queue.has(member), reference.has(member));
        assert.strictEqual(queue.has(0), reference.has(0));
        assert.strictEqual(queue.has(capacity - 1), reference.has(capacity - 1));
        assert.strictEqual(queue.has(-1), false);
        assert.strictEqual(queue.has(capacity), false);
      }
    });
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

    assert.deepStrictEqual(obliterator.take(queue.values()), [3, 6, 9]);
  });
});
