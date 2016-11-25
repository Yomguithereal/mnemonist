# Bag

For more information about the Bag, you can head [here](https://en.wikipedia.org/wiki/Multiset).

```js
var Bag = require('mnemonist/bag');
```

## Members

* [#.size](#size)
* [#.sum](#sum)

## Methods

* [#.add](#add)
* [#.clear](#clear)
* [#.count](#count)
* [#.delete](#delete)
* [#.has](#has)
* [#.remove](#remove)
* [#.set](#set)

### #.size

Number of distinct items in the bag.

```js
var bag = new Bag();
bag.size
>>> 0
```

### #.sum

Number of items in the bag.

```js
var bag = new Bag();
bag.add('Hello');
bag.add('Hello');

bag.size
>>> 1

bag.sum
>>> 2
```

### #.add

Adds an item to the bag. You can optionally provide a count.

```js
var bag = new Bag();
bag.add('Hello');
bag.add('Hello', 4);

bag.count('Hello');
>>> 5
```
