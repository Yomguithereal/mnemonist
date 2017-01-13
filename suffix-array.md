---
layout: page
title: Suffix Array
---

For more information about the Suffix Array, you can head [here](https://en.wikipedia.org/wiki/Suffix_array).

```js
var SuffixArray = require('mnemonist/suffix-array');
```

## Members

* [#.array](#array)
* [#.length](#length)
* [#.string](#string)

### #.array

The computed suffix array.

```js
var suffixArray = new SuffixArray('banana');
suffixArray.array
>>> [5, 3, 1, 0, 4, 2]
```

### #.length

The length of the array.

```js
var suffixArray = new SuffixArray('banana');
suffixArray.length
>>> 6
```

### #.string

The stored string.

```js
var suffixArray = new SuffixArray('banana');
suffixArray.string
>>> 'banana'
```
