---
layout: page
title: MultiIndex
---

The `MultiIndex` is very similar to the [`Index`]({{ site.baseurl }}/index-structure) in that it relies on hash functions to process the given items or keys.

However, the `MultiIndex` is slightly different because it can accept more than one value per key, holding every item in a bucket of colliding keys.

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
>>> Set {
  {name: 'University of Carolina'},
  {name: 'Carolina, university of.'}
}
```

## Constructor

The `MultiIndex` either takes a single argument being a hash function that will process both inserted items or keys & the queries; or two arguments, the first being the hash function for the inserted items or keys and the second for the queries.

Alternatively, one may build a "complex" index by providing a list of descriptors that will each create a subindex based on different hash methods.

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

*Example with a complex index*

```js
// Let's create an index that will use two different hashing methods
// 1. By organization acronym
// 2. Lowercase organization name
var index = new MultiIndex([
  {
    name: 'acronym',
    hash: [
      function(org) {
        return org.acronym;
      },

      // Using null here is the same as passing the identity function
      // because the query should not be hashed.
      null
    ]
  },
  {
    name: 'name',
    hash: [
      function(org) {
        return org.name.toLowerCase();
      },
      function(query) {
        return query.toLowerCase();
      }
    ]
  }
]);

// Inserting some organizations
index.add({name: 'North Atlantic Treaty Organization', acronym: 'NATO'});
index.add({acronym: 'NATO', year: 1949});
index.add({name: 'United Nations', 'UN'});

// Now we can query using various schemes
index.get('NATO');
>>> Set {
  {name: 'North Atlantic Treaty Organization', acronym: 'NATO'},
  {acronym: 'NATO', year: 1949}
}

index.get('united nations');
>>> Set {
  {name: 'United Nations', 'UN'}
}

index.get('WHO');
>>> undefined

index.getBy('name', 'north Atlantic treaty OrganiZation');
>>> Set {
  {name: 'North Atlantic Treaty Organization', acronym: 'NATO'}
}
```

**Warning!**: the index will not consider any falsy key processed by its hash functions.

```js
var index = new MultiIndex(function(item) {
  return item.title && item.title.toLowerCase();
});

var movie = {year: 1999};

// This will not be indexed on `undefined`
index.set(movie.title, movie);
```

### Static #.from

Alternatively, one can build a `MultiIndex` from an arbitrary JavaScript iterable likewise:

```js
var list = MultiIndex.from(list, hashFunction);
var list = MultiIndex.from(list, insertHashFunction, getHashFunction);
var index = MultiIndex.from(list, descriptors);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.set](#set)
* [#.delete](#delete) TODO
* [#.clear](#clear)

*Read*

* [#.has](#has) TODO
* [#.get](#get)
* [#.getFrom](#getfrom) TODO
* [#.union](#union) TODO
* [#.unionFrom](#unionFrom) TODO

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [Iterable](#iterable)

### #.size

Number of distinct items stored in the index.

```js
var index = new MultiIndex();
index.add({title: 'Hello World!'});

index.size
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
>>> Set {34, 54}
```

### #.forEach

Iterates over each values stored in the index.

```js
var index = new MultiIndex(function(string) {
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

Creates an iterator over the index's values (being buckets).

```js
var index = new MultiIndex(function(string) {
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
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('Hello', {name: 'hello'});
index.set('World', {name: 'world'});

for (var value of index) {
  console.log(value);
}
```
