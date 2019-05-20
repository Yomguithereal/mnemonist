/* eslint no-new: 0 */
/**
 * Mnemonist FixedReverseHeap Unit Tests
 * ======================================
 */
var assert = require('assert'),
    FixedReverseHeap = require('../fixed-reverse-heap.js');

describe('FixedReverseHeap', function() {

  it('should be possible to add items to the heap.', function() {
    var heap = new FixedReverseHeap(Array, 3);

    heap.push(4);
    heap.push(1);
    heap.push(3);

    assert.strictEqual(heap.capacity, 3);
    assert.strictEqual(heap.size, 3);
  });

  it('should be possible to consume the heap.', function() {
    var heap = new FixedReverseHeap(Array, 3);

    heap.push(4);
    heap.push(1);
    heap.push(8);

    assert.deepEqual(heap.consume(), [1, 4, 8]);
    assert.strictEqual(heap.size, 0);

    heap.push(3);
    heap.push(34);

    assert.strictEqual(heap.size, 2);
    assert.deepEqual(heap.consume(), [3, 34]);
    assert.strictEqual(heap.size, 0);
  });

  it('should be possible to convert the heap into an array.', function() {
    var heap = new FixedReverseHeap(Array, 3);

    heap.push(4);
    heap.push(1);
    heap.push(8);

    assert.deepEqual(heap.toArray(), [1, 4, 8]);
    assert.strictEqual(heap.size, 3);
  });

  it('should only keep the smallest elements.', function() {
    var heap = new FixedReverseHeap(Uint8Array, 3);

    heap.push(45);
    heap.push(12);
    heap.push(46);
    heap.push(1);
    heap.push(90);
    heap.push(3);
    heap.push(234);
    heap.push(138);
    heap.push(0);

    assert.strictEqual(heap.size, 3);
    assert.deepEqual(heap.consume(), new Uint8Array([0, 1, 3]));
  });

  it('should return the same type of array as given to the constructor.', function() {
    var heap = new FixedReverseHeap(Uint8Array, 3);

    heap.push(45);
    heap.push(12);
    heap.push(46);

    assert(heap.toArray() instanceof Uint8Array);
    assert(heap.consume() instanceof Uint8Array);
  });

  it('should be possible to clear the heap.', function() {
    var heap = new FixedReverseHeap(Uint8Array, 3);

    heap.push(45);
    heap.push(12);
    heap.push(46);
    heap.push(1);
    heap.push(90);
    heap.push(3);

    heap.clear();

    heap.push(234);
    heap.push(0);

    assert.strictEqual(heap.size, 2);
    assert.deepEqual(heap.consume(), new Uint8Array([0, 234]));
  });

  it('should work with a reverse comparator.', function() {
    var comparator = function(a, b) {
      if (a < b)
        return 1;
      if (a > b)
        return -1;

      return 0;
    };

    var heap = new FixedReverseHeap(Uint8Array, comparator, 3);

    heap.push(45);
    heap.push(12);
    heap.push(46);
    heap.push(1);
    heap.push(90);
    heap.push(3);
    heap.push(234);
    heap.push(138);
    heap.push(0);

    assert.strictEqual(heap.size, 3);
    assert.deepEqual(heap.consume(), new Uint8Array([234, 138, 90]));
  });
});
