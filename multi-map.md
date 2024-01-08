---
layout: page
title: MultiMap
---

A `MultiMap` is like a `Map` except it can store multiple values with the same key.

For more information about the MultiMap, you can head [here](https://en.wikipedia.org/wiki/Multimap).

```js
const MultiMap = require('mnemonist/multi-map');
```

## Constructor

The `MultiMap` takes an optional argument being the container to use. By default, the container is an array.

```js
const map = new MultiMap();
```
```js
// Using a set as container
const map = new MultiMap(Set);
```

### Static #.from

Alternatively, one can build a `MultiMap` from an arbitrary JavaScript iterable likewise:

```js
const map = MultiMap.from([1, 2, 3], container);
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
* [#.forEachAssociation](#foreachassociation)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [#.containers](#containers)
* [#.associations](#associations)
* [Iterable](#iterable)

### #.dimension

Number of containers stored by the map.

```js
const map = new MultiMap();

map.set('hello', 'world');

map.dimension
>>> 1
```

### #.size

Total number of items stored by the map.

```js
const map = new MultiMap();

map.set('J', 'John');
map.set('J', 'Jack');

map.dimension
>>> 1

map.size
>>> 2
```

### #.set

Adds an item to the multimap using the provided key.

`O(1)`

```js
const map = new MultiMap();

map.set(key, value);
```

### #.delete

Removes every items stored using the provided key.

`O(1)`

```js
const map = new MultiMap();

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

`O(1)` for Set containers.

`O(n)` for Array containers.

```js
const map = new MultiMap();

map.set('one', 'Hello');

map.remove('one', 'Hello');

map.get('one');
>>> undefined
```

### #.clear

Completely clears the multimap of every item.

```js
const map = new MultiMap();

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

`O(1)`

```js
const map = new MultiMap();

map.set('john', {name: 'John'});

map.has('john');
>>> true
```

### #.multiplicity

Returns the number of times the given key is set in the map. Or more simply said, the size of the hypothetical container stored for the given key.

`O(1)`

```js
const map = new MultiMap();

map.multiplicity('hello');
>>> 0

map.set('hello', 'world');
map.multiplicity('hello');
>>> 1
```

### #.get

Returns the container at the given key or `undefined`.

`O(1)`

```js
const map = new MultiMap();

map.set('john', {name: 'John'});

map.get('john');
>>> [{name: 'John'}]
```

### #.forEach

Iterates over each of the entries of the multimap.

```js
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

map.forEach((value, key) => {
  console.log(key, value);
});
>>> 'john', {name: 'John', surname: 'Doe'}
>>> 'john', {name: 'John', surname: 'Watson'}
```

### #.forEachAssociation

Iterates over each of the associations (key, container) of the multimap.

```js
const map = new Multimap();

map.set(1, 1);
map.set(1, 2);
map.set(2, 1);

map.forEachAssociation((container, key) => {
  console.log(key, container);
});
>>> 1, [1, 2]
>>> 2, [1]
```

### #.keys

Returns an iterator over the keys of the multimap.

```js
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

const iterator = map.keys();

iterator.next().value
>>> 'john'
```

### #.values

Returns an iterator over the values of the multimap.

```js
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

const iterator = map.values();

iterator.next().value
>>> {name: 'John', surname: 'Doe'}
```

### #.entries

Returns an iterator over the entries of the multimap.

```js
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

const iterator = map.entries();

iterator.next().value
>>> ['john', {name: 'John', surname: 'Doe'}]
```

### #.containers

Returns an iterator over the containers of the multimap.

```js
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

const iterator = map.containers();

iterator.next().value
>>> [
  {name: 'John', surname: 'Doe'},
  {name: 'John', surname: 'Watson'}
]
```

### #.associations

Returns an iterator over the associations (key, container) of the multimap.

```js
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

const iterator = map.associations();

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
const map = new MultiMap();

map.set('john', {name: 'John', surname: 'Doe'});
map.set('john', {name: 'John', surname: 'Watson'});

for (const entry of map) {
  console.log(entry);
}
```
