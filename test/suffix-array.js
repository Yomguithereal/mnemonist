/* eslint no-new: 0 */
/**
 * Mnemonist FibonacciHeap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    SuffixArray = require('../suffix-array.js');

describe('SuffixArray', function() {

  it('should produce the correct array.', function() {
    var sa = new SuffixArray('banana');

    assert.strictEqual(sa.length, 6);
    assert.strictEqual(sa.string, 'banana');
    assert.deepEqual(sa.array, [5, 3, 1, 0, 4, 2]);

    sa = new SuffixArray('This is a long string.');

    assert.deepEqual(
      sa.array,
      [
        7, 4, 9,
        14, 21, 0,
        8, 13, 20,
        1, 18, 5,
        2, 10, 12,
        19, 11, 17,
        6, 3, 15,
        16
      ]
    );
  });

  it('should also work with arbitrary sequences.', function() {
    var sa = new SuffixArray('banana'.split(''));

    assert.strictEqual(sa.length, 6);
    assert.deepEqual(sa.string, 'banana'.split(''));
    assert.deepEqual(sa.array, [5, 3, 1, 0, 4, 2]);
  });
});
