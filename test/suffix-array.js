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

  it('should work with more than two strings.', function() {

    // The longest common subsequence must be shared by *every* string, and
    // not merely by the first one and any other (issue #196).
    var sa = new GeneralizedSuffixArray([
      '1234',
      '234',
      '1234'
    ]);

    assert.strictEqual(sa.longestCommonSubsequence(), '234');

    sa = new GeneralizedSuffixArray(['banana', 'ananas', 'bandana']);

    assert.strictEqual(sa.longestCommonSubsequence(), 'ana');

    sa = new GeneralizedSuffixArray(['xabcy', 'zabcw', 'pabcq']);

    assert.strictEqual(sa.longestCommonSubsequence(), 'abc');
  });

  it('should handle degenerate cases.', function() {

    // A single string is its own longest common subsequence
    var sa = new GeneralizedSuffixArray(['hello']);

    assert.strictEqual(sa.longestCommonSubsequence(), 'hello');

    // No common subsequence at all
    sa = new GeneralizedSuffixArray(['abc', 'xyz']);

    assert.strictEqual(sa.longestCommonSubsequence(), '');

    sa = new GeneralizedSuffixArray([['a', 'b'], ['x', 'y']]);

    assert.deepStrictEqual(sa.longestCommonSubsequence(), []);
  });

  it.skip('should work with arbitrary sequences of more than two strings (issue #196).', function() {

    // TODO: fix sentinel to be lower than anything else in the token case
    var suffixArray = new GeneralizedSuffixArray([
      [1, 2, 3, 4],
      [2, 3, 4],
      [1, 2, 3, 4]
    ]);

    var result = suffixArray.longestCommonSubsequence();

    assert.deepStrictEqual(result, [2, 3, 4]);
  });
});
