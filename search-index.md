---
layout: page
title: Search Index
---

The `SearchIndex` is the name this library gives to an [`InvertedIndex`]({{ site.baseurl }}) storing additional & usually useful information such as occurrence, positions etc.

Furthermore, the `SearchIndex` is able to compute some metrics such as TF/IDF to help you score the results.

```js
var SearchIndex = require('mnemonist/search-index');
```

## Constructor

The `SearchIndex` either takes a single argument being a tokenizer function that will process both inserted items or keys & the queries; or a tuple containing two tokenizer functions, one for the inserted items or keys and the second one for the queries.

*Example with one tokenizer function*

```js
// Let's create an index using a single hash function:
var index = new SearchIndex(function(value) {
  return words(value);
});

// Then you'll probably use #.set to insert items
index.set(movie.title, movie);
index.get(queryTitle);
```

*Example with two tokenizer functions*

```js
// Let's create an index using two different hash functions:
var index = new Index([
  
  // Tokenizer function for inserted items:
  function(movie) {
    return words(movie.title);
  },

  // Tokenizer function for queries
  function(query) {
    return words(query);
  }
]);

// Then you'll probably use #.add to insert items
index.add(movie);
index.get(queryTitle);
```

### Static #.from

Alternatively, one can build an `SearchIndex` from an arbitrary JavaScript iterable likewise:

```js
var index = SearchIndex.from(list, tokenizer [, useSet=false]);
var index = SearchIndex.from(list, tokenizers [, useSet=false]);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.set](#set)
* [#.clear](#clear)

*Read*

* [#.get, #.intersection](#get)
* [#.union](#union)
* [#.phrase](#phrase)

### #.size

Number of documents stored in the index.

```js
var index = new SearchIndex(words);

index.add('The cat eats the mouse.');

index.size
>>> 1
```

### #.add

Tokenize the given document using the relevant function and adds it to the index.

```js
var index = new SearchIndex(words);

index.add('The cat eats the mouse.');
```

### #.set

Tokenize the given key using the relevant function and add the given document to the index.

```js
var index = new SearchIndex(words);

var doc = {text: 'The cat eats the mouse.', id: 34}

index.set(doc.text, doc);
```

### #.clear

Completely clears the index of its documents.

```js
var index = new SearchIndex(words);

index.add('The cat eats the mouse.');
index.clear();

index.size
>>> 1
```

// TODO: mind return values

### #.get, #.intersection

Tokenize the query using the relevant function, then retrieves the intersection of documents containing the resulting tokens.

```js
var index = new SearchIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

index.get('mouse');
>>> [
  'The cat eats the mouse.',
  'The mouse eats cheese.'
]

index.get('cat mouse');
```

### #.union

Tokenize the query using the relevant function, then retrieves the union of documents containing the resulting tokens.

```js
var index = new SearchIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

index.get('mouse');
>>> [
  'The cat eats the mouse.',
  'The mouse eats cheese.'
]

index.get('cat mouse');
>>> [
  'The cat eats the mouse.',
  'The mouse eats cheese.'
]
```
