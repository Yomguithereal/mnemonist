---
layout: page
title: SparseSet
---

A `SparseSet` is a very efficient set structure used to store unsigned integers in a provided range. Note however that this structure can consume a lot of memory (it relies on two byte arrays having a length equal to the maximum integer you need to store).

Contrary to the [`BitSet`]({{ site.baseurl }}/bit-set), the `SparseSet` is very efficient if you need to iterate over the stored value or if you often need to clear the set.


```js
var SparseSet = require('mnemonist/sparse-set');
```

## Constructor

```js
var set = new SparseSet(length);
```

## Members

* [#.length](#length)
* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.delete](#delete)
* [#.clear](#clear)

*Read*

* [#.has](#has)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [Iterable](#iterable)

### #.length

Length of the set, that is to say the maximum number one can expect to store in this set minus one.

```js
var set = new SparseSet(4);

set.length;
>>> 4
```

### #.size

Number of items in the set.

```js
var set = new SparseSet(4);

set.size;
>>> 0

set.add(2);

set.size;
>>> 1
```

### #.add

Adds a number to the set.

`O(1)`

```js
var set = new SparseSet(4);

set.add(2);
set.has(2);
>>> true
```

### #.delete

Deletes the given number from the set.

`O(1)`

```js
var set = new SparseSet(4);

set.add(2);
set.delete(2);
set.has(2);
>>> false
```

### #.clear

Resets every number stored by the set.

```js
var set = new SparseSet(4);

set.set(1);
set.set(3);

set.clear();
set.size
>>> 0
```

### #.has

Returns whether the given number exists in the set.

`O(1)`

```js
var set = new SparseSet(4);

set.has(3);
>>> false

set.add(3);
set.has(3);
>>> true
```


### #.forEach

Iterates over the set's numbers.

```js
var set = new SparseSet(4);

set.add(1);

set.forEach(function(number) {
  console.log(number);
});
```

### #.values

Returns an iterator over the set's number.

```js
var set = new SparseSet(4);

set.add(2);

var iterator = set.values()

iteraror.next().value
>>> 2
```

### Iterable

Alternatively, you can iterate over a set's values using ES2015 `for...of` protocol:

```js
var set = new SparseSet(4);

for (var number of set) {
  console.log(number);
}
```
