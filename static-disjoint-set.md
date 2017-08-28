---
layout: page
title: StaticDisjointSet
---

A `StaticDisjointSet` is a structure representing sets of sets using the "union-find" technique.

This implementation is static because it works on a range of indices starting from 0 and going up to a fixed size given at instantiation time.

It is however a very memory-efficient way to solve some issues such as finding connected components in a graph.


```js
var StaticDisjointSet = require('mnemonist/static-disjoint-set');
```

## Constructor

The `StaticDisjointSet` takes an initial size at instantiation time (i.e. the total number of items we are going to handle, the number of nodes in your graph, for instance).

```js
var sets = new StaticDisjointSet(size);
```

## Members

* [#.dimension](#dimension)
* [#.size](#size)

## Methods

*Mutation*

* [#.union](#add)

*Read*

* [#.compile](#compile)
* [#.find](#find)
* [#.mapping](#mapping)

### #.dimension

Total number of sets known by the disjoint set (obviously less than or equal to the size).

```js
var sets = new StaticDisjointSet(4);

sets.union(1, 2);
sets.union(1, 3);

set.size;
>>> 4
set.dimension;
>>> 2
```

### #.size

Total number of stored items.

```js
var sets = new StaticDisjointSet(4);

set.size;
>>> 4
```

### #.union

`O(1)` or `O(α(n))` to be exact.

Perform the union of two items. If they belong to different sets, their respective sets will be merged into a single one.

```js
var sets = new StaticDisjointSet(4);

sets.union(1, 2);
sets.union(1, 3);
```

### #.compile

`O(n)` or `O(n α(n))` to be exact.

Compile the disjoint sets into an array of arrays.

```js
var sets = new StaticDisjointSet(4);

sets.union(1, 2);
sets.union(1, 3);

sets.compile();
>>> [[0], [1, 2, 3]]
```


### #.find

`O(1)` or `O(α(n))` to be exact.

Returns the root item of the given item's current set.

```js
var sets = new StaticDisjointSet(4);

sets.union(1, 2);
sets.union(1, 3);

sets.find(2);
>>> 1
```

### #.mapping

`O(n)` or `O(n α(n))` to be exact.

Returns an array whose values are the id of the item's set.

```js
var sets = new StaticDisjointSet(4);

sets.union(1, 2);
sets.union(1, 3);

sets.mapping();
>>> [0, 1, 1, 1]
```
