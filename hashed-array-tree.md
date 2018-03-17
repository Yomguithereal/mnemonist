---
layout: page
title: HashedArrayTree
---

The `HashedArrayTree` is an abstract class representing a JavaScript typed array, such as the `Int32Array`, but able to grow dynamically.

```js
var HashedArrayTree = require('mnemonist/hashed-array-tree');
```

## Constructor

The `HashedArrayTree` takes a typed array class as first argument and an initial length or alternatively more complex options as second argument.

```js
var array = new HashedArrayTree(ArrayClass, initialCapacity);

// If you need to pass options such as a custom block size
var array = new HashedArrayTree(ArrayClass, {
  initialCapacity: 10,
  initialLength: 3,
  blockSize: 8 // Defaults to 1024. Must be a power of two!
});
```

## Members

* [#.blockSize](#blocksize)
* [#.capacity](#capacity)
* [#.length](#length)

## Methods

*Mutation*

* [#.grow](#grow)
* [#.set](#set)
* [#.pop](#pop)
* [#.push](#push)
* [#.resize](#resize)

*Read*

* [#.get](#get)

### #.blockSize

Size of the byte array blocks.

```js
var array = new HashedArrayTree(Uint8Array);

array.blockSize;
>>> 1024
```

### #.capacity

Number of items the array can accomodate without needing to add further blocks.

```js
var array = new HashedArrayTree(Uint8Array);

array.push(1);
array.push(2);

array.capacity
>>> 1024
```

### #.length

Current length of the array, that is to say the last set index plus one.

```js
var array = new HashedArrayTree(Uint8Array);

array.push(1);
array.push(2);

array.length
>>> 2
```

### #.grow

Add a single block to the array.

If given a number, will add as many new blocks as needed to accomodate target capacity.

```js
var array = new HashedArrayTree(Uint8Array, {blockSize: 8});

array.grow();
array.capacity;
>>> 8

// Grow until we can store at least 70 items:
array.grow(80);
array.capacity;
>>> 72
```

### #.set

Sets the value at the given index.

`O(1)`

```js
var array = new HashedArrayTree(Uint8Array, 2);

array.set(1, 45);

array.get(1);
>>> 45
```

### #.pop

Removes & returns the last value of the array.

`O(1)`

```js
var array = new HashedArrayTree(Uint8Array);

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

`O(1) amortized`

```js
var array = new HashedArrayTree(Uint8Array);

array.push(1);
array.push(2);
array.push(3);
array.push(4);

array.length
>>> 4

array.get(1);
>>> 2
```

### #.resize

Resize the array's length. Will add new blocks if current blocks are insufficient.

Note that it won't deallocate anything would the given length be inferior to the current one.

```js
var array = new HashedArrayTree(Uint8Array, {initialLength: 10, blockSize: 8});

array.resize(5);
array.length;
>>> 5
array.capacity;
>>> 8

// This will reallocate
array.resize(25);
array.length;
>>> 25
array.capacity;
>>> 32
```

### #.get

Retrieves the value stored at the given index.

`O(1)`

```js
var array = new HashedArrayTree(Uint8Array);

array.push(1);
array.push(2);
array.push(3);
array.push(4);

array.get(1);
>>> 2
```
