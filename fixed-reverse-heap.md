---
layout: page
title: Fixed Reverse Heap
---

The `FixedReverseHeap` is a specialized version of the standard [`Heap`]({{ site.baseurl }}/heap) designed to perform fast & memory efficient n smallest/largest operations.

As such, it has a fixed capacity and can work with byte arrays.

It is a "reverse" heap because internally, the heap will store the values you give it in reverse order so it can still replace the worst item in logarithmic time.

It is therefore impossible to pop or peek this heap and you can only push new values and consume the heap when the job is done.

```js
var FixedReverseHeap = require('mnemonist/fixed-reverse-heap');
```

## Use case

Let's say we want to retrieve the 10 largest elements of a binary tree during a DFS traversal but don't want to store a full list of elements that we will sort & slice afterwards because it would be a waste of time & memory.

Then the `FixedReverseHeap` is the right tool for the job.

```js
var heap = new FixedReverseHeap(10);

var stack = [binaryTree.root],
    node;

while (stack.length) {
  node = stack.pop();
  heap.push(node.value);

  if (node.right)
    stack.push(node.right);
  if (node.left)
    stack.push(node.left);
}

// Consuming our heap to get our top 10
var top10 = heap.consume();
```

Note that if you just want to retrieve the n largest/smallest values from an iterable, check the [nlargest]({{ site.baseurl }}/heap#nlargest) & [nsmallest]({{ site.baseurl }}/heap#nsmallest) functions from the [Heap]({{ site.baseurl }}/heap) module instead.

## Constructor

The `FixedReverseHeap` takes three arguments:

1. The array class to instantiate to store the given values.
2. A comparator function.
3. A maximum capacity.

```js
// Example of a custom comparator function:
function compare(a, b) {
  if (a.value < b.value)
    return -1;
  if (a.value > b.value)
    return 1;
  return 0;
}

// Instantiating a heap that can store 15 items in a Uint8Array
var heap = new FixedReverseHeap(Uint8Array, comparator, 15);

// Comparator can be omitted if you just want to compare numbers
var heap = new FixedReverseHeap(Uint8Array, 15);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.consume](#consume)
* [#.clear](#clear)

*Read*

* [#.peek](#peek)
* [#.toArray](#toarray)

### #.capacity

Maximum number of values that can be stored by the heap.

```js
var heap = new FixedReverseHeap(Array, 3);
heap.capacity
>>> 3
```

### #.size

Number of values currently in the heap.

```js
var heap = new FixedReverseHeap(Array, 3);
heap.size
>>> 0
```

### #.push

Pushes a value into the heap.

`O(log n)`

```js
var heap = new FixedReverseHeap(Array, 3);
heap.push(34);
```

### #.consume

Fully consume the heap and return its items as a sorted array.

```js
var heap = new FixedReverseHeap(Array, 3);

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
var heap = new FixedReverseHeap(Array, 3);

heap.push(34);
heap.clear();
heap.size
>>> 0
```

### #.peek

Returns the worst item currently stored in the heap.

`O(1)`

```js
var heap = new FixedReverseHeap(Array, 3);

heap.push(4);
heap.push(34);
heap.push(5);

heap.peek();
>>> 34
```

### #.toArray

Converts the heap into an array without altering the heap's state. Note that the underlying array storing the items is cloned to perform this operation and that you can be more performant if you can consume the heap instead.

This method is mostly used for debugging purposes.

`O(n log n)`

```js
var heap = new FixedReverseHeap(Array, 3);

heap.push(4);
heap.push(34);
heap.push(5);

heap.toArray();
>>> [4, 5, 34]
```
