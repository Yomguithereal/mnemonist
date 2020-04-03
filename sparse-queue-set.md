---
layout: page
title: SparseQueueSet
---

A `SparseQueueSet` is a very time-efficient set structure used to store a range of unsigned integers in FIFO order. Note however that this structure can consume a lot of memory (it relies on two byte arrays having a length equal to the maximum integer you need to store).

The `SparseQueueSet` is to be used as a queue where elements cannot exist more than once.

```js
var SparseQueueSet = require('mnemonist/sparse-queue-set');
```

## Constructor

```js
var queue = new SparseQueueSet(length);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.enqueue](#add)
* [#.dequeue](#delete)
* [#.clear](#clear)

*Read*

* [#.has](#has)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [Iterable](#iterable)

### #.capacity

Capacity of the set, that is to say the maximum number one can expect to store in this set minus one.

```js
var queue = new SparseQueueSet(4);

queue.capacity;
>>> 4
```

### #.size

Number of items currently in the queue.

```js
var queue = new SparseQueueSet(4);

queue.size;
>>> 0

queue.enqueue(2);

queue.size;
>>> 1
```

### #.enqueue

Adds a number to the queue.

`O(1)`

```js
var queue = new SparseQueueSet(4);

queue.enqueue(2);
queue.has(2);
>>> true
```

### #.dequeue

Removes and retrieves the first item stored in the queue or `undefined`.

`O(1)`

```js
var queue = new SparseQueueSet(4);

queue.enqueue(2);
queue.enqueue(0);
queue.dequeue();
>>> 2

queue.has(2)
>>> false
```

### #.clear

Removes every number stored in the queue.

```js
var queue = new SparseQueueSet(4);

queue.enqueue(1);
queue.enqueue(3);

queue.clear();
queue.size
>>> 0
```

### #.has

Returns whether the given number exists in the queue.

`O(1)`

```js
var queue = new SparseQueueSet(4);

queue.has(3);
>>> false

queue.enqueue(3);
queue.has(3);
>>> true
```


### #.forEach

Iterates over the queue's numbers.

```js
var queue = new SparseQueueSet(4);

queue.enqueue(1);

queue.forEach(function(number) {
  console.log(number);
});
```

### #.values

Returns an iterator over the queue's number.

```js
var queue = new SparseQueueSet(4);

queue.enqueue(2);

var iterator = queue.values()

iteraror.next().value
>>> 2
```

### Iterable

Alternatively, you can iterate over a queue's values using ES2015 `for...of` protocol:

```js
var queue = new SparseQueueSet(4);

for (var number of queue) {
  console.log(number);
}
```
