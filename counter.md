---
layout: page
title: Counter
---

A `Counter` is a `Set` in which one may add the same items multiple times.

A `Counter` is therefore able to count the occurrences of each inserted items & this is probably its most used feature.

The `Counter` is widely inspired by python's [`counter`](https://docs.python.org/2/library/collections.html#collections.Counter) which is basically a slight variation over a [`MultiSet`]({{ site.baseurl }}/multi-set).

```js
var Counter = require('mnemonist/counter');
```

## Members

* [#.size](#size)
* [#.sum](#sum)

## Methods

*Mutation*

* [#.add](#add)
* [#.set](#set)
* [#.remove](#remove)
* [#.delete](#delete)
* [#.clear](#clear)

*Read*

* [#.count](#count)
* [#.has](#has)

*Iteration*

TODO: document here

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.size

Number of distinct items in the counter.

```js
var counter = new Counter();
counter.add('Hello');
counter.add('Hello');

counter.size
>>> 1
```

### #.sum

Total number of items in the counter

```js
var counter = new Counter();
counter.distinctSize
>>> 0
```

### #.add

Adds an item to the counter. You can optionally provide a count.

```js
var counter = new Counter();
counter.add('Hello');
counter.add('Hello', 4);

counter.count('Hello');
>>> 5
```

### #.set

Set the number of occurrences of the given item in the counter.

```js
var counter = new Counter();
counter.add('Hello');
counter.add('Hello');

counter.set('Hello', 34);

counter.count('Hello');
>>> 34
```

### #.remove

Removes a single occurrence of the given item from the counter.

```js
var counter = new Counter();
counter.add('Hello', 2);

counter.remove('Hello');

counter.count('Hello');
>>> 1
```

### #.delete

Completely removes the given item from the counter.

```js
var counter = new Counter();
counter.add('Hello', 2);

counter.delete('Hello');

counter.has('Hello');
>>> false
```

### #.clear

Completely clears the counter.

```js
var counter = new Counter();
counter.add('Hello');

counter.clear();

counter.size;
>>> 0
```

### #.count

Count the occurrences of the given item in the counter.

```js
var counter = new Counter();
counter.add('Hello');

counter.count('Hello');
>>> 1

counter.count('World');
>>> 0
```

### #.has

Returns whether the given item is present from the counter.

```js
var counter = new Counter();
counter.add('Hello', 2);

counter.has('Hello');
>>> true
```

