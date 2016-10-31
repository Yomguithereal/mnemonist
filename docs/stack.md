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
