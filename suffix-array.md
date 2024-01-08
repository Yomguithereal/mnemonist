---
layout: page
title: Suffix Array
---

A suffix array is the array of a string's possible suffixes stored in lexicographical order.

For instance, the string `banana` has the following suffixes:

```
banana
anana
nana
ana
na
a
```

So, in lexicographical order, the suffixes would be stored likewise:

```
a
ana
anana
banana
na
nana
```

Which is encoded by the following array if we refer to each suffix by its starting index:

```js
[5, 3, 1, 0, 4, 2]
```

But the real purpose of mnemonist's `SuffixArray` class is that it uses *Karkkainen* and *Sanders*' algorithm to build the array in linear time, whereas a naive implementation would do it in quadratic time.

For more information about the Suffix Array, you can head [here](https://en.wikipedia.org/wiki/Suffix_array).

```js
const SuffixArray = require('mnemonist/suffix-array');
```

## Constructor

The `SuffixArray` class simply takes a single string or arbitrary array of string tokens as its only argument:

```js
const suffixArray = new SuffixArray('banana');
```
```js
// Also works with arbitrary sequences of tokens
const suffixArray = new SuffixArray(['the', 'cat', 'eats', 'the', 'mouse']);
```

Note that if you pass an arbitrary array of tokens, computation time for the suffix array is approximately `O(n log n)`, which is obviously slower than for a simple string.

## Members

* [#.array](#array)
* [#.length](#length)
* [#.string](#string)

### #.array

The computed suffix array.

```js
const suffixArray = new SuffixArray('banana');
suffixArray.array
>>> [5, 3, 1, 0, 4, 2]
```

### #.length

The length of the array.

```js
const suffixArray = new SuffixArray('banana');
suffixArray.length
>>> 6
```

### #.string

The stored string.

```js
const suffixArray = new SuffixArray('banana');
suffixArray.string
>>> 'banana'
```
