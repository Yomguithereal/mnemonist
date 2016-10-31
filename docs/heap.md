# Heap

For more information about the Heap, you can head [here](https://en.wikipedia.org/wiki/Heap_(data_structure)).

Note that, by default, the provided `Heap` is a min heap and that the `MaxHeap` is just some sugar that will reverse the provided comparator for you.

```js
var Heap = require('mnemonist/heap');
// To access min/max heap
var MinHeap = require('mnemonist/heap').MinHeap;
var MaxHeap = require('mnemonist/heap').MaxHeap;

// To create a heap:
var heap = new Heap();

// With a custom comparator:
var heap = new Heap(function(a, b) {
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

`O(1)`

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
