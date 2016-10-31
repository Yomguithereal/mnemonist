# Fibonacci Heap

For more information about the Fibonacci Heap, you can head [here](https://en.wikipedia.org/wiki/Fibonacci_heap).

Note that, by default, the provided `FibonacciHeap` is a min heap and that the `MaxFibonacciHeap` is just some sugar that will reverse the provided comparator for you.

```js
var FibonacciHeap = require('mnemonist/fibonacci-heap');
// To access min/max fibonacci heap
var MinFibonacciHeap = require('mnemonist/fibonacci-heap').MinFibonacciHeap;
var MaxFibonacciHeap = require('mnemonist/fibonacci-heap').MaxFibonacciHeap;

// To create a heap:
var heap = new FibonacciHeap();

// With a custom comparator:
var heap = new FibonacciHeap(function(a, b) {
  if (a.value < b.value)
    return -1;
  if (a.value > b.value)
    return 1;
  return 0;
});
```

## Members

* [#.size](#size)

## Methods

* [#.push](#push)
* [#.pop](#pop)
* [#.clear](#clear)
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

`O(1)`

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
