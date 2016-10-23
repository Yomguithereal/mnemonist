# Linked List

For more information about the Linked List, you can head [here](https://en.wikipedia.org/wiki/Linked_list#Singly_linked_list).

```js
var LinkedList = require('mnemonist/linked-list');
```

## Members

* [#.size](#size)

## Methods

* [#.push](#push)
* [#.unshift](#unshift)
* [#.shift](#shift)
* [#.clear](#clear)
* [#.first, #.peek](#first-peek)
* [#.last](#last)
* [#.forEach](#foreach)
* [#.toArray](#toarray)

### #.size

Number of items in the list.

```js
var list = new LinkedList();
list.size
>>> 0
```

### #.push

Adds an item at the end of the list.

`O(1)`

```js
var list = new LinkedList();

list.push(1);
```

### #.unshift

Adds an item at the beginning of the list.

`O(1)`

```js
var list = new LinkedList();

list.unshift(1);
```

### #.shift

Remove & retrieves the first item of the list.

`O(1)`

```js
var list = new LinkedList();

list.unshift(1);
list.shift();
>>> 1
```

### #.clear

Completely clears the list of its items.

`O(1)`

```js
var list = new LinkedList();

list.unshift(1);
list.clear();
list.toArray();
>>> []
```

### #.first, #.peek

Retrieves the first item of the list.

`O(1)`

```js
var list = new LinkedList();

list.unshift(1);
list.first();
>>> 1
```

### #.last

Retrieves the last item of the list.

`O(1)`

```js
var list = new LinkedList();

list.push(1);
list.push(2);
list.last();
>>> 2
```

### #.forEach

Iterates over the list by applying the callback on every item.

```js
var list = new LinkedList();

list.push(1);
list.push(2);

list.forEach(function(item, index, list) {
  console.log(index, item);
});
```

### #.toArray

Converts the list into a JavaScript array.

```js
var list = new LinkedList();

list.push(1);
list.push(2);

list.toArray();
>>> [1, 2]
```
