# Suffix Arrays

For more information about the Stack, you can head [here](https://en.wikipedia.org/wiki/Suffix_array).

* [Suffix Array](#suffix-array)
* [Generalized Suffix Array](#generalized-suffix-array)

## Suffix Array

```js
var SuffixArray = require('mnemonist/suffix-array');
```

### Members

* [#.array](#array)
* [#.length](#length)
* [#.string](#string)

#### #.array

The computed suffix array.

```js
var suffixArray = new SuffixArray('banana');
suffixArray.array
>>> [5, 3, 1, 0, 4, 2]
```

#### #.length

The length of the array.

```js
var suffixArray = new SuffixArray('banana');
suffixArray.length
>>> 6
```

#### #.string

The stored string.

```js
var suffixArray = new SuffixArray('banana');
suffixArray.string
>>> 'banana'
```

## Generalized Suffix Array

```js
var GeneralizedSuffixArray = require('mnemonist/suffix-array').GeneralizedSuffixArray;
```

### Members

* [#.array](#array)
* [#.length](#length)
* [#.size](#size)

### Methods

* [#.longestCommonSubsequence](#longestcommonesubsequence)

#### #.array

The computed suffix array.

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);
suffixArray.array
>>> [6, 5, 3, 1, 7, 9, 11, 0, 4, 2, 8, 10, 12]
```

#### #.length

The length of the array.

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);
suffixArray.length
>>> 13
```

#### #.size

The number of elements stored.

```js
var suffixArray = new GeneralizedSuffixArray(['banana', 'ananas']);
suffixArray.size
>>> 2
```

#### #.longestCommonSubsequence

Retrieves the longest common subsequence of the array.

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
