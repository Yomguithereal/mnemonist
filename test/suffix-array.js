/* eslint no-new: 0 */
/**
 * Mnemonist FibonacciHeap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    SuffixArray = require('../suffix-array.js'),
    GeneralizedSuffixArray = SuffixArray.GeneralizedSuffixArray;

describe('SuffixArray', function() {

  it('should produce the correct array.', function() {
    var sa = new SuffixArray('banana');

    assert.strictEqual(sa.length, 6);
    assert.strictEqual(sa.string, 'banana');
    assert.deepStrictEqual(sa.array, [5, 3, 1, 0, 4, 2]);

    sa = new SuffixArray('This is a long string.');

    assert.deepStrictEqual(
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
    assert.deepStrictEqual(sa.string, 'banana'.split(''));
    assert.deepStrictEqual(sa.array, [5, 3, 1, 0, 4, 2]);
  });
});

describe('GeneralizedSuffixArray', function() {

  it('should produce the correct array.', function() {
    var sa = new GeneralizedSuffixArray(['banana', 'ananas']);

    assert.strictEqual(sa.length, 13);
    assert.strictEqual(sa.size, 2);
    assert.deepStrictEqual(sa.array, [6, 5, 3, 1, 7, 9, 11, 0, 4, 2, 8, 10, 12]);
  });

  it('should also work with arbitrary sequences.', function() {
    var sa = new GeneralizedSuffixArray(['banana', 'ananas'].map(function(item) {
      return item.split('');
    }));

    assert.strictEqual(sa.length, 13);
    assert.strictEqual(sa.size, 2);
    assert.deepStrictEqual(sa.array, [6, 5, 3, 1, 7, 9, 11, 0, 4, 2, 8, 10, 12]);
  });

  it('should be possible to extract the longest common subsequence.', function() {
    var sa = new GeneralizedSuffixArray(['banana', 'ananas']);

    assert.strictEqual(
      sa.longestCommonSubsequence(),
      'anana'
    );

    sa = new GeneralizedSuffixArray(['abcd', 'cdef']);

    assert.strictEqual(
      sa.longestCommonSubsequence(),
      'cd'
    );

    sa = new GeneralizedSuffixArray([
      ['the', 'cat', 'eats', 'the', 'mouse'],
      ['the', 'mouse', 'eats', 'cheese']
    ]);

    assert.deepStrictEqual(
      sa.longestCommonSubsequence(),
      ['the', 'mouse']
    );
  });
});
