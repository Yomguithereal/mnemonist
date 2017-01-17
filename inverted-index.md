---
layout: page
title: Inverted Index
---

An `InvertedIndex` is an index that considers the inserted items as a set of tokens that should all work as potential keys.

```js
var InvertedIndex = require('mnemonist/inverted-index');
```

## Use case

Usually, `InvertedIndex` are used to build full-text search.

Here is how it works:

1. Transform the inserted document into a set of tokens.
2. For each token, create an entry in an internal map being a set and add the document to it.

Let's see how we could search for documents using a very naive word tokenizer:

```js
// The `words` function from lodash is pretty good, for instance
var words = require('lodash/words');

var documents = [
  'The mouse is a gentle animal',
  'The cats eats the mouse',
  'The mouse eats cheese'
];

// Creating our inverted index with our `words` tokenizer function
var index = new InvertedIndex(words);

// Now we can query it
index.get('mouse');
>>> [
  'The mouse is a gentle animal',
  'The mouse eats cheese'
]

index.union('cats cheese');
>>> [
  'The cats eats the mouse',
  'The mouse eats cheese'
]
```

If you need more to retrieve more information about the indexed documents such as occurrences, positions etc., check out the [`SearchIndex`]({{ site.baseurl }}/search-index).

## Constructor

The `InvertedIndex` either takes a single argument being a tokenizer function that will process both inserted items or keys & the queries; or a tuple containing two tokenizer functions, one for the inserted items or keys and the second one for the queries.

*Example with one tokenizer function*

```js
// Let's create an index using a single hash function:
var index = new InvertedIndex(function(value) {
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

*Iteration*

* [#.forEach](#foreach)
* [#.tokens](#tokens)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)
