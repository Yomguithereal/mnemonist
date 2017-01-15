---
layout: page
title: MultiIndex
---

The `MultiIndex` is very similar to the [`Index`]({{ site.baseurl }}/index-structure) in that it relies on hash functions to process the given items or keys

However, the `MultiIndex` is slightly different because it will accept more than one value per key, holding every item in a bucket of colliding keys.

```js
var MultiIndex = require('mnemonist/multi-index');
```

## Use case

Let's say we need to store items in an index using a fuzzy key so that we may match them against not so precise queries. We could use a `MultiIndex` to help us do so:

```js
// Using lodash to create a naive fuzzy key using the given title
function fuzzyTitle(title) {
  return _.words(title.toLowerCase()).sort().join(' ');
}

// Creating our index
var index = new MultiIndex(fuzzyTitle);

// Adding some universities
var universities = [
  {name: 'University of Carolina'},
  {name: 'Carolina, university of.'},
  {name: 'Harvard university'}
];

universities.forEach(function(university) {
  index.set(university.name, university);
});

// Now we can query the index
universities.get('university of carolina');
>>> [
  {name: 'University of Carolina'},
  {name: 'Carolina, university of.'}
]
```

## Constructor

The `MultiIndex` either takes a single argument being a hash function that will process both inserted items or keys & the queries; or two arguments, the first being the hash function for the inserted items or keys and the second for the queries.

*Example with one hash function*

```js
// Let's create an index using a single hash function:
var index = new MultiIndex(function(value) {
  return value.toUpperCase();
});

// Then you'll probably use #.set to insert items
index.set(movie.title, movie);
index.get(queryTitle);
```

*Example with two hash functions*

```js
// Let's create an index using two different hash functions:
var index = new MultiIndex(
  
  // Hash function for inserted items:
  function(movie) {
    return movie.title.toLowerCase();
  },

  // Hash function for queries
  function(query) {
    return query.toLowerCase();
  }
);

// Then you'll probably use #.add to insert items
index.add(movie);
index.get(queryTitle);
```

### Static #.from

Alternatively, one can build a `MultiIndex` from an arbitrary JavaScript iterable likewise:

```js
var list = MultiIndex.from(list, hashFunction);
var list = MultiIndex.from(list, insertHashFunction, getHashFunction);
```

## Members

* [#.size](#size)
* [#.buckets](#buckets)

## Methods

*Mutation*

* [#.add](#add)
* [#.set](#set)
* [#.clear](#clear)

*Read*

* [#.get](#get)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.size

Number of items stored in the index.

```js
var index = new MultiIndex();
index.add({title: 'Hello World!'});

index.size
>>> 1
```

### #.buckets

Number of different keys existing in the index.

```js
var index = new MultiIndex();
index.set('key1', movie1);
index.set('key1', movie2);

index.buckets
>>> 1
```

### #.add

Add an item to the index by computing its key from the first hash function.

```js
var index = new MultiIndex();

index.add({title: 'Great movie', year: 1999});
```

### #.set

Adds an item to the index using the provided key that will be processed by the first hash function.

```js
var index = new MultiIndex();
var movie = {title: 'Great movie', year: 1999};

index.set(movie.title, movie);
```

### #.clear

Completely clears the index of its items.

```js
var index = new MultiIndex();
index.add(item);
index.clear();

index.size
>>> 0
```

### #.get

Retrieves a list of items in the index using the provided key that will be processed by the relevant hash function.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});
index.set('hello world', 34);
index.set('hello WorldD', 54);
index.get('Hello World');
>>> [34, 54]
```

### #.forEach

Iterates over each bucket stored in the index.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

index.forEach(function(value, key) {
  console.log(key, value);
});
>>> 'hello', [1]
>>> 'world', [2]
```

### #.keys

Creates an iterator over the index's keys.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

var iterator = index.keys();
iterator.next().value();
>>> 'hello'
```

### #.values

Creates an iterator over the index's values (being buckets).

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

var iterator = index.values();
iterator.next().value();
>>> [1]
```

### #.entries

Creates an iterator over the index's entries.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

var iterator = index.entries();
iterator.next().value();
>>> [[1], 'hello']
```

### Iterable

Alternatively, you can iterate over a list's entries using ES2015 `for...of` protocol:

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

for (var entry of list) {
  console.log(entry);
}
```
