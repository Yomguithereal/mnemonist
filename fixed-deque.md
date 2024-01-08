---
layout: page
title: Fixed Deque
---

The `FixedDeque` is a fixed capacity double-ended queue (abbr. deque) that can be used both as a LIFO or FIFO list very efficiently.

For more information about the deque, you can head [here](https://en.wikipedia.org/wiki/Double-ended_queue).

Note that, contrary to the [`CircularBuffer`]({{ site.baseurl }}/circular-buffer), the `FixedDeque` will throw when overflowing capacity.

```js
const FixedDeque = require('mnemonist/fixed-deque');
```

## Constructor

The `FixedDeque` takes two arguments: a array class to use, and the desired capacity.

```js
const deque = new FixedDeque(Array, 10);
```
```js
// Using byte arrays
const deque = new FixedDeque(Int8Array, 10);
```

### Static #.from

Alternatively, one can build a `FixedDeque` from an arbitrary JavaScript iterable likewise:

```js
// Attempting the guess the given iterable's length/size
const deque = FixedDeque.from([1, 2, 3], Int8Array);
```
```js
// Providing the desired capacity
const deque = FixedDeque.from([1, 2, 3], Int8Array, 10);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.unshift](#unshift)
* [#.pop](#pop)
* [#.shift](#shift)
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

Maximum number of items the deque is able to store.

```js
const deque = new FixedDeque(Array, 10);
deque.capacity
>>> 10
```

### #.size

Number of items in the deque.

```js
const deque = new FixedDeque(Array, 10);
deque.size
>>> 0
```

### #.push

Append an item at the end of the deque.

Will throw if the deque's capacity is exceeded.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
```

### #.unshift

Prepend an item at the beginning of the deque.

Will throw if the deque's capacity is exceeded.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.unshift(1);
```

### #.pop

Retrieve & remove the last item of the deque.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.push(2);
deque.pop();
>>> 2
```

### #.shift

Retrieve & remove the first item of the deque.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.push(2);
deque.shift();
>>> 1
```

### #.clear

Completely clears the deque.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.clear();
deque.toArray();
>>> []
```

### #.peekFirst

Retrieves the first item of the deque.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.push(2);
deque.peekFirst();
>>> 1
```

### #.peekLast

Retrieves the last item of the deque.

`O(1)`

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.push(2);
deque.peekLast();
>>> 2
```

### #.forEach

Iterates over the deque's values.

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.push(2);

deque.forEach(function(item, index, deque) {
  console.log(index, item);
});
```

### #.toArray

Converts the deque into a JavaScript array.

Note that the resulting array will be instantiated using the provided class.

```js
const deque = new FixedDeque(Array, 10);

deque.push(1);
deque.push(2);

deque.toArray();
>>> [1, 2]
```

### #.values

Returns an iterator over the deque's values.

```js
const deque = FixedDeque.from([1, 2, 3], Array);

const iterator = deque.values();

iterator.next().value
>>> 1
```

### #.entries

Returns an iterator over the deque's entries.

```js
const deque = FixedDeque.from([1, 2, 3], Array);

const iterator = deque.entries();

iterator.next().value
>>> [0, 1]
```

### Iterable

Alternatively, you can iterate over a deque's values using ES2015 `for...of` protocol:

```js
const deque = FixedDeque.from([1, 2, 3], Array);

for (const item of deque) {
  console.log(item);
}
```
