---
layout: page
title: Fuzzy Map
---

The `FuzzyMap` is a map whoses keys are transformed by a function before any read or write operation. This can often result in multiple keys being able to access the same resource.

```js
var FuzzyMap = require('mnemonist/fuzzy-map');
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

That's it, you have understood the `FuzzyMap`. It's just some sugar over a JavaScript `Map` that will transform the given keys using a custom function to perform this kind of operations easily.

```js
var map = new FuzzyMap([
  
  // Hash function on add
  function(movie) {
    return movie.title.toLowerCase();
  },

  // Hash function on query
  function(query) {
    return query.toLowerCase();
  }
]);

// FuzzyMaping several movies
map.add({title: 'Great movie', year: 1999});
map.add({title: 'Bad movie', year: 2001});

// Querying the index
map.get('bad Movie');
>>> {name: 'Bad movie', year: 2001}

map.get('boring movie');
>>> undefined
```

Note that if you need to store multiple values under a same key, you should probably check out the [`FuzzyMultiMap`]({{ site.baseurl }}/fuzzy-multi-map) instead.

## Constructor

The `FuzzyMap` either takes a single argument being a hash function that will process both inserted items or keys & the queries; or a tuple containing two hash functions, one for the inserted items or keys and the second one for the queries.

*Example with one hash function*

```js
// Let's create an map using a single hash function:
var map = new FuzzyMap(function(value) {
  return value.toUpperCase();
});

// Then you'll probably use #.set to insert items
map.set(movie.title, movie);
map.get(queryTitle);
```

*Example with two hash functions*

```js
// Let's create an map using two different hash functions:
var map = new FuzzyMap([
  
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
map.add(movie);
map.get(queryTitle);
```

**Warning!**: the map will not consider any falsy key processed by its hash functions.

```js
var map = new FuzzyMap(function(item) {
  return item.title && item.title.toLowerCase();
});

var movie = {year: 1999};

// This will not be indexed on `undefined`
map.set(movie.title, movie);
```

### Static #.from

Alternatively, one can build a `FuzzyMap` from an arbitrary JavaScript iterable likewise:

```js
var map = FuzzyMap.from(list, hashFunction [, useSet=false]);
var map = FuzzyMap.from(list, hashFunctions [, useSet=false]);
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
* [#.has](#has)

*Iteration*

* [#.forEach](#foreach)
* [#.values](#values)
* [Iterable](#iterable)

### #.size

Number of items stored in the map.

```js
var map = new FuzzyMap();
map.add({title: 'Hello World!'});

map.size
>>> 1
```

### #.add

Computes the item's key by hashing the given item using the relevant function then adds the item to the map using the key.

`O(1)`

```js
var map = new FuzzyMap();

map.add({title: 'Great movie', year: 1999});

// In fact, same as doing
var movie = {title: 'Great movie', year: 1999};
map.set(movie, movie);
```

### #.set

Adds an item to the map using the provided key that will be processed by the relevant hash function.

`O(1)`

```js
var map = new FuzzyMap();
var movie = {title: 'Great movie', year: 1999};

map.set(movie.title, movie);
```

### #.clear

Completely clears the map of its items.

```js
var map = new FuzzyMap();
map.add(item);
map.clear();

map.size
>>> 0
```

### #.get

Retrieves an item in the map using the provided key that will be processed by the relevant hash function.

`O(1)`

```js
var map = new FuzzyMap(function(string) {
  return string.toLowerCase();
});
map.set('hello world', {name: 'hello world'});
map.get('Hello World');
>>> {name: 'hello world'}
```

### #.has

Test whether the provided key, processed by the relevant hash function, would return an item.

`O(1)`

```js
var map = new FuzzyMap(function(string) {
  return string.toLowerCase();
});
map.set('hello world', {name: 'hello world'});
map.has('Hello World');
>>> true
```

### #.forEach

Iterates over the values stored in the map.

```js
var map = new FuzzyMap(function(string) {
  return string.toLowerCase();
});

map.set('Hello', {name: 'hello'});
map.set('World', {name: 'world'});

map.forEach(function(value) {
  console.log(value);
});
>>> {name: 'hello'}
>>> {name: 'world'}
```

### #.values

Creates an iterator over the map's values.

```js
var map = new FuzzyMap(function(string) {
  return string.toLowerCase();
});

map.set('Hello', {name: 'hello'});
map.set('World', {name: 'world'});

var iterator = map.values();
iterator.next().value();
>>> {name: 'hello'}
```

### Iterable

Alternatively, you can iterate over an map' values using ES2015 `for...of` protocol:

```js
var map = new FuzzyMap(function(string) {
  return string.toLowerCase();
});

map.set('Hello', {name: 'hello'});
map.set('World', {name: 'world'});

for (var value of map) {
  console.log(value);
}
```
