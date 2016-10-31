# Queue

For more information about the Queue, you can head [here](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)).

```js
var Queue = require('mnemonist/queue');
```

## Members

* [#.size](#size)

## Methods

* [#.enqueue](#enqueue)
* [#.dequeue](#dequeue)
* [#.clear](#clear)
* [#.peek](#peek)
* [#.forEach](#foreach)
* [#.toArray](#toarray)

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
