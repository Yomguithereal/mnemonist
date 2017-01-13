---
layout: page
title: Generalized Suffix Array
---

For more information about the Generalized Suffix Array, you can head [here](https://en.wikipedia.org/wiki/Suffix_array).

```js
var GeneralizedSuffixArray = require('mnemonist/suffix-array').GeneralizedSuffixArray;
```

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
