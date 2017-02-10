---
layout: page
title: Index
---

The index is a hashmap-like kind of data structure that takes items and hash them to find by which key they will be known thereafter when querying.

```js
var Index = require('mnemonist/index');
```

## Use case

Let's say we want to store & query objects representing movies based on their lowercased title. One approach would be to create a JavaScript object & lowercase the correct movies' property to use as key:

```js
var movie = {
  name: 'Great Movie',
  year: 1999
};

var object = {};

// Let's insert our movie using the lowercased title as key
var key = movie.name.toLowerCase();
object[key] = movie;

// Now, to query:
var query = 'great MoVie';
console.log(object[query.toLowerCase()]);
```

That's it, you have understood the `Index`. It's just some sugar over a JavaScript `Map` that will "hash" the given keys using a custom function to perform this kind of operations easily.

```js
var index = new Index(
  
  // Hash function on add
  function(movie) {
    return movie.title.toLowerCase();
  },

  // Hash function on query
  function(query) {
    return query.toLowerCase();
  }
);

// Indexing several movies
index.add({name: 'Great movie', year: 1999});
index.add({name: 'Bad movie', year: 2001});

// Querying the index
index.get('bad Movie');
>>> {name: 'Bad movie', year: 2001}

index.get('boring movie');
>>> undefined
```

Note that if you need to store multiple values under a same key, you should probably check out the [`MultiIndex`]({{ site.baseurl }}/multi-index) instead.

<!-- You can also check out the [`CompositeIndex`]({{ site.baseurl }}/composite-index) if you need to store your items using multiple strategies at once. -->

## Constructor

The `Index` either takes a single argument being a hash function that will process both inserted items or keys & the queries; or a tuple containing two hash functions, one for the inserted items or keys and the second one for the queries.

*Example with one hash function*

```js
// Let's create an index using a single hash function:
var index = new Index(function(value) {
  return value.toUpperCase();
});

// Then you'll probably use #.set to insert items
index.set(movie.title, movie);
index.get(queryTitle);
```

*Example with two hash functions*

```js
// Let's create an index using two different hash functions:
var index = new Index([
  
  // Hash function for inserted items:
  function(movie) {
    return movie.title.toLowerCase();
  },

  // Hash function for queries
  function(query) {
    return query.toLowerCase();
  }
]);

// Then you'll probably use #.add to insert items
index.add(movie);
index.get(queryTitle);
```

**Warning!**: the index will not consider any falsy key processed by its hash functions.

```js
var index = new Index(function(item) {
  return item.title && item.title.toLowerCase();
});

var movie = {year: 1999};

// This will not be indexed on `undefined`
index.set(movie.title, movie);
```

### Static #.from

Alternatively, one can build a `Index` from an arbitrary JavaScript iterable likewise:

```js
var index = Index.from(list, hashFunction [, useSet=false]);
var index = Index.from(list, hashFunctions [, useSet=false]);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.set](#set)
* [#.clear](#clear)

*Read*

* [#.get](#get)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [Iterable](#iterable)

### #.size

Number of items stored in the index.

```js
var index = new Index();
index.add({title: 'Hello World!'});

index.size
>>> 1
```

### #.add

Computes the item's key by hashing the given item using the relevant function then adds the item to the index using the key.

```js
var index = new Index();

index.add({title: 'Great movie', year: 1999});

// In fact, same as doing
var movie = {title: 'Great movie', year: 1999};
index.set(movie, movie);
```

### #.set

Adds an item to the index using the provided key that will be processed by the relevant hash function.

```js
var index = new Index();
var movie = {title: 'Great movie', year: 1999};

index.set(movie.title, movie);
```

### #.clear

Completely clears the index of its items.

```js
var index = new Index();
index.add(item);
index.clear();

index.size
>>> 0
```

### #.get

Retrieves an item in the index using the provided key that will be processed by the relevant hash function.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});
index.set('hello world', {name: 'hello world'});
index.get('Hello World');
>>> {name: 'hello world'}
```

### #.forEach

Iterates over the values stored in the index.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', {name: 'hello'});
index.set('World', {name: 'world'});

index.forEach(function(value) {
  console.log(value);
});
>>> {name: 'hello'}
>>> {name: 'world'}
```

### #.values

Creates an iterator over the index's values.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', {name: 'hello'});
index.set('World', {name: 'world'});

var iterator = index.values();
iterator.next().value();
>>> {name: 'hello'}
```

### Iterable

Alternatively, you can iterate over an index' values using ES2015 `for...of` protocol:

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', {name: 'hello'});
index.set('World', {name: 'world'});

for (var value of index) {
  console.log(value);
}
```
