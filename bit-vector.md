---
layout: page
title: BitVector
---

The `BitVector` is the same thing as the [`BitSet`]({{ site.baseurl }}/bit-set), except it can grow dynamically if required.

```js
const BitVector = require('mnemonist/bit-set');
```

## Constructor

```js
const vector = new BitVector(length);
```

## Members

* [#.array](#array)
* [#.capacity](#capacity)
* [#.length](#length)
* [#.size](#size)

## Methods

*Mutation*

* [#.grow](#grow)
* [#.pop](#pop)
* [#.push](#push)
* [#.set](#set)
* [#.reallocate](#reallocate)
* [#.reset](#reset)
* [#.resize](#resize)
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
const vector = new BitVector(19);

vector.array;
>>> Uint8Array [0, 0, 0]
```

### #.capacity

Number of bits that can be stored by the vector before needing to reallocate memory.

Note that since bits are stored on the bytes of a `Uint32Array`, capacity will snap at the nearest multiple of 32.

```js
const vector = new BitVector(53);

vector.capacity
>>> 64
```

### #.length

Length of the set, that is to say the number of bits stored by the vector.

```js
const vector = new BitVector(4);

vector.length;
>>> 4
```

### #.size

Number of bits set, that is to say the total number of ones stored by the vector.

```js
const vector = new BitVector(4);

vector.size;
>>> 0

vector.flip(2);

vector.size;
>>> 1
```

### #.grow

Applies the growing policy once and reallocates the underlying vector.

If given a number, will run the growing policy until we attain a suitable capacity.

```js
const vector = new BitVector();

vector.grow();

// Grow until we can store at least 100 items:
vector.grow(100);
```

### #.pop

Removes the last value from the vector and returns it.

Note that this method won't deallocate memory. You can use [#.reallocate](#reallocate) for that.

`O(1)`

```js
const vector = new BitVector();

vector.push(1);
vector.push(1);

vector.pop();
>>> 1
```

### #.push

Push a bit into the vector.

`O(1) amortized`

```js
const vector = new BitVector();

vector.push(1);
vector.push(false);
```

### #.set

Sets the bit at the given index. Optionally you can indicate the bit's value (`0`, `1`, `true` or `false`).

`O(1)`

```js
const vector = new BitVector(4);

vector.set(3);
vector.test(3);
>>> true

vector.set(3, false);
vector.test(3);
>>> false
```

### #.reallocate

Reallocates the underlying array and truncates length if needed.

```js
const vector = new BitVector();

vector.reallocate(75);

vector.set(7);

// This will truncate length
vector.reallocate(23);
```

### #.reset

Resets the bit at the given index, meaning setting it to `0`.

`O(1)`

```js
const vector = new BitVector(4);

vector.set(3);
vector.reset(3);
vector.test(3);
>>> false
```

### #.resize

Resize the vector's length. Will reallocate if current capacity is insufficient.

Note that it won't deallocate if the given length is inferior to the current one. You can use [#.reallocate](#reallocate) for that.

```js
const vector = new BitVector(10);

vector.resize(5);
vector.length;
>>> 5
vector.capacity;
>>> 32

// This will reallocate
vector.resize(45);
vector.length;
>>> 45
vector.capacity;
>>> 64
```

### #.flip

Toggles the bit at the given index.

`O(1)`

```js
const vector = new BitVector(4);

vector.flip(3);
vector.test(3);
>>> true
vector.flip(3)
vector.test(3);
>>> false
```

### #.clear

Resets every bit stored by the vector.

```js
const vector = new BitVector(4);

vector.set(1);
vector.set(3);

vector.clear();
vector.size
>>> 0
```

### #.get

Returns the bit at the given index.

`O(1)`

```js
const vector = new BitVector(4);

vector.set(1);

vector.get(1);
>>> 1

vector.get(3);
>>> 0
```

### #.rank

Returns the number of bits set to 1 up to (but not including) the provided index.

`O(i)`, i being the provided index.

```js
const vector = new BitVector(4);

vector.set(1);
vector.set(2);

vector.rank(1);
>>> 0
vector.rank(3);
>>> 2
```

### #.select

Returns the index of the nth bit set to 1 in the vector.

`O(n)`

```js
const vector = new BitVector(4);

vector.set(0);
vector.set(2);

vector.select(1);
>>> 0
vector.select(2);
>>> 2
```

### #.test

Test the bit at the given index, returning a boolean.

`O(1)`

```js
const vector = new BitVector(4);

vector.set(1);

vector.test(1);
>>> true

vector.test(3);
>>> false
```

### #.forEach

Iterates over the set's bits.

```js
const vector = new BitVector(4);

vector.set(1);

vector.forEach(function(bit, i) {
  console.log(bit, i);
});
```

### #.values

Returns an iterator over the set's values.

```js
const vector = new BitVector(4);

vector.set(1);

const iterator = vector.values()

iteraror.next().value
>>> 0
```

### #.entries

Returns an iterator over the set's entries.

```js
const vector = new BitVector(4);

vector.set(0);

const iterator = vector.entries()

iteraror.next().value
>>> [0, 1]

iterator.next().value
>>> [1, 0]
```

### Iterable

Alternatively, you can iterate over a set's values using ES2015 `for...of` protocol:

```js
const vector = new BitVector(4);

for (const bit of vector) {
  console.log(bit);
}
```
