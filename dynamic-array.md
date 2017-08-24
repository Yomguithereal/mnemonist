---
layout: page
title: DynamicArray
---

The `DynamicArray` is an abstract class representing a JavaScript typed arra, ysuch as the `Int32Array`, that can grow dynamically (at a typical *1.5* rate).

It is a very useful structure when you don't know the size of your typed array beforehand and is quite memory-efficient (typed arrays are really lean compared to an `Array` and you'll be able to store billions of entries while such an `Array` would crash your engine).

Also, dynamic arrays are faster than JavaScript's `Array` (else, all this would be pointless, no?).

Just keep in mind that even if a `DynamicInt8Array` really is faster, a `DynamicFloat64Array` won't give you a large edge because this is often how an `Array` containing number would be optimized under the hood by JavaScript engines.

```js
var DynamicArray = require('mnemonist/dynamic-array');
```

## Constructor

The `DynamicArray` takes a typed array class as first argument and an initial size or alternatively more complex options as second argument.

```js
var array = new DynamicArray(ArrayClass, initialSize);

// If you need to pass options such as a custom growth policy
var array = new DynamicArray(ArrayClass, {
  initialSize: 10,
  policy: function(allocated) {
    return Math.ceil(allocated * 2.5);
  }
});

// Subclass for each of JS typed array also exists as a convenience
var array = new DynamicArray.DynamicInt8Array(initialSize);
var array = new DynamicArray.DynamicUint8Array(initialSize);
var array = new DynamicArray.DynamicUint8ClampedArray(initialSize);
var array = new DynamicArray.DynamicInt16Array(initialSize);
var array = new DynamicArray.DynamicUint16Array(initialSize);
var array = new DynamicArray.DynamicInt32Array(initialSize);
var array = new DynamicArray.DynamicUint32Array(initialSize);
var array = new DynamicArray.DynamicFloat32Array(initialSize);
var array = new DynamicArray.DynamicFloat64Array(initialSize);
```

## Members

* [#.allocated](#allocated)
* [#.array](#array)
* [#.length](#length)

## Methods

*Mutation*

* [#.set](#set)
* [#.pop](#pop)
* [#.push](#push)

*Read*

* [#.get](#get)

### #.allocated

Real length of the underlying array. Not to be confused with [#.length](#length).

```js
var array = new DynamicArray(Uint8Array, 10);

array.push(1);
array.push(2);

array.allocated
>>> 10
```

### #.array

The underlying typed array, if you need it for any reason.

```js
var array = new DynamicArray(Uint8Array, 4);

array.push(1);
array.push(2);

array.array
>>> [1, 2, 0, 0]

// BEWARE: don't keep a reference of this array
// it can be swapped by the implementation when growing!
var underlyingArray = array.array;
// ^ this could result in unexpected behaviors
// if you expand the array later on
// Example:
array.push(3);
array.push(4);
array.push(5);

underlyingArray;
>>> [1, 2, 3, 4]
array.array
>>> [1, 2, 3, 4, 5, 0] // The underlying array has grown!
```

### #.length

Current length of the array, that is to say the last allocated index plus one.

```js
var array = new DynamicArray(Uint8Array, 10);

array.push(1);
array.push(2);

array.length
>>> 2
```

### #.set

Sets the value at the given index.

```js
var array = new DynamicArray(Uint8Array, 2);

array.set(1, 45);

array.get(1);
>>> 45
```

### #.pop

Removes & returns the last value of the array.

```js
var array = new DynamicArray(Uint8Array, 2);

array.push(1);
array.push(2);
array.push(3);

array.pop();
>>> 3
array.length
>>> 2
```

### #.push

Pushes a new value in the array.

```js
var array = new DynamicArray(Uint8Array, 2);

array.push(1);
array.push(2);
array.push(3);
array.push(4);

array.length
>>> 4

array.get(1);
>>> 2
```

### #.get

Retrieves the value stored at the given index.

```js
var array = new DynamicArray(Uint8Array, 2);

array.push(1);
array.push(2);
array.push(3);
array.push(4);

array.get(1);
>>> 2
```
