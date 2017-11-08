---
layout: page
title: Vector
---

The `Vector` is an abstract class representing a dynamic JavaScript typed array, such as the `Int32Array`.

As such, contrary to the normal byte array, the `Vector` is able to grow dynamically if required (typically at a *1.5* rate).

It is a very useful structure when you don't know the size of your typed array beforehand and is quite memory-efficient (typed arrays are really lean compared to an `Array` and you'll be able to store billions of entries while such an `Array` would crash your engine).

Also, dynamic arrays are faster than JavaScript's `Array` (else, all this would be pointless, no?).

Just keep in mind that even if a `Int8Vector` really is faster, a `Float64Vector` won't give you an edge because this is often how an `Array` containing number would be optimized under the hood by most JavaScript engines.

```js
var Vector = require('mnemonist/vector');
```

## Constructor

The `Vector` takes a typed array class as first argument and an initial capacity or alternatively more complex options as second argument.

```js
var vector = new Vector(ArrayClass, initialCapacity);

// If you need to pass options such as a custom growth policy
var vector = new Vector(ArrayClass, {
  initialCapacity: 10,
  initialLength: 3,
  policy: function(capacity) {
    return Math.ceil(capacity * 2.5);
  }
});

// Subclasses for each of JS typed array also exists as a convenience
var vector = new Vector.Int8Vector(initialCapacity);
var vector = new Vector.Uint8Vector(initialCapacity);
var vector = new Vector.Uint8Vector(initialCapacity);
var vector = new Vector.Int16Vector(initialCapacity);
var vector = new Vector.Uint16Vector(initialCapacity);
var vector = new Vector.Int32Vector(initialCapacity);
var vector = new Vector.Uint32Vector(initialCapacity);
var vector = new Vector.Float32Vector(initialCapacity);
var vector = new Vector.Float64Vector(initialCapacity);
```

## Members

* [#.array](#array)
* [#.capacity](#capacity)
* [#.length](#length)

## Methods

*Mutation*

* [#.grow](#grow)
* [#.set](#set)
* [#.pop](#pop)
* [#.push](#push)
* [#.reallocate](#reallocate)
* [#.resize](#resize)

*Read*

* [#.get](#get)

### #.array

The underlying typed array, if you need it for any reason (probably performance, in some precise use cases).

```js
var vector = new Vector(Uint8Array, 4);

vector.push(1);
vector.push(2);

vector.array
>>> [1, 2, 0, 0]

// BEWARE: don't keep a reference of this array
// it can be swapped by the implementation when growing!
var underlyingArray = vector.array;
// ^ this could result in unexpected behaviors
// if you expand the array later on
// Example:
vector.push(3);
vector.push(4);
vector.push(5);

underlyingArray;
>>> [1, 2, 3, 4]
vector.array
>>> [1, 2, 3, 4, 5, 0] // The underlying array has grown!
```

### #.capacity

Real length of the underlying array, i.e. the maximum number of items the array can hold before needing to resize. Not to be confused with [#.length](#length).

```js
var vector = new Vector(Uint8Array, 10);

vector.push(1);
vector.push(2);

vector.capacity
>>> 10
```

### #.length

Current length of the vector, that is to say the last set index plus one.

```js
var vector = new Vector(Uint8Array, 10);

vector.push(1);
vector.push(2);

vector.length
>>> 2
```

### #.grow

Applies the growing policy once and reallocates the underlying array.

If given a number, will run the growing policy until we attain a suitable capacity.

```js
var vector = new Vector(Uint8Array, 3);

vector.grow();

// Grow until we can store at least 100 items:
vector.grow(100);
```

### #.set

Sets the value at the given index.

```js
var vector = new Vector(Uint8Array, 2);

vector.set(1, 45);

vector.get(1);
>>> 45
```

### #.pop

Removes & returns the last value of the vector.

```js
var vector = new Vector(Uint8Array, 2);

vector.push(1);
vector.push(2);
vector.push(3);

vector.pop();
>>> 3
vector.length
>>> 2
```

### #.push

Pushes a new value in the vector.

```js
var vector = new Vector(Uint8Array, 2);

vector.push(1);
vector.push(2);
vector.push(3);
vector.push(4);

vector.length
>>> 4

vector.get(1);
>>> 2
```

### #.reallocate

Reallocates the underlying array and truncates length if needed.

```js
var vector = new Vector(Uint8Array, 3);

vector.reallocate(10);

vector.set(7, 3);

// This will truncate length
vector.reallocate(5);
```

### #.resize

Resize the vector's length. Will reallocate if current capacity is insufficient.

Note that it won't deallocate if the given length is inferior to the current one. You can use [#.reallocate](#reallocate) for that.

```js
var vector = new Vector(Uint8Array, {initialLength: 10});

vector.resize(5);
vector.length;
>>> 5
vector.capacity;
>>> 10

// This will reallocate
vector.resize(25);
vector.length;
>>> 25
vector.capacity;
>>> 25
```

### #.get

Retrieves the value stored at the given index.

```js
var vector = new Vector(Uint8Array, 2);

vector.push(1);
vector.push(2);
vector.push(3);
vector.push(4);

vector.get(1);
>>> 2
```
