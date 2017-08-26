---
layout: page
title: BitSet
---

A `BitSet` is a fixed-size bit array implemented over a regular `Uint32Array`. It's a really memory-efficient way to store set information or series of flags.


```js
var BitSet = require('mnemonist/bit-set');
```

## Constructor

```js
var set = new BitSet(length);
```

## Members

* [#.array](#array)
* [#.length](#length)
* [#.size](#size)

## Methods

*Mutation*

* [#.set](#set)
* [#.reset](#reset)
* [#.flip](#flip)
* [#.clear](#clear)

*Read*

* [#.get](#get)
* [#.rank](#rank)
* [#.select](#select)
* [#.test](#test)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.array

The underlying `Uint8Array`.

```js
var set = new BitSet(19);

set.array;
>>> Uint8Array [0, 0, 0]
```

### #.length

Length of the set, that is to say the number of bits stored by the set.

```js
var set = new BitSet(4);

set.length;
>>> 4
```

### #.size

Number of bits set, that is to say the total number of ones stored by the set.

```js
var set = new BitSet(4);

set.size;
>>> 0

set.flip(2);

set.size;
>>> 1
```

### #.set

Sets the bit at the given index. Optionally you can indicate (`0` or `1` obviously, or a boolean value).

```js
var set = new BitSet(4);

set.set(3);
set.test(3);
>>> true

set.set(3, 0);
set.test(3);
>>> false
```

### #.reset

Resets the bit at the given index, meaning setting it to `0`.

```js
var set = new BitSet(4);

set.set(3);
set.reset(3);
set.test(3);
>>> false
```

### #.flip

Toggles the bit at the given index.

```js
var set = new BitSet(4);

set.flip(3);
set.test(3);
>>> true
set.flip(3)
set.test(3);
>>> false
```

### #.clear

Resets every bit stored by the set.

```js
var set = new BitSet(4);

set.set(1);
set.set(3);

set.clear();
set.size
>>> 0
```

### #.get

Returns the bit at the given index.

```js
var set = new BitSet(4);

set.set(1);

set.get(1);
>>> 1

set.get(3);
>>> 0
```

### #.rank

Returns the number of bits set to 1 up to (but not including) the provided index.

```js
var set = new BitSet(4);

set.set(1);
set.set(2);

set.rank(1);
>>> 0
set.rank(3);
>>> 2
```

### #.select

Returns the index of the nth bit set to 1 in the set.

```js
var set = new BitSet(4);

set.set(0);
set.set(2);

set.select(1);
>>> 0
set.select(2);
>>> 2
```

### #.test

Test the bit at the given index, returning a boolean.

```js
var set = new BitSet(4);

set.set(1);

set.test(1);
>>> true

set.test(3);
>>> false
```

### #.forEach

Iterates over the set's bits.

```js
var set = new BitSet(4);

set.set(1);

set.forEach(function(bit, i) {
  console.log(bit, i);
});
```

### #.values

Returns an iterator over the set's values.

```js
var set = new BitSet(4);

set.set(1);

var iterator = set.values()

iteraror.next().value
>>> 0
```

### #.entries

Returns an iterator over the set's entries.

```js
var set = new BitSet(4);

set.set(0);

var iterator = set.entries()

iteraror.next().value
>>> [0, 1]

iterator.next().value
>>> [1, 0]
```

### Iterable

Alternatively, you can iterate over a set's values using ES2015 `for...of` protocol:

```js
var set = new BitSet(4);

for (var bit of set) {
  console.log(bit);
}
```
