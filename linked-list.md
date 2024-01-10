---
layout: page
title: Linked List
---

A linked list is basically a list in which every items keep a reference to the next item in the list.

They are a bit different from arrays - which we are more used to handle in JavaScript - in that they don't need to store their items in contiguous memory blocks and therefore do not allow for random access in constant time.

However, and this is where this structure shine, a linked list is able to modify its order in constant time, which is impossible with an ordinary array.

For more information about the Linked List, you can head [here](https://en.wikipedia.org/wiki/Linked_list#Singly_linked_list).

```js
const LinkedList = require('mnemonist/linked-list');
```

## Constructor

The `LinkedList` takes no argument.

### Static #.from

Alternatively, one can build a `LinkedList` from an arbitrary JavaScript iterable likewise:

```js
const list = LinkedList.from([1, 2, 3]);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.push](#push)
* [#.unshift](#unshift)
* [#.shift](#shift)
* [#.clear](#clear)

*Read*

* [#.first, #.peek](#first-peek)
* [#.last](#last)

*Iteration*

* [#.forEach](#foreach)
* [#.toArray](#toarray)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.size

Number of items in the list.

```js
const list = new LinkedList();
list.size
>>> 0
```

### #.push

Adds an item at the end of the list.

`O(1)`

```js
const list = new LinkedList();

list.push(1);
```

### #.unshift

Adds an item at the beginning of the list.

`O(1)`

```js
const list = new LinkedList();

list.unshift(1);
```

### #.shift

Remove & retrieves the first item of the list.

`O(1)`

```js
const list = new LinkedList();

list.unshift(1);
list.shift();
>>> 1
```

### #.clear

Completely clears the list of its items.

`O(1)`

```js
const list = new LinkedList();

list.unshift(1);
list.clear();
list.toArray();
>>> []
```

### #.first, #.peek

Retrieves the first item of the list.

`O(1)`

```js
const list = new LinkedList();

list.unshift(1);
list.first();
>>> 1
```

### #.last

Retrieves the last item of the list.

`O(1)`

```js
const list = new LinkedList();

list.push(1);
list.push(2);
list.last();
>>> 2
```

### #.forEach

Iterates over the list by applying the callback on every item.

```js
const list = new LinkedList();

list.push(1);
list.push(2);

list.forEach((item, index, list)=> {
  console.log(index, item);
});
```

### #.toArray

Converts the list into a JavaScript array.

```js
const list = new LinkedList();

list.push(1);
list.push(2);

list.toArray();
>>> [1, 2]
```

### #.values

Returns an iterator over the list's values.

```js
const list = LinkedList.from([1, 2, 3]);

const iterator = list.values();

iteraror.next().value
>>> 1
```

### #.entries

Returns an iterator over the list's entries.

```js
const list = LinkedList.from([1, 2, 3]);

const iterator = list.entries();

iterator.next().value
>>> [0, 1]
```

### Iterable

Alternatively, you can iterate over a list's values using ES2015 `for...of` protocol:

```js
const list = LinkedList.from([1, 2, 3]);

for (const item of list) {
  console.log(item);
}
```
