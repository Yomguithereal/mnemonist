---
layout: page
title: Heap
---

A `Heap` can be seen as a dynamic list keeping its items sorted at all time.

For more information about the Heap, you can head [here](https://en.wikipedia.org/wiki/Heap_(data_structure)).

By default, the provided `Heap` is a min heap and the `MaxHeap` is just some sugar that will reverse the provided comparator for you.

```js
var Heap = require('mnemonist/heap');
// To access min/max heap
var MinHeap = require('mnemonist/heap').MinHeap;
var MaxHeap = require('mnemonist/heap').MaxHeap;

// To create a heap:
var heap = new Heap();
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

The construction is done in `O(n)`.

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.pop](#pop)
* [#.clear](#clear)

*Read*

* [#.peek](#peek)

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
