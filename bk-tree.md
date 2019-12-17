---
layout: page
title: Burkhard-Keller Tree
---

A `BKTree` is a data structure that makes possible to make efficient fuzzy query using arbitrary distance metrics such as the [Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance) distance.

For more information about the Burkhard-Keller Tree, you can head [here](https://en.wikipedia.org/wiki/BK-tree).

```js
var BKTree = require('mnemonist/bk-tree');
```

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

Burkhard-Keller trees solves this problem by indexing the list of terms such as it becomes efficient to query them using a distance metric.

```js
var tree = BKTtree.from(terms, levenshtein);

// We can now query the tree easily:
var suggestions = tree.search(2, query);
```

**N.B.** you should probably also check the [PassjoinIndex]({{ site.baseurl }}/passjoin-index) structure, which is able to perform the same kind of job but is even more efficient for this precise use case.

## Constructor

The `BKTree` takes a single argument being the distance metric to use.

```js
var tree = new BKTree(distance);
```

**N.B.** the given distance metric must return integers. As such, the [Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index), for instance, is not suitable to use with this data strucure.

What's more, only a [true metric](https://en.wikipedia.org/wiki/Metric_(mathematics)) can be used.

### Static #.from

Alternatively, one can build a `BKTree` from an arbitrary JavaScript iterable likewise:

```js
var tree = BKTree.from(['hello', 'mello'], distance);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.clear](#clear)

*Read*

* [#.search](#search)

### #.size

Total number of items stored in the tree.

```js
var tree = new BKTree(distance);

tree.add('hello');

tree.size
>>> 1
```

### #.add

Adds a single item to the tree.

```js
var tree = new BKTree(distance);

tree.add('hello');
```

### #.clear

Completely clears the tree of its items.

```js
var tree = new BKTree(distance);

tree.add('hello');
tree.clear();

tree.size
>>> 0
```

### #.search

Returns every item in the tree within the desired distance.

```js
var tree = new BKTree(distance);

tree.add('hello');
tree.add('mello');
tree.add('roman');

tree.search(1, 'vello');
>>> [
  {item: 'hello', distance: 1}
  {item: 'mello', distance: 1}
]
```
