---
layout: page
title: Trie
---

The trie - pronounced like in *re•trie•val* - is a kind tree very useful to work with prefixes.

For more information about the Trie, you can head [here](https://en.wikipedia.org/wiki/Trie).

```js
const Trie = require('mnemonist/trie');
```

## Use case

Let's say we have a list of strings and we want to be able to find them by a given prefix:

```js
const words = [
  'roman',
  'romanesque',
  'romanesco',
  'cat',
  'category'
];
```

A naive approach would be to compare each of our strings with the given prefix to find the matching ones:

```js
words.forEach((word) => {
  if (word.startsWith(query))
    console.log('Matching prefix!', word);
});
```

Even if this approach is perfectly fine, we are going to need `O(n)` computations to find the matching words.

A trie, on the contrary, is able to answer this kind of query more efficiently:

```js
// Let's create a trie from our words
const trie = Trie.from(words);

// Now let's query our trie
const wordsWithMatchingPrefix = trie.find(query);
```

## Constructor

The `Trie` optionally takes as single argument the type of sequence you are going to feed it.

```js
// For a trie containing string prefixes
const trie = new Trie();
```

```js
// For a trie containing arbitrary sequences fed as arrays
const trie = new Trie(Array);
```

### Static #.from

Alternatively, one can build a `Trie` from an arbitrary JavaScript iterable likewise:

```js
const trie = Trie.from(['roman', 'romanesque']);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.delete](#delete)
* [#.clear](#clear)

*Read*

* [#.has](#has)
* [#.find](#find)

*Iteration*

* [#.keys](#keys)
* [#.prefixes](#prefixes)
* [Iterable](#iterable)

### #.size

Number of prefixes in the trie.

```js
const trie = new Trie();
trie.size
>>> 0
```

### #.add

Adds a prefix into the Trie. If the prefix is a string, it will be split into characters. Else, you can provide an array of custom tokens.

`O(m)`, m being the size of the inserted string.

```js
const trie = new Trie();
trie.add('hello');

trie.has('hello');
>>> true

// Using custom tokens
trie.add(['I', 'am', 'very', 'happy']);
```

### #.delete

Deletes a prefix from the Trie. Returns `true` if the prefix was deleted & `false` if the prefix was not in the Trie.

`O(m)`, m being the size of the deleted string.

```js
const trie = new Trie();
trie.add('hello');

trie.delete('hello');
>>> true

trie.delete('world');
>>> false
```

### #.clear

Completely clears the trie.

```js
const trie = new Trie();
trie.add('hello');
trie.add('roman');

trie.clear();

trie.size
>>> 0
```

### #.has

Returns whether the given prefix exists in the trie.

`O(m)`, m being the size of the searched string.

```js
const trie = new Trie();
trie.add('hello');

trie.has('hello');
>>> true

trie.has('world');
>>> false
```

### #.find

Returns an array of every prefixes found in the trie with the given prefix.

`O(m + n)`, m being the size of the query, n being the cumulated size of the matched prefixes.

```js
const trie = new Trie();
trie.add('roman');
trie.add('romanesque');
trie.add('greek');

trie.find('rom');
>>> ['roman', 'romanesque']

trie.find('gr');
>>> ['greek']

trie.find('hel');
>>> []
```

### #.keys

Alias of [#.prefixes](#prefixes).

### #.prefixes

Returns an iterator over the trie's prefixes (note that the order on which the trie will iterate over its prefixes is arbitrary).

```js
const trie = Trie.from(['roman', 'romanesque']);

const iterator = trie.prefixes();

iterator.next().value
>>> 'roman'
```

### Iterable

Alternatively, you can iterate over a trie's prefixes using ES2015 `for...of` protocol:

```js
const trie = Trie.from(['roman', 'romanesque']);

for (const prefix of trie) {
  console.log(prefix);
}
```
