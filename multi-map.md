---
layout: page
title: MultiMap
---

A `MultiMap` is like a `Map` except it can store multiple values with the same key.

For more information about the MultiMap, you can head [here](https://en.wikipedia.org/wiki/Multimap).

```js
var MultiMap = require('mnemonist/multi-map');
```

## Constructor

The `MultiMap` takes an optional argument being the container to use. By default, the container is an array.

```js
var map = new MultiMap();

// Using a set as container
var map = new MultiMap(Set);
```

### Static #.from

Alternatively, one can build a `MultiMap` from an arbitrary JavaScript iterable likewise:

```js
var map = MultiMap.from([1, 2, 3], container);
```

## Members

* [#.size](#size)
* [#.cardinality](#cardinality)

## Methods

*Mutation*

* [#.set](#set)
* [#.remove](#remove)
* [#.delete](#delete)
* [#.clear](#clear)

*Read*

* [#.has](#has)
* [#.get](#get)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [#.containers](#containers)
* [#.associations](#associations)
* [Iterable](#iterable)

### #.size

Number of containers stored by the map.

```js
var map = new MultiMap();

map.set('hello', 'world');

map.size
>>> 1
```

### #.cardinality

Total number of items stored by the map.

```js
var map = new MultiMap();

map.set('J', 'John');
map.set('J', 'Jack');

map.size
>>> 1

map.cardinality
>>> 2
```
