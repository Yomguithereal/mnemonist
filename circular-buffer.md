---
layout: page
title: Circular Buffer
---

The `CircularBuffer` is a buffer with a fixed capacity that can be used both as a LIFO or FIFO list very efficiently.

As such, it is mainly used as a fixed capacity [`Queue`]({{ site.baseurl }}/queue).

For more information about the circular buffer, you can head [here](https://en.wikipedia.org/wiki/Circular_buffer).

```js
var CircularBuffer = require('mnemonist/circular-buffer');
```

## Constructor

The `CircularBuffer` takes two arguments: a array class to use, and the desired capacity.

```js
var buffer = new CircularBuffer(Array, 10);

// Using byte arrays
var buffer = new CircularBuffer(Int8Array, 10);
```

### Static #.from

Alternatively, one can build a `CircularBuffer` from an arbitrary JavaScript iterable likewise:

```js
// Attempting the guess the given iterable's length/size
var buffer = CircularBuffer.from([1, 2, 3], Int8Array);

// Providing the desired capacity
var buffer = CircularBuffer.from([1, 2, 3], Int8Array, 10);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.pop](#pop)
* [#.unshift](#unshift)
* [#.clear](#clear)

*Read*

* [#.peekFirst](#peekfirst)
* [#.peekLast](#peeklast)

*Iteration*

* [#.forEach](#foreach)
* [#.toArray](#toarray)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.capacity

Maximum number of items the buffer is able to store.

```js
var buffer = new CircularBuffer(Array, 10);
buffer.capacity
>>> 10
```

### #.size

Number of items in the buffer.

```js
var buffer = new CircularBuffer(Array, 10);
buffer.size
>>> 0
```

### #.push

Adds an item to the buffer.

Will throw if the buffer's capacity is exceeded.

`O(1)`

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
```

### #.pop

Retrieve & remove the last item of the buffer.

`O(1)`

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.push(2);
buffer.pop();
>>> 2
```

### #.unshift

Retrieve & remove the first item of the buffer.

`O(1)`

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.push(2);
buffer.unshift();
>>> 1
```

### #.clear

Completely clears the buffer.

`O(1)`

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.clear();
buffer.toArray();
>>> []
```

### #.peekFirst

Retrieves the first item of the buffer.

`O(1)`

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.push(2);
buffer.peekFirst();
>>> 1
```

### #.peekLast

Retrieves the last item of the buffer.

`O(1)`

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.push(2);
buffer.peekLast();
>>> 2
```

### #.forEach

Iterates over the buffer's values.

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.push(2);

buffer.forEach(function(item, index, buffer) {
  console.log(index, item);
});
```

### #.toArray

Converts the buffer into a JavaScript array.

Note that the resulting array will be instantiated using the provided class.

```js
var buffer = new CircularBuffer(Array, 10);

buffer.push(1);
buffer.push(2);

buffer.toArray();
>>> [1, 2]
```

### #.values

Returns an iterator over the buffer's values.

```js
var buffer = CircularBuffer.from([1, 2, 3], Array);

var iterator = buffer.values();

iterator.next().value
>>> 1
```

### #.entries

Returns an iterator over the buffer's entries.

```js
var buffer = CircularBuffer.from([1, 2, 3], Array);

var iterator = buffer.entries();

iterator.next().value
>>> [0, 1]
```

### Iterable

Alternatively, you can iterate over a buffer's values using ES2015 `for...of` protocol:

```js
var buffer = CircularBuffer.from([1, 2, 3], Array);

for (var item of buffer) {
  console.log(item);
}
```
