---
layout: page
title: Heap
---

A `Heap` is basically a priority queue.

For more information about the Heap, you can head [here](https://en.wikipedia.org/wiki/Heap_(data_structure)).

By default, the provided `Heap` is a min heap and the `MaxHeap` is just some sugar that will reverse the provided comparator for you.

```js
var Heap = require('mnemonist/heap');

// To access min/max heap
var MinHeap = require('mnemonist/heap').MinHeap;
var MaxHeap = require('mnemonist/heap').MaxHeap;
```

## Use case

Let's say we need to schedule tasks having different priorities. A [Stack]({{ site.baseurl }}/stack) or a [Queue]({{ site.baseurl }}/queue) might not be enough since we need to be sure at all time that the most urgent tasks will come first.

In such cases, a `Heap` can help you tremendously by keeping the items you give it ordered following arbitrary logic & preventing you from having to perform costly sort operations on the full list of tasks.

```js
// Let's give a comparator function to our Heap
// to be able to tell which tasks are the most urgent
var heap = new Heap(function(a, b) {
  if (a.priority > b.priority)
    return -1;
  if (a.priority < b.priority)
    return 1;
  return 0;
});

// Let's add some tasks
heap.push({priority: 12, task: 'clean'});
heap.push({priority: 2, task: 'sleep'});
heap.push({priority: 23, task: 'work'});

// Let's peek to see which is the most urgent task
heap.peek().task;
>>> 'work'

// Let's perform our tasks
while (heap.size) {
  var task = heap.pop().task;
  console.log('Doing:', task);
}
```

## Constructor

The `Heap` takes a single optional argument being the comparator function to be used to compare the given items.

```js
// Providing a comparator to handle custom objects
var heap = new Heap(function(a, b) {
  if (a.value < b.value)
    return -1;
  if (a.value > b.value)
    return 1;
  return 0;
});

heap.push({value: 34});
heap.push({value: 45});

heap.peek();
>>> 34
```

### Static #.from

Alternatively, one can build a `Heap` from an arbitrary JavaScript iterable likewise:

```js
var heap = Heap.from([1, 2, 3], comparator);
```

The construction is done in linear time.

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.pop](#pop)
* [#.replace](#replace)
* [#.pushpop](#pushpop)
* [#.consume](#consume)
* [#.clear](#clear)

*Read*

* [#.peek](#peek)
* [#.toArray](#toarray)

## Helpers

If you don't want to use the `Heap` class and want to rely on your own array to represent the heap's data, you can use the helpers below:

* [heapify](#heapify)
* [push](#static-push)
* [pop](#static-pop)
* [replace](#static-replace)
* [pushpop](#static-pushpop)
* [consume](#static-consume)

### #.size

Number of items in the heap.

```js
var heap = new Heap();
heap.size
>>> 0
```

### #.push

Pushes an item into the heap.

`O(log n)`

```js
var heap = new Heap();
heap.push(34);
```

### #.pop

Retrieve & remove the min item of the heap (or the max item in case of a `MaxHeap`).

`O(log n)`

```js
var heap = new Heap();

heap.push(4);
heap.push(34);
heap.push(5);

heap.pop();
>>> 4

heap.size
>>> 2
```

### #.replace

Pop the heap, push an item then return the popped value. It will throw if the heap is empty.

This is more efficient than doing `pop` then `push` and does not change the length of the underlying array.

`O(log n)`

```js
var heap = new Heap();

heap.push(1);
heap.replace(2);
>>> 1

heap.size
>>> 1

heap.pop();
>>> 2
```

### #.pushpop

Push an item into the heap, then pop the heap. If the heap is empty, the heap will obviously remain empty and you will get your item back.

This is more efficient than doing `push` than `pop` and does not change the length of the underlying array.

`O(log n)`

```js
var heap = new Heap();

heap.push(1);
heap.pushpop(2);
>>> 1

heap.size
>>> 1

heap.pop();
>>> 2
```

### #.consume

Fully consume the heap and return its items as a sorted array.

```js
var heap = new Heap();

heap.push(45);
heap.push(-3);
heap.push(0);

heap.consume();
>>> [-3, 0, 45]

heap.size
>>> 0
```

### #.clear

Completely clears the heap.

```js
var heap = new Heap();

heap.push(34);
heap.clear();
heap.size
>>> 0
```

### #.peek

Retrieves the min item of the heap (or the max item in case of a `MaxHeap`).

`O(1)`

```js
var heap = new Heap();

heap.push(4);
heap.push(34);
heap.push(5);

heap.peek();
>>> 4
```

### #.toArray

Converts the heap into an array without altering the heap's state. Note that the underlying array storing the items is cloned to perform this operation and that you can be more performant if you can consume the heap instead.

This method is mostly used for debugging purposes.

`O(n log n)`

```js
var heap = new Heap();

heap.push(4);
heap.push(34);
heap.push(5);

heap.toArray();
>>> [4, 5, 34]
```

<br>

---

### heapify

Converts the given array into a heap in linear time.

`O(n)`

```js
var array = [4, 1, -5, 10];

Heap.heapify(comparator, array);
// You array has been heapified!
```

<h3 id="static-push">push</h3>

Push a new item into the heap.

`O(log n)`

```js
var array = [];

Heap.push(comparator, array, 4);
Heap.push(comparator, array, 3);
Heap.push(comparator, array, 7);

array[0]
>>> 3
```

<h3 id="static-pop">pop</h3>

Pop the heap.

`O(log n)`

```js
var array = [];

Heap.push(comparator, array, 4);
Heap.push(comparator, array, 3);
Heap.push(comparator, array, 7);

Heap.pop(comparator, array);
>>> 3
```

<h3 id="static-replace">replace</h3>

Pop the heap, push an item then return the popped value. It will throw if the heap is empty.

This is more efficient than doing `pop` then `push` and does not change the length of the underlying array.

`O(log n)`

```js
var array = [];

Heap.push(comparator, array, 1);
Heap.replace(comparator, array, 2);
>>> 1

array.length
>>> 1

Heap.pop(comparator, array);
>>> 2
```


<h3 id="static-pushpop">pushpop</h3>

Push an item into the heap, then pop the heap. If the heap is empty, the heap will obviously remain empty and you will get your item back.

This is more efficient than doing `push` than `pop` and does not change the length of the underlying array.

`O(log n)`

```js
var array = [];

Heap.push(comparator, array, 1);
Heap.pushpop(comparator, array, 2);
>>> 1

array.length
>>> 1

Heap.pop(comparator, array);
>>> 2
```

<h3 id="static-consume">consume</h3>

Completely consumes the heap and returns all its items in a sorted array.

`O(n log n)`

```js
var array = [4, 1, 3];

Heap.heapify(comparator, array);
Heap.consume(comparator, array);
>>> [1, 3, 4]

array.length
>>> 0
```


