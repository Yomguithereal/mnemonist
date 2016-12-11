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
  });

  it('should also work with arbitrary sequences.', function() {
    var sa = new SuffixArray('banana'.split(''));

    assert.strictEqual(sa.length, 6);
    assert.deepEqual(sa.string, 'banana'.split(''));
    assert.deepEqual(sa.array, [5, 3, 1, 0, 4, 2]);
  });
});
