/* eslint no-new: 0 */
/**
 * Mnemonist Heap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    Heap = require('../heap.js'),
    DEFAULT_COMPARATOR = require('../utils/comparators.js').DEFAULT_COMPARATOR,
    MaxHeap = Heap.MaxHeap;

describe('Heap', function() {

  it('should be possible to add items to the heap.', function() {
    var heap = new Heap();

    heap.push('hello');
    heap.push('world');

    assert.strictEqual(heap.size, 2);
  });

  it('should be possible to peek the heap.', function() {
    var heap = new Heap();

    assert.strictEqual(heap.peek(), undefined);

    heap.push(3);
    heap.push(24);

    assert.strictEqual(heap.peek(), 3);

    heap.push(1);

    assert.strictEqual(heap.peek(), 1);
  });

  it('should be possible to pop the heap.', function() {
    var heap = new Heap();

    heap.push(3);
    heap.push(34);
    heap.push(1);
    heap.push(2);

    assert.strictEqual(heap.size, 4);

    assert.strictEqual(heap.pop(), 1);
    assert.strictEqual(heap.size, 3);
    assert.strictEqual(heap.pop(), 2);
    assert.strictEqual(heap.size, 2);
    assert.strictEqual(heap.pop(), 3);
    assert.strictEqual(heap.size, 1);
    assert.strictEqual(heap.pop(), 34);
    assert.strictEqual(heap.size, 0);
    assert.strictEqual(heap.pop(), undefined);
    assert.strictEqual(heap.size, 0);
  });

  it('should be possible to replace an item in the heap.', function() {

    var heap = new Heap();

    assert.throws(function() {
      heap.replace(3);
    }, /replace/);

    heap.push(3);
    var popped = heap.replace(56);

    assert.strictEqual(heap.size, 1);
    assert.strictEqual(popped, 3);
    assert.strictEqual(heap.peek(), 56);
  });

  it('should be possible to pushpop the heap.', function() {
    var heap = new Heap();

    assert.strictEqual(heap.pushpop(3), 3);
    assert.strictEqual(heap.size, 0);

    heap.push(4);
    heap.push(5);

    var popped = heap.pushpop(6);

    assert.strictEqual(heap.size, 2);
    assert.strictEqual(popped, 4);
    assert.deepEqual(heap.toArray(), [5, 6]);
  });

  it('should be possible to create a max heap.', function() {
    var heap = new MaxHeap();

    heap.push(3);
    heap.push(34);
    heap.push(1);
    heap.push(2);

    assert.strictEqual(heap.size, 4);

    assert.strictEqual(heap.pop(), 34);
    assert.strictEqual(heap.size, 3);
    assert.strictEqual(heap.pop(), 3);
    assert.strictEqual(heap.size, 2);
    assert.strictEqual(heap.pop(), 2);
    assert.strictEqual(heap.size, 1);
    assert.strictEqual(heap.pop(), 1);
    assert.strictEqual(heap.size, 0);
  });

  it('should be possible to pass a custom comparator.', function() {

    assert.throws(function() {
      new Heap('test');
    }, /function/);

    var comparator = function(a, b) {
      if (a.value < b.value)
        return -1;
      if (a.value > b.value)
        return 1;
      return 0;
    };

    var heap = new Heap(comparator);

    heap.push({value: 34});
    heap.push({value: 2});

    assert.deepEqual(heap.peek(), {value: 2});

    var maxHeap = new MaxHeap(comparator);

    maxHeap.push({value: 34});
    maxHeap.push({value: 2});

    assert.deepEqual(maxHeap.peek(), {value: 34});
  });

  it('should be possible to convert the heap to an array.', function() {
    var heap = Heap.from([23, 1, 34, 5]);

    assert.deepEqual(heap.toArray(), [1, 5, 23, 34]);

    heap = MaxHeap.from([23, 1, 34, 5]);

    assert.deepEqual(heap.toArray(), [34, 23, 5, 1]);
  });

  it('should be possible to create a heap from an iterable.', function() {
    var set = new Set([45, 56, 23]);

    var heap = Heap.from(set);

    assert.strictEqual(heap.size, 3);
    assert.strictEqual(heap.peek(), 23);
  });

  it('should be possible to heapify an array.', function() {
    var array = [3, 5, 1, 56, 0, 13, 4];
    Heap.heapify(DEFAULT_COMPARATOR, array);

    var sorted = Heap.consume(DEFAULT_COMPARATOR, array);

    assert.deepEqual(sorted, [0, 1, 3, 4, 5, 13, 56]);
  });
});
