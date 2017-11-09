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

* [#.dimension](#dimension)
* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.set](#set)
* [#.remove](#remove)
* [#.delete](#delete)
* [#.edit](#edit)
* [#.clear](#clear)

*Read*

* [#.frequency](#frequency)
* [#.has](#has)
* [#.get](#get)
* [#.multiplicity](#multiplicity)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.multiplicities](#multiplicities)
* [Iterable](#iterable)

### #.dimension

Number of distinct items in the set.

```js
var set = new MultiSet();

set.add('hello');
set.add('hello');

set.dimension
>>> 1
```

### #.size

Total number of items in the set.

```js
var set = new MultiSet();

set.add('hello');
set.add('hello');

set.size
>>> 2
```

### #.add

Adds the item to the set. Optionally, you can provide a number which is the number of times the same item is added.

Adding an item 0 times is a no-op.

Adding an item a negative number of times will remove items.

```js
var set = new MultiSet();

set.add('hello');

// Adding "hello" more than once
set.add('hello', 3);
```

### #.set

Sets the multiplicity of an item in the set.

Setting the multiplicity of an item to be 0 or a negative number will remove said item from the set.

```js
var set = new MultiSet();

set.set('hello', 4);
set.multiplicity('hello');
>>> 4
```

### #.remove

Removes the item from the set once. Optionally, you can provide a number which is the number of times the same item is removed.

Removing an item 0 times is a no-op.

Removing an item a negative number of times will add items.

```js
var set = new MultiSet();

set.add('hello', 3);

set.remove('hello');
set.multiplicity('hello');
>>> 2

set.remove('hello', 2);
set.multiplicity('hello');
>>> 0
```

### #.delete

Removes all the occurrences of the given item from the set.

```js
var set = new MultiSet();

set.add('hello');
set.add('hello');

set.delete('hello');
set.multiplicity('hello');
>>> 0
```

### #.edit

Edit an item to become another one. If the item does not exist in the set, this will do nothing. If target item already exist in the set, multiplicities will be merged.

```js
var set = new MultiSet();

set.add('a');
set.add('b');

set.edit('a', 'c'); // 'a' becomes 'c' in the set
set.has('a');
>>> false

set.edit('c', 'b'); // 'c' becomes 'b', totalling 2 occurrences
set.has('c');
>>> false
set.multiplicity('b');
>>> 2
```

### #.clear

Completly clears the set of all its items.

```js
var set = new MultiSet();

set.add('hello');
set.clear();

set.size
>>> 0
```

### #.frequency

Returns the frequency of the given item in the set.

```js
var set = new MultiSet();

set.add('apple', 5);
set.add('pear', 2);
set.add('melon', 3);

set.frequency('apple');
>>> 0.5
```

### #.has

Returns whether the given item is found in the set.

```js
var set = new MultiSet();

set.add('hello');
set.has('hello');
>>> true

set.has('world');
>>> false
```

### #.get

Same as [#.multiplicity](#multiplicity) below.

### #.multiplicity

Returns the number of times the given item is found in the set.

```js
var set = new MultiSet();

set.add('hello');
set.multiplicity('hello');
>>> 1
```

### #.forEach

Iterates over each of the items stored by the set.

```js
var set = new MultiSet();

set.add('hello');
set.add('hello');

set.forEach(function(value) {
  console.log(value);
});
>>> 'hello'
>>> 'hello'
```

### #.keys

Returns an iterator over the set's keys, i.e. the set's unique values.

```js
var set = new MultiSet();

set.add('hello', 4);
set.add('world', 5);

var iterator = set.keys();

iterator.next().value
>>> 'hello'
iterator.next().value
>>> 'world'
```

### #.values

Returns an iterator over the set's repeated values.

```js
var set = new MultiSet();

set.add('hello', 2);
set.add('world');

var iterator = set.values();

iterator.next().value
>>> 'hello'
iterator.next().value
>>> 'hello'
```

### #.multiplicities

Returns an iterator over the set's multiplicities.

```js
var set = new MultiSet();

set.add('hello');
set.add('hello');

var iterator = set.multiplicities();

iterator.next().value
>>> ['hello', 2]
```

### Iterable

Alternatively, you can iterate over a set's values using ES2015 `for...of` protocol:

```js
var set = new MultiSet();

set.add('hello');
set.add('hello');

for (var value of set) {
  console.log(value);
}
```
