# Trie

For more information about the Trie, you can head [here](https://en.wikipedia.org/wiki/Trie).

```js
var Trie = require('mnemonist/trie');
```

## Members

* [#.size](#size)

## Methods

* [#.add](#add)
* [#.delete](#delete)
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

```js
var trie = new Trie();
trie.add('hello');

trie.delete('hello');
>>> true

trie.delete('world');
>>> false
```

### #.has

Returns whether the given item exists in the trie.

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

```js
var trie = new Trie();
trie.add('roman');

trie.longestPrefix('romanesque');
>>> 'roman'
```

