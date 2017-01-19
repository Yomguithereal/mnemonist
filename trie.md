---
layout: page
title: Trie
---

The trie - pronounced like in *re•trie•val* - is a actually a tree very useful for performing prefix queries efficiently.

For more information about the Trie, you can head [here](https://en.wikipedia.org/wiki/Trie).

```js
var Trie = require('mnemonist/trie');
```

## Use case

Let's say we have a list of strings and we want to be able to find them by a given prefix:

```js
var words = [
  'roman',
  'romanesque',
  'romanesco',
  'cat',
  'category'
];
```

A naive approach would be to compare each of our strings with the given prefix to find the matching ones:

```js
words.forEach(function(word) {
  if (word.startsWith(query))
    console.log('Matching prefix!', word);
});
```

Even if this approach is perfectly fine, we are going to need `O(n)` computations to find the matching words.

A trie, on the contrary, is able to answer this kind of query more efficiently:

```js
// Let's create a trie from our words
var trie = Trie.from(words);

// Now let's query our trie
var wordsWithMatchingPrefix = trie.get(query);
```

## Constructor

The `Trie` takes no argument.

### Static #.from

Alternatively, one can build a `Trie` from an arbitrary JavaScript iterable likewise:

```js
var list = Trie.from(['roman', 'romanesque']);
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
* [#.get](#get)
* [#.longestPrefix](#longestprefix)

### #.size

Number of items in the trie.

```js
var trie = new Trie();
trie.size
>>> 0
```

### #.add

Adds an item in to the Trie. If the item is a string, it will be split into characters. Else, you can provide an array of custom tokens.

`O(n)`, n being the size of the inserted string.

```js
var trie = new Trie();
trie.add('hello');

trie.has('hello');
>>> true

// Using custom tokens
trie.add(['I', 'am', 'very', 'happy']);
```

### #.delete

Deletes an item from the Trie. Returns `true` if the item was deleted & `false` if the item was not in the Trie.

`O(n)`, n being the size of the deleted string.

```js
var trie = new Trie();
trie.add('hello');

trie.delete('hello');
>>> true

trie.delete('world');
>>> false
```

### #.clear

Completely clears the trie of its items.

```js
var trie = new Trie();
trie.add('hello');
trie.add('roman');

trie.clear();

trie.size
>>> 0
```

### #.has

Returns whether the given item exists in the trie.

`O(n)`, n being the size of the searched string.

```js
var trie = new Trie();
trie.add('hello');

trie.has('hello');
>>> true

trie.has('world');
>>> false
```

### #.get

Returns an array of every items found in the trie with the given prefix.

`O(m)`, m being the size of the query.

```js
var trie = new Trie();
trie.add('roman');
trie.add('romanesque');
trie.add('greek');

trie.get('rom');
>>> ['roman', 'romanesque']

trie.get('gr');
>>> ['greek']

trie.get('hel');
>>> []
```

### #.longestPrefix

Returns the longest matching prefix in the trie for the given item.

`O(m)`, m being the size of the query.

```js
var trie = new Trie();
trie.add('roman');

trie.longestPrefix('romanesque');
>>> 'roman'
```

