# MultiSet

For more information about the MultiSet, you can head [here](https://en.wikipedia.org/wiki/Multiset).

```js
var MultiSet = require('mnemonist/multiset');
```

## Members

* [#.distinctSize](#distinctSize)
* [#.size](#size)

## Methods

* [#.add](#add)
* [#.clear](#clear)
* [#.count](#count)
* [#.delete](#delete)
* [#.has](#has)
* [#.remove](#remove)
* [#.set](#set)

### #.distinctSize

Number of distinct items in the set.

```js
var set = new MultiSet();
set.distinctSize
>>> 0
```

### #.size

Number of items in the set.

```js
var set = new MultiSet();
set.add('Hello');
set.add('Hello');

set.distinctSize
>>> 1

set.size
>>> 2
```

### #.add

Adds an item to the set. You can optionally provide a count.

```js
var set = new MultiSet();
set.add('Hello');
set.add('Hello', 4);

set.count('Hello');
>>> 5
```

### #.clear

Completely clears the set.

```js
var set = new MultiSet();
set.add('Hello');

set.clear();

set.size;
>>> 0
```

### #.count

Count the occurrences of the given item in the set.

```js
var set = new MultiSet();
set.add('Hello');

set.count('Hello');
>>> 1

set.count('World');
>>> 0
```

### #.delete

Completely removes the given item from the set.

```js
var set = new MultiSet();
set.add('Hello', 2);

set.delete('Hello');

set.has('Hello');
>>> false
```

### #.has

Returns whether the given item is present from the set.

```js
var set = new MultiSet();
set.add('Hello', 2);

set.has('Hello');
>>> true
```

### #.remove

Removes a single occurrence of the given item from the set.

```js
var set = new MultiSet();
set.add('Hello', 2);

set.remove('Hello');

set.count('Hello');
>>> 1
```

### #.set

Set the number of occurrences of the given item in the set.

```js
var set = new MultiSet();
set.add('Hello');
set.add('Hello');

set.set('Hello', 34);

set.count('Hello');
>>> 34
```
