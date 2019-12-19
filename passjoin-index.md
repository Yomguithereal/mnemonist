---
layout: page
title: Passjoin Index
---

The `PassjoinIndex` is an index leveraging the ["Pass-join" algorithm](http://people.csail.mit.edu/dongdeng/projects/passjoin/index.html) in order to enable its user to perform efficient [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) queries.

It is a very good choice when you need to find strings being at a rather small Levensthein distance from your queries.

Indeed, this index features the following complexities (`n` being the number of items to store and `k` being your Levenshtein distance threshold):

* `O(nk)` space complexity.
* `O(nk)` time complexity for indexing.
* `~O(k^3)` time complexity for queries.

This is very good because its performance mostly depends on `k` being low, which fits typical use-cases related to fuzzy search, spelling correction etc.

Note that the real complexity is very hard to assess and depends on your dataset's substring clustering etc. so your mileage may vary.

```js
var PassjoinIndex = require('mnemonist/passjoin-index');
```

**References**

> Jiang, Yu, Dong Deng, Jiannan Wang, Guoliang Li, et Jianhua Feng. « Efficient Parallel Partition-Based Algorithms for Similarity Search and Join with Edit Distance Constraints ». In Proceedings of the Joint EDBT/ICDT 2013 Workshops on - EDBT ’13, 341. Genoa, Italy: ACM Press, 2013.<br>[https://doi.org/10.1145/2457317.2457382](https://doi.org/10.1145/2457317.2457382)

> Li, Guoliang, Dong Deng, et Jianhua Feng. « A Partition-Based Method for String Similarity Joins with Edit-Distance Constraints ». ACM Transactions on Database Systems 38, no 2 (1 juin 2013): 1‑33.<br>[https://doi.org/10.1145/2487259.2487261](https://doi.org/10.1145/2487259.2487261)

## Use case

Let's say we want to build an autocomplete system.

When the user inputs a string, we are going to search for every term we know being at most at a Levenshtein distance of 2 of the user's query.

The naive method would be to "brute-force" the list of terms likewise:

```js
var suggestions = terms.filter(term => {
  return levenshtein(term, query) <= 2;
});
```

But, even if this works with few terms, it will soon become hard to compute if the list of terms grows too much.

A `PassjoinIndex` solves this problem by indexing the list of terms such as it becomes efficient to query them:

```js
var tree = PassjoinIndex.from(terms, levenshtein, 2);

// We can now search the index easily:
var suggestions = tree.search(query);
```


## Constructor

The `PassjoinIndex` takes two arguments: a Levenshtein distance function, and a threshold `k` for maximum distance allowed between your queries and the stored strings.

```js
const index = new PassjoinIndex(levenshtein, 2);
```

We recommend the following libraries for efficient Levenshtein distance functions in JavaScript:

* [leven](https://www.npmjs.com/package/leven)
* [js-levenshtein](https://www.npmjs.com/package/js-levenshtein)
* [talisman](https://www.npmjs.com/package/talisman)
* [node-levenshtein](https://www.npmjs.com/package/node-levenshtein)

If `k` is 1, we recommend the following specialized library:

* [levenshtein-lte1](https://www.npmjs.com/package/levenshtein-lte1)

### Static #.from

Alternatively, one can build a `PassjoinIndex` from an arbitrary JavaScript iterable likewise:

```js
var index = PassjoinIndex.from(['roman', 'roma'], levenshtein, 2);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.clear](#clear)

*Read*

* [#.search](#search)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [Iterable](#iterable)

### #.size

Number of items in the index.

```js
var index = new PassjoinIndex(levenshtein, 1);
index.size
>>> 0

index.add('roman');
index.size
>>> 1
```

### #.add

Adds a string to the index.

`O(kn)`

```js
var index = new PassjoinIndex(levenshtein, 1);

index.add('roman');
```

### #.clear

Completely clears the index.

```js
var index = new PassjoinIndex(levenshtein, 1);

index.add('roman');
index.clear();

index.size
>>> 0
```

### #.search

Returns the set of every string matching the query in the index, i.e. every string being at maximum at a Levenshtein distance of `k` from the query.

`~O(k^3)`

```js
var index = new PassjoinIndex(levenshtein, 1);

index.add('flailed');
index.add('roman');

index.search('failed');
>>> Set(['flailed']);
```

### #.forEach

Iterates over the indexed strings.

```js
var index = new PassjoinIndex(levenshtein, 1);

index.add('roman');
index.add('flailed');

index.forEach(function(string) {
  console.log(string);
});
```

### #.values

Returns an iterator over the indexed values.

```js
var index = PassjoinIndex.from(['roman', 'flailed']);

var iterator = index.values();

iterator.next().value
>>> 'roman'
```

### Iterable

Alternatively, you can iterate over indexed values using ES2015 `for...of` protocol:

```js
var index = PassjoinIndex.from(['roman', 'flailed']);

for (var string of index) {
  console.log(string);
}
```
