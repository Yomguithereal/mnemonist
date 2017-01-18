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
