---
layout: page
title: Inverted Index
---

An `InvertedIndex` is an index that considers the inserted documents as a set of tokens that are all keys that one can use to retrieve the documents.

```js
var InvertedIndex = require('mnemonist/inverted-index');
```

## Use case

Usually, `InvertedIndex` are used to build full-text search engines.

Here is how it works:

1. Transform the inserted document into a set of tokens.
2. For each token, add an entry to an internal map with the key being the token & the value being the document.

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

<!-- If you need more to retrieve more information about the indexed documents such as occurrences, positions etc., check out the [`SearchIndex`]({{ site.baseurl }}/search-index). -->

## Constructor

The `InvertedIndex` either takes a single argument being a tokenizer function that will process both inserted items or keys & the queries; or a tuple containing two tokenizer functions, one for the inserted items or keys and the second one for the queries.

*Example with one tokenizer function*

```js
// Let's create an index using a single hash function:
var index = new InvertedIndex(function(value) {
  return words(value);
});

index.add('The mouse likes cheese.');
index.query('cheese');
```

*Example with two tokenizer functions*

```js
// Let's create an index using two different hash functions:
var index = new Index([
  
  // Tokenizer function for inserted documents:
  function(doc) {
    return words(doc.text);
  },

  // Tokenizer function for queries
  function(query) {
    return words(query);
  }
]);

// Then you'll probably use #.add to insert items
index.add({text: 'The mouse likes cheese.'});
index.query('mouse');
```

### Static #.from

Alternatively, one can build an `InvertedIndex` from an arbitrary JavaScript iterable likewise:

```js
var index = InvertedIndex.from(list, tokenizer);
var index = InvertedIndex.from(list, tokenizers);
```

## Members

* [#.size](#size)
* [#.dimension](#dimension)

## Methods

*Mutation*

* [#.add](#add)
* [#.clear](#clear)

*Read*

* [#.get](#get)

*Iteration*

* [#.forEach](#foreach)
* [#.documents](#documents)
* [#.tokens](#tokens)
* [Iterable](#iterable)

### #.size

Number of documents stored in the index.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');

index.size
>>> 1
```

### #.dimension

Number of distinct tokens stored in the index (size of the dictionary, if you will).

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');

index.dimension
>>> 4
```

### #.add

Tokenize the given document using the relevant function and adds it to the index.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
```

### #.clear

Completely clears the index of its documents.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
index.clear();

index.size
>>> 0
```

### #.get

Tokenize the query using the relevant function, then retrieves the intersection of documents containing the resulting tokens.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

index.query('mouse');
>>> [
  'The cat eats the mouse.',
  'The mouse eats cheese.'
]

index.query('cat mouse');
>>> [
  'The cat eats the mouse.'
]
```

### #.forEach

Iterates over the index by applying the callback to every stored document.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

index.forEach(function(doc) {
  console.log(doc);
});
```

### #.documents

Returns an iterator over the index's documents.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

var iterator = index.documents();

iteraror.next().value
>>> 'The cat eats the mouse.'
```

### #.tokens

Returns an iterator over the index's tokens.

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

var iterator = index.tokens();

iterator.next().value
>>> 'The'
```

### Iterable

Alternatively, you can iterate over an index's documents using ES2015 `for...of` protocol:

```js
var index = new InvertedIndex(words);

index.add('The cat eats the mouse.');
index.add('The mouse eats cheese.');

for (var doc of index) {
  console.log(doc);
}
```

