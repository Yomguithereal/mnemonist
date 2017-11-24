---
layout: page
title: Vantage Point Tree
---

A `VPTree` is a data structure used to index items in an arbitrary metric space so one can then perform efficient nearest neighbors queries.

It works by choosing a point in the dataset and making it the "vantage point" of the node then splitting the remaining points into two children nodes one storing the nearest points and the other the farthest ones. It continues recursively until all points have been stored in the tree.

However, one should keep in mind that a `VPTree` has worst cases - mostly due to median ambiguity - and will often build trees that are not perfectly balanced. This is frequently the case, for instance, with datasets where everything stands close together or that are too small.

For more information about the `VPTree`, you can head [here](https://en.wikipedia.org/wiki/Vantage-point_tree).

```js
var VPTree = require('mnemonist/vp-tree');
```

## Constructor

Since you need to know the whole list of items to be indexed beforehand, you cannot construct the `VPTree`. Instead, you can only build one from an iterable using the static [`#.from`](#static-from) method.

### Static #.from

You need two things to be able to build a `VPTree`: a list of items to index and an arbitraty distance metric to use (the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance), for instance).

Note that the provided metric distance must be a [true metric](https://en.wikipedia.org/wiki/Metric_(mathematics)) else the tree cannot work properly.

```js
var tree = VPTree.from(['hello', 'mello'], distance);
```

## Members

* [#.size](#size)

## Methods

*Read*

* [#.nearestNeighbors](#nearestneighbors)
* [#.neighbors](#neighbors)

### #.size

Total number of items stored in the tree.

```js
var tree = new VPTree(distance, ['hello']);

tree.size
>>> 1
```

### #.nearestNeighbors

Returns the k nearest neighbors of the given query. Note that the resulting array will be ordered with by ascending distance.

```js
var words = [
  'book',
  'back',
  'bock',
  'lock',
  'mack',
  'shock',
  'ephemeral'
];

var tree = new VPTree(levenshtein, words);

// Retrieving the 2 nearest neighbors of "look"
tree.nearestNeighbors(2, 'look');
>>> [
  {distance: 1, item: 'lock'},
  {distance: 1, item: 'book'} 
]
```

### #.neighbors

Return all the neighbors of the given query for the given radius. Note that the resulting array will not be ordered.

```js
var words = [
  'book',
  'back',
  'bock',
  'lock',
  'mack',
  'shock',
  'ephemeral'
];

var tree = new VPTree(levenshtein, words);

// Retrieving all the neighbors of "look" at a maximum distance of 2
tree.neighbors(2, 'look');
>>> [
  {distance: 1, item: 'lock'},
  {distance: 1, item: 'book'},
  {distance: 2, item: 'bock'}
]
```
