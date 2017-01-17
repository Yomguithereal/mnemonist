---
layout: page
title: MultiIndex
---

The `MultiIndex` is basically an [`Index`]({{ site.baseurl }}/index-structure) that accepts more than one value per key and stores the colliding items in buckets.

```js
var MultiIndex = require('mnemonist/multi-index');
```

## Use case

Let's say we need to store items in an index using a fuzzy key so that we may match them against not so precise queries.

Furthermore, since the key produced might be the same for several items and because we want to keep multiple values for each key, we could use a `MultiIndex` to help us in this task.

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

The `MultiIndex` either takes a single argument being a hash function that will process both inserted items or keys & the queries; or a tuple containing two hash functions, one for the inserted items or keys and the second one for the queries.

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
var index = MultiIndex.from(list, hashFunction [, useSet=false]);
var index = MultiIndex.from(list, hashFunctions [, useSet=false]);
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
var index = new MultiIndex();
index.add({title: 'Hello World!'});

index.size
>>> 1
```

### #.add

Computes the item's key by hashing the given item using the relevant function then adds the item to the index using the key.

```js
var index = new MultiIndex();

index.add({title: 'Great movie', year: 1999});

// In fact, same as doing
var movie = {title: 'Great movie', year: 1999};
index.set(movie, movie);
```

### #.set

Adds an item to the index using the provided key that will be processed by the relevant hash function.

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

Hash the given key using the relevant function then returns the set of items stored by this key.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});
index.set('John', {name: 'John', surname: 'Williams'});
index.set('John', {name: 'John', surname: 'Ableton'});

index.get('john');
>>> [
  {name: 'John', surname: 'Williams'},
  {name: 'John', surname: 'Ableton'}
]
```

### #.forEach

Iterates over the values stored in the index.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('John', {name: 'John', surname: 'Williams'});
index.set('John', {name: 'John', surname: 'Ableton'});

index.forEach(function(value) {
  console.log(value);
});
>>> {name: 'John', surname: 'Williams'}
>>> {name: 'John', surname: 'Ableton'}
```

### #.values

Creates an iterator over the index's values.

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('John', {name: 'John', surname: 'Williams'});
index.set('John', {name: 'John', surname: 'Ableton'});

var iterator = index.values();
iterator.next().value();
>>> {name: 'John', surname: 'Williams'}
```

### Iterable

Alternatively, you can iterate over an index' values using ES2015 `for...of` protocol:

```js
var index = new MultiIndex(function(string) {
  return string.toLowerCase();
});

index.set('John', {name: 'John', surname: 'Williams'});
index.set('John', {name: 'John', surname: 'Ableton'});

for (var value of index) {
  console.log(value);
}
```
