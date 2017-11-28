---
layout: page
title: StaticIntervalTree
---

The `StaticIntervalTree` is a static implementation of an [Interval Tree](https://en.wikipedia.org/wiki/Interval_tree) as an augmented balanced binary search tree.

This structure aims at indexing arbitrary intervals that one can then query likewise:

* Finding all the intervals containing the given point.
* Finding all the intervals overlapping the given interval.

Under the hood, this structure is implemented as an augmented binary search tree. It is constructed by sorting all the given intervals by starting point and building a balanced binary search tree from it. The tree is then augmented by storing in each node the maximum end value one might find below it.

**Important note n°1**: this implementation is static. This means that you need to know all your intervals beforehand as the tree needs to be built from a list of intervals. This also means that you won't be able to edit the structure afterwards, i.e. you cannot add/delete intervals on the fly.

**Important note n°2**: the structure considers the given intervals as closed. It's however quite easy to circumvent this restriction by preprocessing your intervals or by providing specialized getters.

**Important note n°3**: for optimization reasons, this implementation currently only handles numbers. You can go around this limitation by converting your points to number through getters (dates can easily be converted to timestamps, for instance).

```js
var StaticIntervalTree = require('mnemonist/static-interval-tree');
```

## Use case

Let's say we have a large database of historical figures and we want to be able to retrieve every person that was living in 1456.

The naive way would be to iterate over all our figures to find suitable ones.

```js
var figures = [
 {name: 'John II of Cyprus', birth: 1418, death: 1458},
 {name: 'Helena Palaiologina', birth: 1428, death: 1458},
 {name: 'Ashikaga Yoshikatsu', birth: 1434, death: 1443},
 //... lot of other figures
];

// Searching for figures living in 1456
figures.filter(function(figure) {
  return figure.death >= 1456 && figure.birth <= 1456;
});
>>> [
 {name: 'John II of Cyprus', birth: 1418, death: 1458},
 {name: 'Helena Palaiologina', birth: 1428, death: 1458},
]
```

Unfortunately, this runs in linear time and is probably not a good choice if you have a lot of intervals and if you intend to perform this kind of queries quite often.

This is where the `StaticIntervalTree` can help you.

```js
// Building our tree, using custom getters for start & end of intervals
var tree = StaticIntervalTree.from(figures, [
  f => f.birth,
  f => f.death
]);

// Querying the tree
tree.intervalsContainingPoint(1456);
>>> [
 {name: 'John II of Cyprus', birth: 1418, death: 1458},
 {name: 'Helena Palaiologina', birth: 1428, death: 1458},
]
```

## Constructor

Since you need to know the whole list of intervals to be indexed beforehand, you cannot construct the `StaticIntervalTree`. Instead, you can only build one from an iterable using the static [`#.from`](#static-from) method.

### Static #.from

You can build a `StaticIntervalTree` from an arbitrary iterable.

Alternatively, you can provide some customized start and end getters if you want to represent your intervals differently than an array.

```js
var tree = StaticIntervalTree.from([[0, 1], [20, 34]]);

// Using specialized getters
var figures = [
 {name: 'John II of Cyprus', birth: 1418, death: 1458},
 {name: 'Helena Palaiologina', birth: 1428, death: 1458},
 {name: 'Ashikaga Yoshikatsu', birth: 1434, death: 1443}
];

var tree = StaticIntervalTree.from(figures, [
  f => f.birth,
  f => f.death
]);
```

## Members

* [#.height](#height)
* [#.size](#size)

## Methods

*Read*

* [#.intervalsContainingPoint](#peintervalsontainingoint)
* [#.intervalsOverlappingInterval](#intervalsoverlappinginterval)

### #.height

Height of the underlying binary search tree.

```js
var tree = StaticIntervalTree.from([[0, 1], [20, 34]]);

tree.height
>>> 3
```

### #.size

Number of stored intervals.

```js
var tree = StaticIntervalTree.from([[0, 1], [20, 34]]);

tree.size
>>> 2
```

### #.intervalsContainingPoint

Retrieves an array of intervals containing the given point.

```js
var tree = StaticIntervalTree.from([[0, 1], [20, 34]]);

tree.intervalsContainingPoint(1);
>>> [[0, 1]]
```

### #.intervalsOverlappingInterval

Retrieves an array of intervals overlapping with the given interval.

```js
var tree = StaticIntervalTree.from([[0, 1], [20, 34]]);

tree.intervalsContainingPoint([5, 24]);
>>> [[20, 34]]
```

