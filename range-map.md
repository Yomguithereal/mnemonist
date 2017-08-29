---
layout: page
title: RangeMap
---

A `RangeMap` is an helpful utility class mapping arbitrary keys to a growing range of integers.

It's often useful when one needs to map unknown keys unto array indices.

```js
var RangeMap = require('mnemonist/range-map');
```

## Constructor

The `RangeMap` may take, as single argument, some options such as the size of the range's steps and an initial offset.

```js
var map = new RangeMap();

// If you need a range starting from 1 and making steps of 2
var map = new RangeMap({offset: 1, step: 2});
```

### Static #.from

Alternatively, one can build a `RangeMap` from an arbitrary JavaScript iterable likewise:

```js
var list = RangeMap.from(['one', 'two', 'three']);

// Alternatively, if you know your iterable will yield distinct values,
// you can use #.fromDistinct which is more performant
var list = RangeMap.fromDistinct(['one', 'two', 'three']);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.clear](#clear)

*Read*

* [#.get](#get)
* [#.has](#has)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.size

Number of keys stored by the map.

```js
var map = new RangeMap();
map.size
>>> 0

map.add('one');
map.size
>>> 1
```

### #.add

Maps a key to a range's integer.

```js
var map = new RangeMap();

map.add('hello');
map.get('hello');
>>> 0
```

### #.clear

Completely clears the map.

```js
var map = new RangeMap();

map.add('hello');
map.clear();

map.size;
>>> 0
```

### #.get

Retrieves the desired key's mapped integer in the map's range.

```js
var map = new RangeMap();

map.add('hello');

map.get('hello');
>>> 0
```

### #.has

Returns whether the desired key is mapped to a range integer.

```js
var map = new RangeMap();

map.add('hello');

map.has('hello');
>>> true
map.has('world');
>>> false
```

### #.forEach

Iterates over the map's range.

```js
var map = new RangeMap();

map.add('hello');
map.add('world');

map.forEach(function(index, key) {
  console.log(`${key} is mapped to ${index}`);
});
```

### #.keys

Returns an iterator over the map's keys.

```js
var map = new RangeMap();

map.add('hello');
map.add('world');

var iterator = map.keys();

iterator.next().value
>>> 'hello'
```

### #.values

Returns an iterator over the map's values, i.e. the range's integers.

```js
var map = new RangeMap();

map.add('hello');
map.add('world');

var iterator = map.values();

iterator.next().value
>>> 0
```

### #.entries

Returns an iterator over the map's entries.

```js
var map = new RangeMap();

map.add('hello');
map.add('world');

var iterator = map.entries();

iterator.next().value
>>> ['hello', 0]
```

### Iterable

Alternatively, you can iterate over a range map's entries using ES2015 `for...of` protocol:

```js
var map = new RangeMap();

map.add('hello');
map.add('world');

for (var [key, index] of map) {
  console.log(key, index);
}
```
