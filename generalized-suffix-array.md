---
layout: page
title: Generalized Suffix Array
---

A generalized suffix array is just a fancy name for a [suffix array]({{ site.baseurl }}/suffix-array) containing more than a single string.

Its main use is to be able to compute the longest common subsequence of the input strings in linear time, whereas a naive implementation would compute this information in quadratic time.

For more information about the Generalized Suffix Array, you can head [here](https://en.wikipedia.org/wiki/Suffix_array).

```js
var GeneralizedSuffixArray = require('mnemonist/suffix-array').GeneralizedSuffixArray;
```

## Constructor

The `GeneralizedSuffixArray` class simply takes an array of strings or an array of arbitrary arrays of string tokens as its only argument:

```js
var suffixArray = new GeneralizedSuffixArray([
  'banana',
  'ananas'
]);

// Also works with arbitrary sequences of tokens
var suffixArray = new GeneralizedSuffixArray([
  ['the', 'cat', 'eats', 'the', 'mouse'],
  ['the', 'mouse', 'eats', 'cheese']
]);
```

Note that if you pass an array of arbitrary arrays of tokens, computation time for the suffix array is approximately `O(n log n)`, which is obviously slower than for a simple string.

## Members

* [#.array](#array)
* [#.length](#length)
* [#.size](#size)

## Methods

* [#.longestCommonSubsequence](#longestcommonesubsequence)

### #.array

The computed suffix array.

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);
suffixArray.array
>>> [6, 5, 3, 1, 7, 9, 11, 0, 4, 2, 8, 10, 12]
```

### #.length

The length of the array.

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);
suffixArray.length
>>> 13
```

### #.size

The number of elements stored.

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);
suffixArray.size
>>> 2
```

### #.longestCommonSubsequence

Retrieves the longest common subsequence of the array.

`O(n)`

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);

suffixArray.longestCommonSubsequence();
>>> 'anana'

var suffixArray = new GeneralizedSuffixArray([
  ['the', 'cat', 'eats', 'the', 'mouse'],
  ['the', 'mouse', 'eats', 'cheese']
]);

suffixArray.longestCommonSubsequence();
>>> ['the', 'mouse']
```
