---
layout: page
title: TrieMap
---

The `TrieMap` is basically a [`Trie`]({{ site.baseurl }}/trie) in which you can associate an arbitraty value to the prefixes you insert.

```js
const TrieMap = require('mnemonist/trie-map');
```

## Constructor

The `TrieMap` optionally takes as single argument the type of sequence you are going to feed it.

```js
// For a trie containing string prefixes
const trie = new TrieMap();
```
```js
// For a trie containing arbitrary sequences fed as arrays
const trie = new TrieMap(Array);
```

### Static #.from

Alternatively, one can build a `TrieMap` from an arbitrary JavaScript iterable likewise:

```js
const list = TrieMap.from({
  roman: 1,
  romanesque: 2
});
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.set](#set)
* [#.update](#update)
* [#.delete](#delete)
* [#.clear](#clear)

*Read*

* [#.get](#get)
* [#.has](#has)
* [#.find](#find)

*Iteration*

* [#.entries](#entries)
* [#.keys](#keys)
* [#.prefixes](#prefixes)
* [#.values](#values)
* [Iterable](#iterable)

### #.size

Number of prefixes in the trie.

```js
const trie = new TrieMap();
trie.size
>>> 0
```

### #.set

Inserts a prefix into the Trie and associates it to the given value.

`O(m)`, m being the size of the inserted string.

```js
const trie = new TrieMap();
trie.set('hello', 'world');

trie.get('hello');
>>> 'world'

// Using custom tokens
trie.set(['I', 'am', 'very', 'happy'], 'world');
```

### #.update

Updates the value associated with a prefix. Accepts a function receiving the current value and returning the new one.

`O(m)`, m being the size of the prefix string.

```js
const trie = new TrieMap();

const updater = v => (v || 0) + 1;

trie.update('counter', updater);
trie.update('counter', updater);

trie.get('counter');
>>> 2
```

### #.delete

Deletes a prefix from the TrieMap. Returns `true` if the prefix was deleted & `false` if the prefix was not in the TrieMap.

`O(m)`, m being the size of the deleted string.

```js
const trie = new TrieMap();
trie.add('hello');

trie.delete('hello');
>>> true

trie.delete('world');
>>> false
```

### #.clear

Completely clears the trie.

```js
const trie = new TrieMap();
trie.set('hello', 1);
trie.set('roman', 2);

trie.clear();

trie.size
>>> 0
```

### #.get

Returns the value associated to the given prefix or `undefined` if the prefix does not exist in the trie.

`O(m)`, m being the size of the searched string.

```js
const trie = new TrieMap();
trie.set('hello', 'world');

trie.get('hello');
>>> 'world'
```

### #.has

Returns whether the given prefix exists in the trie.

`O(m)`, m being the size of the searched string.

```js
const trie = new TrieMap();
trie.set('hello', 'world');

trie.has('hello');
>>> true

trie.has('world');
>>> false
```

### #.find

Returns an array of couples of every prefixes and their associated value found in the trie with the given prefix.

`O(m + n)`, m being the size of the query, n being the cumulated size of the matched prefixes.

```js
const trie = new TrieMap();
trie.set('roman', 1);
trie.set('romanesque', 2);
trie.set('greek', 3);

trie.find('rom');
>>> [['roman', 1], ['romanesque', 2]]

trie.find('gr');
>>> [['greek', 3]]

trie.find('hel');
>>> []
```

### #.entries

Returns an iterator over the trie's entries (note that the order on which the trie will iterate over its entries is arbitrary).

```js
const trie = TrieMap.from({roman: 1, romanesque: 2});

const iterator = trie.entries();

iterator.next().value
>>> ['roman', 1]
```

### #.keys

Alias of [#.prefixes](#prefixes).

### #.prefixes

Returns an iterator over the trie's prefixes (note that the order on which the trie will iterate over its prefixes is arbitrary).

```js
const trie = TrieMap.from({roman: 1, romanesque: 2});

const iterator = trie.prefixes();

iterator.next().value
>>> 'roman'
```

### #.values

Returns an iterator over the trie's values (note that the order on which the trie will iterate over its values is arbitrary).

```js
const trie = TrieMap.from({roman: 1, romanesque: 2});

const iterator = trie.values();

iterator.next().value
>>> 1
```

### Iterable

Alternatively, you can iterate over a trie's entries using ES2015 `for...of` protocol:

```js
const trie = TrieMap.from({roman: 1, romanesque: 2});

for (const entry of trie) {
  console.log(entry);
}
```
