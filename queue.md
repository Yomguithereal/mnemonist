---
layout: page
title: Queue
---

A queue is simply a list in **F**irst **I**n **F**irst **O**ut (FIFO) order.

This just mean that inserted items will get out in their insertion order.

For more information about the Queue, you can head [here](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)).

```js
var Queue = require('mnemonist/queue');
```

## Use case

A queue is really useful to perform, for instance, the breadth-first traversal of a tree:

```js
var queue = new Queue();
queue.enqueue(tree.root);

while (queue.size) {
  var node = queue.dequeue();
  console.log('Traversed node:', node);

  node.children.forEach(function(child) {
    queue.enqueue(child);
  });
}
```

## Constructor

The `Queue` takes no argument.

### Static #.from

Alternatively, one can build a `Queue` from an arbitrary JavaScript iterable likewise:

```js
var list = Queue.from([1, 2, 3]);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.enqueue](#enqueue)
* [#.dequeue](#dequeue)
* [#.clear](#clear)

*Read*

* [#.peek](#peek)

*Iteration*

* [#.forEach](#foreach)
* [#.toArray](#toarray)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.size

Number of items in the queue.

```js
var queue = new Queue();
queue.size
>>> 0
```

### #.enqueue

Adds an item to the queue.

`O(1)`

```js
var queue = new Queue();

queue.enqueue(1);
```

### #.dequeue

Retrieve & remove the next item of the queue.

`O(1)`

```js
var queue = new Queue();

queue.enqueue(1);
queue.dequeue();
>>> 1
```

### #.clear

Completely clears the queue.

`O(1)`

```js
var queue = new Queue();

queue.enqueue(1);
queue.clear();
queue.toArray();
>>> []
```

### #.peek

Retrieves the next item of the queue.

`O(1)`

```js
var queue = new Queue();

queue.enqueue(1);
queue.peek();
>>> 1
```

### #.forEach

Iterates over the queue in FIFO order.

```js
var queue = new Queue();

queue.enqueue(1);
queue.enqueue(2);

queue.forEach(function(item, index, queue) {
  console.log(index, item);
});
```

### #.toArray

Converts the queue into a FIFO JavaScript array.

```js
var queue = new Queue();

queue.enqueue(1);
queue.enqueue(2);

queue.toArray();
>>> [1, 2]
```

### #.values

Returns an iterator over the queue's values.

```js
var queue = Queue.from([1, 2, 3]);

var iterator = queue.values();

iteraror.next().value
>>> 1
```

### #.entries

Returns an iterator over the queue's entries.

```js
var queue = Queue.from([1, 2, 3]);

var iterator = queue.entries();

iterator.next().value
>>> [0, 1]
```

### Iterable

Alternatively, you can iterate over a queue's values using ES2015 `for...of` protocol:

```js
var queue = Queue.from([1, 2, 3]);

for (var item of queue) {
  console.log(item);
}
```
