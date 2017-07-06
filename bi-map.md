---
layout: page
title: BiMap
---

A `BiMap` is a an invertible map where, as in a usual `Map`, it's easy to get value from key but also, and this is the main perk of the `BiMap`, trace back from value to key.

This means, however, that the BiMap needs to ensure that some constraints are respected to remain a bijection.

So, here are the three conflicting cases you need to keep in mind:

1. If the `{A,B}` relation exists in the `BiMap` and you add the `{A,C}` relation, you will delete the former one (value conflict).
2. If the `{A,B}` relation exists in the `BiMap` and you add the `{C,B}` one, you will delete the former one (key conflict).
3. If the `{A,B}` and `{C,D}` relation exists in the `BiMap` and you add the `{A,D}` one, you will delete both former ones (both key & value conflict).

```js
var BiMap = require('mnemonist/bi-map');
```

## Constructor

```js
var map = new BiMap();
```

### Static #.from

Alternatively, one can build a `BiMap` from an arbitrary JavaScript iterable likewise:

```js
var map = BiMap.from({one: 'hello', two: 'world'});
```

## Members

* [#.inverse](#inverse)
* [#.size](#size)

## Methods

*Mutation*

* [#.set](#set)
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
* [Iterable](#iterable)

### #.inverse

You can access the inverse map through this member.

```js
var map = new BiMap();

map.set('one', 'hello');
map.inverse.get('hello');
>>> 'one'
```

### #.size

Total number of items stored by the map.

```js
var map = new BiMap();

map.set('one', 'hello');

map.size
>>> 1
```

### #.set

Creates a relation in the bimap between key and value.

```js
var map = new BiMap();

map.set(key, item);
```

### #.delete

Removes the relation associated with the given key.

```js
var map = new BiMap();

map.set('one', 'hello');

map.delete('one');
map.size
>>> 0
```

### #.clear

Completely clears the bimap of its relations.

```js
var map = new BiMap();

map.set('one', 'hello');
map.set('two', 'world');

map.clear();

map.size
>>> 0
```

### #.has

Returns whether the map has the given key.

```js
var map = new BiMap();

map.set('one', 'hello');

map.has('one');
>>> true
```

### #.get

Returns the value stored at the given key.

```js
var map = new BiMap();

map.set('one', 'hello');

map.get('one');
>>> 'hello'
```

### #.forEach

Iterates over each of the entries of the bimap.

```js
var map = new BiMap();

map.set('one', 'hello');
map.set('two', 'world');

map.forEach(function(value, key) {
  console.log(key, value);
});
>>> 'one', 'hello'
>>> 'two', 'world'
```

### #.keys

Returns an iterator over the keys of the bimap.

```js
var map = new BiMap();

map.set('one', 'hello');
map.set('two', 'world');

var iterator = map.keys();

iterator.next().value
>>> 'one'
```

### #.values

Returns an iterator over the values of the bimap.

```js
var map = new BiMap();

map.set('one', 'hello');
map.set('two', 'world');

var iterator = map.values();

iterator.next().value
>>> 'hello'
```

### #.entries

Returns an iterator over the entries of the bimap.

```js
var map = new BiMap();

map.set('one', 'hello');
map.set('two', 'world');

var iterator = map.entries();

iterator.next().value
>>> ['one', 'hello']
```

### Iterable

Alternatively, you can iterate over a list's entries using ES2015 `for...of` protocol:

```js
var map = new BiMap();

map.set('one', 'hello');
map.set('two', 'world');

for (var entry of map) {
  console.log(entry);
}
```
