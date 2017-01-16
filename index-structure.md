---
layout: page
title: Index
---

The index is a hashmap-like kind of data structure that will process the given values so that one may query them using arbitrary logic.

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

## Constructor

The `Index` either takes a single argument being a hash function that will process both inserted items or keys & the queries; or two arguments, the first being the hash function for the inserted items or keys and the second for the queries.

Alternatively, one may build a "complex" index by providing a list of descriptors that will each create a subindex based on different hash methods.

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
var index = new Index(
  
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
var index = new Index([
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
index.add({name: 'United Nations', 'UN'});

// Now we can query using various schemes
index.get('NATO');
>>> {name: 'North Atlantic Treaty Organization', acronym: 'NATO'};

index.get('united nations');
>>> {name: 'United Nations', 'UN'}

index.get('WHO');
>>> undefined

index.getBy('name', 'north Atlantic treaty OrganiZation');
>>> {name: 'North Atlantic Treaty Organization', acronym: 'NATO'}
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
var list = Index.from(list, hashFunction);
var list = Index.from(list, insertHashFunction, getHashFunction);
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
* [#.getFrom](#getfrom)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
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

Add an item to the index by computing its key from the first hash function.

```js
var index = new Index();

index.add({title: 'Great movie', year: 1999});
```

### #.set

Adds an item to the index using the provided key that will be processed by the first hash function.

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

In case of a complex index, every subindex will be tested until we find a relevant key.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});
index.set('hello world', 34);
index.get('Hello World');
>>> 34
```

### #.getFrom

Retrieves an item in the index using the provided key only in the desired subindex or list of prioritized subindices.

```js
var index = new Index([
  {
    name: 'lowercase',
    hash: function(string) {
      return string.toLowerCase();
    }
  },
  {
    name: 'firstLetter',
    hash: function(string) {
      return string[0];
    }
  },
  {
    name: 'lastLetter',
    hash: function(string) {
      return string[string.length - 1];
    }
  }
]);

// Getting an item by `firstLetter`
index.getFrom('firstLetter', 'Romanesque');

// Getting an item by `firstLetter` then `lowercase` in that order
index.getFrom(['firstLetter', 'lowercase'], 'Romanesque');
```

### #.forEach

Iterates over each item stored in the index.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

index.forEach(function(value, key) {
  console.log(key, value);
});
>>> 'hello', 1
>>> 'world', 2
```

### #.keys

Creates an iterator over the index's keys.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

var iterator = index.keys();
iterator.next().value();
>>> 'hello'
```

### #.values

Creates an iterator over the index's values.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

var iterator = index.values();
iterator.next().value();
>>> 1
```

### #.entries

Creates an iterator over the index's entries.

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

var iterator = index.entries();
iterator.next().value();
>>> [1, 'hello']
```

### Iterable

Alternatively, you can iterate over a list's entries using ES2015 `for...of` protocol:

```js
var index = new Index(function(string) {
  return string.toLowerCase();
});

index.set('Hello', 1);
index.set('World', 2);

for (var entry of list) {
  console.log(entry);
}
```
