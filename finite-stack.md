---
layout: page
title: Finite Stack
---

The `FiniteStack` is a more performant implementation of the [`Stack`]({{ site.baseurl }}/stack) requiring a fixed capacity.

This means, however, that you must know beforehand the maximum size your stack will have during iteration (which is often possible - when performing the DFS traversal of a balanced binary tree, for instance).

What's more, the `FiniteStack` is able to rely on byte arrays and can therefore be very memory-efficient.

```js
var FiniteStack = require('mnemonist/finite-stack');
```

## Constructor

The `FiniteStack` takes two arguments: a array class to use, and the desired capacity.

```js
var stack = new FiniteStack(Array, 10);

// Using byte arrays
var stack = new FiniteStack(Int8Array, 10);
```

### Static #.from

Alternatively, one can build a `FiniteStack` from an arbitrary JavaScript iterable likewise:

```js
// Attempting the guess the given iterable's length/size
var stack = FiniteStack.from([1, 2, 3], Int8Array);

// Providing the desired capacity
var stack = FiniteStack.from([1, 2, 3], Int8Array, 10);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.pop](#pop)
* [#.clear](#clear)

*Read*

* [#.peek](#peek)

*Iteration*

* [#.forEach](#foreach)
* [#.toArray](#toarray)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.capacity

Maximum number of items the stack is able to store.

```js
var stack = new FiniteStack(Array, 10);
stack.capacity
>>> 10
```

### #.size

Number of items in the stack.

```js
var stack = new FiniteStack(Array, 10);
stack.size
>>> 0
```

### #.push

Adds an item to the stack.

Will throw if the stack's capacity is exceeded.

`O(1)`

```js
var stack = new FiniteStack(Array, 10);

stack.push(1);
```

### #.pop

Retrieve & remove the next item of the stack.

`O(1)`

```js
var stack = new FiniteStack(Array, 10);

stack.push(1);
stack.pop();
>>> 1
```

### #.clear

Completely clears the stack.

`O(1)`

```js
var stack = new FiniteStack(Array, 10);

stack.push(1);
stack.clear();
stack.toArray();
>>> []
```

### #.peek

Retrieves the next item of the stack.

`O(1)`

```js
var stack = new FiniteStack(Array, 10);

stack.push(1);
stack.peek();
>>> 1
```

### #.forEach

Iterates over the stack in LIFO order.

```js
var stack = new FiniteStack(Array, 10);

stack.push(1);
stack.push(2);

stack.forEach(function(item, index, stack) {
  console.log(index, item);
});
```

### #.toArray

Converts the stack into a LIFO JavaScript array.

Note that the resulting array will be instantiated using the provided class.

```js
var stack = new FiniteStack(Array, 10);

stack.push(1);
stack.push(2);

stack.toArray();
>>> [2, 1]
```

### #.values

Returns an iterator over the stack's values.

```js
var stack = FiniteStack.from([1, 2, 3], Array);

var iterator = stack.values();

iterator.next().value
>>> 3
```

### #.entries

Returns an iterator over the stack's entries.

```js
var stack = FiniteStack.from([1, 2, 3], Array);

var iterator = stack.entries();

iterator.next().value
>>> [0, 3]
```

### Iterable

Alternatively, you can iterate over a stack's values using ES2015 `for...of` protocol:

```js
var stack = FiniteStack.from([1, 2, 3], Array);

for (var item of stack) {
  console.log(item);
}
```
