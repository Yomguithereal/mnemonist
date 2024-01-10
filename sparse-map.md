---
layout: page
title: SparseMap
---

A `SparseMap` is a very time-efficient map structure used to associate arbitrary values to a range of unsigned integers. Note however that this structure can consume a lot of memory (it relies on two byte arrays having a length equal to the maximum integer you need to store).

Contrary to the [`BitSet`]({{ site.baseurl }}/bit-set), the `SparseMap` is very efficient if you need to iterate over the stored value or if you often need to clear the map.

If you don't need to associate values to your numbers, take a look to [`SparseSet`]({{ site.baseurl }}/sparse-set) instead.

```js
const SparseMap = require('mnemonist/sparse-map');
```

## Constructor

The `SparseMap` takes a maximum length to store as well as, optionally, a constructor for the array that will store the map's values. This can be useful when storing, say, small positive integers and you want to save memory.

```js
const map = new SparseMap(length);
```
```js
// If you know your values type:
const map = new SparseMap(Uint8Array, length);
```

## Members

* [#.length](#length)
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

### #.length

Length of the map, that is to say the maximum number one can expect to store in this set minus one.

```js
const map = new SparseMap(4);

map.length;
>>> 4
```

### #.size

Number of items currently in the map.

```js
const map = new SparseMap(4);

map.size;
>>> 0

map.add(2);

map.size;
>>> 1
```

### #.set

Associates a value to the given number in the map.

`O(1)`

```js
const map = new SparseMap(4);

map.set(2, 34);
map.get(2);
>>> 34
```

### #.delete

Deletes the given number from the map.

`O(1)`

```js
const map = new SparseMap(4);

map.set(2, 34);
map.delete(2);
map.has(2);
>>> false
```

### #.clear

Resets every number stored by the map.

```js
const map = new SparseMap(4);

map.set(1);
map.set(3);

map.clear();
map.size
>>> 0
```

### #.has

Returns whether the given number exists in the map.

`O(1)`

```js
const map = new SparseMap(4);

map.has(3);
>>> false

map.set(3, 34);
map.has(3);
>>> true
```

### #.get

Returns the value currently associated to the given number in the map.

```js
const map = new SparseMap(4);

map.get(3);
>>> undefined

map.set(3, 34);
map.get(3);
>>> 34
```


### #.forEach

Iterates over the map's entries.

```js
const map = new SparseMap(4);

map.set(1, 23);

map.forEach((value, key) => {
  console.log(key, value);
});
```

### #.keys

Returns an iterator over the map's keys.

```js
const map = new SparseMap(4);

map.set(2, 15);

const iterator = map.keys();

iteraror.next().value
>>> 2
```

### #.values

Returns an iterator over the set's values.

```js
const map = new SparseMap(4);

map.set(2, 15);

const iterator = map.values();

iteraror.next().value
>>> 15
```

### #.entries

Returns an iterator over the set's entries.

```js
const map = new SparseMap(4);

map.set(2, 15);

const iterator = map.entries();

iteraror.next().value
>>> [2, 15]
```

### Iterable

Alternatively, you can iterate over a map's entries using ES2015 `for...of` protocol:

```js
const map = new SparseMap(4);

for (const [key, value] of map) {
  console.log(key, value);
}
```
