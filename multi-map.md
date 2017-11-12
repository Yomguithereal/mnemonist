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

* [#.dimension](#dimension)
* [#.size](#size)

## Methods

*Mutation*

* [#.set](#set)
* [#.delete](#delete)
* [#.remove](#remove)
* [#.clear](#clear)

*Read*

* [#.count](#count)
* [#.has](#has)
* [#.get](#get)
* [#.multiplicity](#multiplicity)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [#.containers](#containers)
* [#.associations](#associations)
* [Iterable](#iterable)

### #.dimension

Number of containers stored by the map.

```js
var map = new MultiMap();

map.set('hello', 'world');

map.dimension
>>> 1
```

### #.size

Total number of items stored by the map.

```js
var map = new MultiMap();

map.set('J', 'John');
map.set('J', 'Jack');

map.dimension
>>> 1

map.size
>>> 2
```

### #.set

Adds an item to the multimap using the provided key.

```js
var map = new MultiMap();

map.set(key, value);
```

### #.delete

Removes every items stored using the provided key.

```js
var map = new MultiMap();

map.set('J', 'John');
map.set('J', 'Jack');

map.get('J');
>>> ['John', 'Jack']

map.delete('J');
map.get('J');
>>> []
```

### #.remove

Removes a value from the container stored at the provided key.

Note that it will remove only one such value from array-like containers.

```js
var map = new MultiMap();

map.set('one', 'Hello');

map.remove('one', 'Hello');

map.get('one');
>>> undefined
```

### #.clear

Completely clears the multimap of every item.

```js
var map = new MultiMap();

map.set('J', 'John');
map.set('J', 'Jack');

map.clear();

map.size
>>> 0
```

### #.count

Same as [#.multiplicity](#multiplicity) below.

### #.has

Returns whether the map holds a container at the given key.

```js
var map = new MultiMap();

map.set('john', {name: 'John'});

map.has('john');
>>> true
```

### #.multiplicity

Returns the number of times the given key is set in the map. Or more simply said, the size of the hypothetical container stored for the given key.

```js
var map = new MultiMap();

map.multiplicity('hello');
>>> 0

map.set('hello', 'world');
map.multiplicity('hello');
>>> 0
```

### #.get

Returns the container at the given key or `undefined`.

```js
var map = new MultiMap();

map.set('john', {name: 'John'});

map.get('john');
>>> [{name: 'John'}]
```

### #.forEach

Iterates over each of the entries of the multimap.

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

map.forEach(function(value, key) {
  console.log(key, value);
});
>>> 'john', {name: 'John', surname: 'Doe'}
>>> 'john', {name: 'John', surname: 'Watson'}
```

### #.keys

Returns an iterator over the keys of the multimap.

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

var iterator = map.keys();

iterator.next().value
>>> 'john'
```

### #.values

Returns an iterator over the values of the multimap.

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

var iterator = map.values();

iterator.next().value
>>> {name: 'John', surname: 'Doe'}
```

### #.entries

Returns an iterator over the entries of the multimap.

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

var iterator = map.entries();

iterator.next().value
>>> ['john', {name: 'John', surname: 'Doe'}]
```

### #.containers

Returns an iterator over the containers of the multimap.

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

var iterator = map.containers();

iterator.next().value
>>> [
  {name: 'John', surname: 'Doe'},
  {name: 'John', surname: 'Watson'}
]
```

### #.associations

Returns an iterator over the associations (key, container) of the multimap.

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

var iterator = map.associations();

iterator.next().value
>>> [
  'john',
  [
    {name: 'John', surname: 'Doe'},
    {name: 'John', surname: 'Watson'}
  ]
]
```

### Iterable

Alternatively, you can iterate over a list's entries using ES2015 `for...of` protocol:

```js
var map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

for (var entry of map) {
  console.log(entry);
}
```
