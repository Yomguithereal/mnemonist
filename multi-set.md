---
layout: page
title: MultiSet
---

A `MultiSet` is like a `Set` excepts it is able to store items more than once and is therefore able to count them.

For more information about the MultiSet, you can head [here](https://en.wikipedia.org/wiki/Multiset).

```js
var MultiSet = require('mnemonist/multi-set');
```

## Constructor

The `MultiSet` takes no argument.

### Static #.from

Alternatively, one can build a `MultiSet` from an arbitrary JavaScript iterable likewise:

```js
var set = MultiSet.from([1, 2, 3]);
```

## Members

* [#.size](#size)
* [#.cardinality](#cardinality)

## Methods

*Mutation*

* [#.add](#add)
* [#.remove](#remove)
* [#.delete](#delete)
* [#.clear](#clear)

*Read*

* [#.has](#has)
* [#.multiplicity](#multiplicity)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [#.multiplicities](#multiplicities)
* [Iterable](#iterable)

### #.size

Number of containers stored by the set.

```js
var set = new MultiSet();

set.set('hello');

set.size
>>> 1
```

### #.cardinality

Total number of items stored by the set.

```js
var set = new MultiSet();

set.add('John');
set.add('John');

set.size
>>> 1

set.cardinality
>>> 2
```
