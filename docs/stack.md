# Stack

For more information about the Stack, you can head [here](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)).

```js
var Stack = require('mnemonist/stack');
```

## Members

* [#.size](#size)

## Methods

* [#.push](#push)
* [#.pop](#pop)
* [#.clear](#clear)
* [#.peek](#peek)
* [#.forEach](#foreach)
* [#.toArray](#toarray)

### #.size

Number of items in the list.

```js
var list = new Stack();
list.size
>>> 0
```

### #.push

Adds an item to the stack.

`O(1)`

```js
var list = new Stack();

list.push(1);
```

### #.pop

Retrieve & remove the next item of the stack.

`O(1)`

```js
var list = new Stack();

list.push(1);
list.pop();
>>> 1
```

### #.clear

Completely clears the stack.

`O(1)`

```js
var list = new Stack();

list.unshift(1);
list.clear();
list.toArray();
>>> []
```

### #.peek

Retrieves the next item of the stack.

`O(1)`

```js
var list = new Stack();

list.push(1);
list.peek();
>>> 1
```

### #.forEach

Iterates over the stack in LIFO order.

```js
var list = new Stack();

list.push(1);
list.push(2);

list.forEach(function(item, index, list) {
  console.log(index, item);
});
```

### #.toArray

Converts the list into a LIFO JavaScript array.

```js
var list = new Stack();

list.push(1);
list.push(2);

list.toArray();
>>> [2, 1]
```
