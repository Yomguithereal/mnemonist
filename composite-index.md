---
layout: page
title: Composite Index
---

The `CompositeIndex` is an abstraction over the [`Index`]({{ site.baseurl }}/index-structure) data structure.

It basically store the given items in various subindices in order to be able to query them using different methods.

```js
var CompositeIndex = require('mnemonist/composite-index');
```

## Use case

Let's say we  wan to process *"not-so-clean"* data concerning organizations and will need to merge entries coming from various sources related to the same organization.

We might have relevant information about our organizations such as a name and an acronym but maybe not both.

Therefore, we want an index able to store & query our organizations using various strategies so we are able to match our entries and merge them together.

```js
// Let's create an index that using two different hashing methods:
// 1. Lowercase organization name
// 2. Uppercase organization acronym
var index = new CompositeIndex([
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
  },
  {
    name: 'acronym',
    hash: [
      function(org) {
        return org.acronym.toUpperCase();
      },
      function(query) {
        return query.toUpperCase();
      }
    ]
  }
]);

// Inserting various organizations
index.add({
  name: 'North Atlantic Treaty Organization',
  acronym: 'nato'
});
index.add({
  name: 'United Nations',
  acronym: 'UN'
});
index.add({
  name: 'World Trade Organization'
});

// Now we can query the composite index (first hit will return)
index.get('NATO');
>>> {name: 'North Atlantic Treaty Organization', acronym: 'NATO'}

index.get('united nations');
>>> {name: 'United Nations', 'UN'}

index.get('WHO');
>>> undefined

// Now, let's say we have the following entry, with a year for NATO
var entry = {acronym: 'nato', year: 1947}

// We will be able to find it in the index & be able to merge information
var match = index.get(entry.acronym);
match.year = entry.year;
```

## Constructor

The `CompositeIndex` takes as single argument a list of subindices descriptors.

```js
// A descriptor must have a name & either a single hash function
{
  name: 'acronym',
  hash: function(string) {
    return string.toUpperCase();
  }
}

// Or a descriptor can have two hash functions
// One for insertion & the other for queries
{
  name: 'acronym',
  hash: [
    function(item) {
      return item.acronym.toUpperCase();
    },
    function(query) {
      return query.toUpperCase();
    }
  ]
}
```

**Warning!**: the index will not consider any falsy key processed by its hash functions.

```js
var index = new Index([
  {
    name: 'lowercase',
    hash: function(item) {
      return item.title && item.title.toLowerCase();
    }  
  }
]);

var movie = {year: 1999};

// This will not be indexed on `undefined`
index.set(movie.title, movie);
```

### Static #.from

Alternatively, one can build a `CompositeIndex` from an arbitrary JavaScript iterable likewise:

```js
var index = CompositeIndex.from(list, descriptors [, useSet=false]);
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

Number of distinct items stored in the index.

```js
var index = new CompositeIndex([
  {
    name: 'lowercase',
    hash: [
      function(item) {
        return item.title.toLowerCase();
      },
      function(query) {
        return query.toLowerCase();
      }
    ]
  },
  {
    name: 'uppercase',
    hash: [
      function(item) {
        return item.title.toUpperCase();
      },
      function(query) {
        return query.toUpperCase();
      }
    ]
  }
]);

index.add({title: 'Hello World!'});

// The item has been added to both subindices, but the size remains 1
// being the number of distinct items
index.size
>>> 1
```

### #.add

Hashes the given item to produce its keys using the relevant function then sets this item in each of the subindices for which the hashed key is not falsy.

```js
var index = new CompositeIndex({
  name: 'lowercase',
  hash: [
    function(item) {
      return item.title.toLowerCase();
    },
    function(query) {
      return query.toLowerCase();
    }
  ]
});

index.add({title: 'Great movie', year: 1999});

// In fact, same as doing
var movie = {title: 'Great movie', year: 1999};
index.set(movie, movie);
```

### #.set

Hashes the given key using the relevant function then sets the given item in each of the subindices for which the hashed key is not falsy.

```js
var index = new CompositeIndex({
  name: 'lowercase',
  hash: function(string) {
    return string.toLowerCase();
  }
});

var movie = {title: 'Great movie', year: 1999};

index.set(movie.title, movie);
```

### #.clear

Completely clears the index of its items.

```js
var index = new CompositeIndex(...);
index.add(item);
index.clear();

index.size
>>> 0
```

### #.get

Retrieves an item in the index by testing each of the subindices, or a subset of the subindices that you can test in an arbitrary order.

```js
var index = new CompositeIndex([
  {
    name: 'lowercase',
    hash: function(string) {
      return string.toLowerCase();
    }
  },
  {
    name: 'firstLetter',
    hash: function(string) {
      return string[0].toLowerCase();
    }
  },
  {
    name: 'lastLetter',
    hash: function(string) {
      return string[string.length - 1].toLowerCase();
    }
  }
]);

index.add('Romanesque');

// Testing every subindex
index.get('romanesque');
>>> 'Romanesque'

// Testing by `firstLetter` then `lowercase` in that order
index.has(['firstLetter', 'lowercase'], 'r');
>>> 'Romanesque'
```

### #.forEach

Iterates over the items stored in the index.

```js
var index = new CompositeIndex({
  name: 'lowercase',
  hash: function(string) {
    return string.toLowerCase();
  }
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
var index = new CompositeIndex({
  name: 'lowercase',
  hash: function(string) {
    return string.toLowerCase();
  }
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
var index = new CompositeIndex({
  name: 'lowercase',
  hash: function(string) {
    return string.toLowerCase();
  }
});

index.set('Hello', {name: 'hello'});
index.set('World', {name: 'world'});

for (var value of index) {
  console.log(value);
}
```
