---
layout: page
title: Stack
---

A stack is simply a list in **L**ast **I**n **F**irst **O**ut (LIFO) order.

This just means that inserted items will get out in the reversed insertion order.

For more information about the Stack, you can head [here](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)).

Note that if you know the maximum size your stack will have and if you want a more performant stack implementation, you can check the [`FiniteStack`]({{ site.baseurl }}/finite-stack).

```js
var Stack = require('mnemonist/stack');
```

## Use case

A stack is really useful to perform, for instance, the depth-first traversal of a tree:

```js
var stack = new Stack();
stack.push(tree.root);

while (stack.size) {
  var node = stack.pop();
  console.log('Traversed node:', node);

  node.children.forEach(function(child) {
    stack.push(child);
  });
}
```

## Constructor

The `Stack` takes no argument.

### Static #.from

Alternatively, one can build a `Stack` from an arbitrary JavaScript iterable likewise:

```js
var stack = Stack.from([1, 2, 3]);
```

### Static #.of

You can also build a `Stack` from an arbitrary set of arguments:

```js
var stack = Stack.of(1, 2, 3);
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

*Iteration*

* [#.forEach](#foreach)
* [#.toArray](#toarray)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.size

Number of items in the stack.

```js
var stack = new Stack();
stack.size
>>> 0
```

### #.push

Adds an item to the stack.

`O(1)`

```js
var stack = new Stack();

stack.push(1);
```

### #.pop

Retrieve & remove the next item of the stack.

`O(1)`

```js
var stack = new Stack();

stack.push(1);
stack.pop();
>>> 1
```

### #.clear

Completely clears the stack.

`O(1)`

```js
var stack = new Stack();

stack.push(1);
stack.clear();
stack.toArray();
>>> []
```

### #.peek

Retrieves the next item of the stack.

`O(1)`

```js
var stack = new Stack();

stack.push(1);
stack.peek();
>>> 1
```

### #.forEach

Iterates over the stack in LIFO order.

```js
var stack = new Stack();

stack.push(1);
stack.push(2);

stack.forEach(function(item, index, stack) {
  console.log(index, item);
});
```

### #.toArray

Converts the stack into a LIFO JavaScript array.

```js
var stack = new Stack();

stack.push(1);
stack.push(2);

stack.toArray();
>>> [2, 1]
```

### #.values

Returns an iterator over the stack's values.

```js
var stack = Stack.from([1, 2, 3]);

var iterator = stack.values();

iterator.next().value
>>> 3
```

### #.entries

Returns an iterator over the stack's entries.

```js
var stack = Stack.from([1, 2, 3]);

var iterator = stack.entries();

iterator.next().value
>>> [0, 3]
```

### Iterable

Alternatively, you can iterate over a stack's values using ES2015 `for...of` protocol:

```js
var stack = Stack.from([1, 2, 3]);

for (var item of stack) {
  console.log(item);
}
```
