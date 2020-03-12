---
layout: page
title: KD Tree
---

A `KDTree`, or k-dimensional tree, is a data structure used to index points in a multidimensional euclidean space so that it becomes efficient to make proximity queries, such as finding the nearest neighbor of a given point.

For more information about the `KDTree`, you can head [here](https://en.wikipedia.org/wiki/K-d_tree).

```js
var KDTree = require('mnemonist/kd-tree');
```

## Constructor

Since you need to know the whole list of items to be indexed beforehand, you cannot construct the `KDTree`. Instead, you can only build one from an iterable or axes using the static [`#.from`](#static-from) or [`#.fromAxes`](#static-axes) methods.

Note that the tree is always built in `O(n log n)` time.

### Static #.from

A `KDTree` can be built from an iterable yielding items looking like this:

```
[label, [x, y, z...]]
```

```js
var data = [
  ['zero', [2, 3]],
  ['one', [5, 4]],
  ['two', [9, 6]],
  ['three', [4, 7]],
  ['four', [8, 1]],
  ['five', [7, 2]]
];

var tree = KDTree.from(data, 2);
```

### Static #.fromAxes

For better memory efficiency, or just because you organized your data thusly, you can also build a `KDTree` from axes with optional labels. If you don't provide labels, the tree will simply return indices to you when querying.

```js
var axes = [
  [2, 5, 9, 4, 8, 7],
  [3, 4, 6, 7, 1, 2]
];

var labels = ['zero', 'one', 'two', 'three', 'four', 'five'];

var tree = KDTree.fromAxes(axes, labels);
// Or, without labels:
var tree = KDTree.fromAxes(axes);
```

## Members

* [#.dimensions](#dimensions)
* [#.size](#size)

## Methods

*Read*

* [#.nearestNeighbor](nearestneighbor)
* [#.kNearestNeighbors](knearestneighbors)

### #.size

Total number of items stored in the tree.

```js
var data = [
  ['zero', [2, 3]],
  ['one', [5, 4]],
  ['two', [9, 6]],
  ['three', [4, 7]],
  ['four', [8, 1]],
  ['five', [7, 2]]
];

var tree = new KDTree(data, 2);

tree.size
>>> 6
```

### #.dimensions

Number of dimensions of the space indexed by the tree.

```js
var data = [
  ['zero', [2, 3]],
  ['one', [5, 4]],
  ['two', [9, 6]],
  ['three', [4, 7]],
  ['four', [8, 1]],
  ['five', [7, 2]]
];

var tree = new KDTree(data, 2);

tree.dimensions
>>> 2
```

### #.nearestNeighbor

Returns query point's nearest neighbor in the tree.

```js
var data = [
  ['zero', [2, 3]],
  ['one', [5, 4]],
  ['two', [9, 6]],
  ['three', [4, 7]],
  ['four', [8, 1]],
  ['five', [7, 2]]
];

var tree = new KDTree(data, 2);

tree.nearestNeighbor([2, 4]);
>>> 'zero'
```

### #.kNearestNeighbors

Returns query point's `k` nearest neighbors in the tree, sorted from closest to farthest.

```js
var data = [
  ['zero', [2, 3]],
  ['one', [5, 4]],
  ['two', [9, 6]],
  ['three', [4, 7]],
  ['four', [8, 1]],
  ['five', [7, 2]]
];

var tree = new KDTree(data, 2);

tree.kNearestNeighbors(2, [2, 4]);
>>> ['zero', 'one']
```
