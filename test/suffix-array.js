/* eslint no-new: 0 */
/**
 * Mnemonist FibonacciHeap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    SuffixArray = require('../suffix-array.js'),
    GeneralizedSuffixArray = SuffixArray.GeneralizedSuffixArray;

function naiveSuffixArray(sequence) {
  var indices = [];

  for (var i = 0; i < sequence.length; i++)
    indices.push(i);

  return indices.sort(function(a, b) {
    while (a < sequence.length && b < sequence.length) {
      if (sequence[a] < sequence[b])
        return -1;
      if (sequence[a] > sequence[b])
        return 1;
      a++;
      b++;
    }

    return (sequence.length - a) - (sequence.length - b);
  });
}

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

  it('should sort repeated and periodic suffixes through recursion.', function() {
    ['', 'a', 'aaaaaa', 'aaaaaaa', 'aaaaaaaa', 'abababa', 'abababab',
      'abcabcabc', 'a'.repeat(31), 'a'.repeat(32), 'a'.repeat(33),
      'ab'.repeat(50), '\u0000a\u0000a\u0000', '\uffff\ud800a\ud800'].forEach(function(string) {
      assert.deepStrictEqual(new SuffixArray(string).array, naiveSuffixArray(string));

      var tokens = string.split('').map(function(token) {
        return token + ' token';
      });

      assert.deepStrictEqual(new SuffixArray(tokens).array, naiveSuffixArray(tokens));
    });
  });

  it('should agree with a suffix oracle on all binary strings through length 12.', function() {
    for (var length = 1; length <= 12; length++) {
      for (var value = 0; value < (1 << length); value++) {
        var string = '';

        for (var i = 0; i < length; i++)
          string += value & (1 << i) ? 'b' : 'a';

        assert.deepStrictEqual(new SuffixArray(string).array, naiveSuffixArray(string), string);
      }
    }
  });
});

describe('GeneralizedSuffixArray', function() {

  it('should sort repeated suffixes for strings and token sequences.', function() {
    [['a', 'aaaa'], ['a', 'aaaaa'], ['a', 'aaaaaa'],
      ['abababa', 'abababab'], ['a'.repeat(31), 'a'.repeat(32)]].forEach(function(strings) {
      var sa = new GeneralizedSuffixArray(strings);

      assert.deepStrictEqual(sa.array, naiveSuffixArray(sa.text));

      sa = new GeneralizedSuffixArray(strings.map(function(string) {
        return string.split('').map(function(token) {
          return token + ' token';
        });
      }));

      assert.deepStrictEqual(sa.array, naiveSuffixArray(sa.text));
    });
  });

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

  it.skip('should work with int values (issue #196).', function() {
    var suffixArray = new GeneralizedSuffixArray([
      '1234',
      '234',
      '1234'
    ]);

    var result = suffixArray.longestCommonSubsequence();

    assert.deepStrictEqual(result, '234');

    // TODO: fix sentinel to be lower than anything else in the token case
    suffixArray = new GeneralizedSuffixArray([
      [1, 2, 3, 4],
      [2, 3, 4],
      [1, 2, 3, 4]
    ]);

    result = suffixArray.longestCommonSubsequence();

    assert.deepStrictEqual(result, [2, 3, 4]);
  });
});
