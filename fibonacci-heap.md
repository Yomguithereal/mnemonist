---
layout: page
title: Fibonacci Heap
---

The Fibonacci heap is usually thought as an improvement over the classical [Heap]({{ site.baseurl }}/heap) because some of its operations can run in an amortized constant time.

For more information about the Fibonacci heap, you can head [here](https://en.wikipedia.org/wiki/Fibonacci_heap).

By default, the provided `FibonacciHeap` is a min heap and the `MaxFibonacciHeap` is just some sugar that will reverse the provided comparator for you.

```js
var FibonacciHeap = require('mnemonist/fibonacci-heap');
// To access min/max fibonacci heap
var MinFibonacciHeap = require('mnemonist/fibonacci-heap').MinFibonacciHeap;
var MaxFibonacciHeap = require('mnemonist/fibonacci-heap').MaxFibonacciHeap;

// To create a heap:
var heap = new FibonacciHeap();
```

## Constructor

The `FibonacciHeap` takes a single optional argument being the comparator function to be used to compare the given items.

```js
// Providing a comparator to handle custom objects
var heap = new FibonacciHeap(function(a, b) {
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

Alternatively, one can build a `FibonacciHeap` from an arbitrary JavaScript iterable likewise:

```js
var heap = FibonacciHeap.from([1, 2, 3], comparator);
```

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
var heap = new FibonacciHeap();
heap.size
>>> 0
```

### #.push

Pushes an item into the heap.

`O(1)`

```js
var heap = new FibonacciHeap();
heap.push(34);
```

### #.pop

Retrieve & remove the min item of the heap (or the max item in case of a `MaxFibonacciHeap`).

`O(log n)`

```js
var heap = new FibonacciHeap();

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
var heap = new FibonacciHeap();

heap.push(34);
heap.clear();
heap.size
>>> 0
```

### #.peek

Retrieves the min item of the heap (or the max item in case of a `MaxFibonacciHeap`).

`O(1)`

```js
var heap = new FibonacciHeap();

heap.push(4);
heap.push(34);
heap.push(5);

heap.peek();
>>> 4
```
