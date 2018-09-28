---
layout: page
title: DefaultMap
---

A `DefaultMap` is simply a `Map` that will use the given factory to automatically create values for non-existing keys on demand.

It's basically the same thing as python's renowned [defaultdict](https://docs.python.org/3.7/library/collections.html#collections.defaultdict).

```js
var DefaultMap = require('mnemonist/default-map');
```

## Use case

Sometimes, it might be tedious to check whether a key exists in a map before initializing the attached value and then proceed to operate on it.

This is the exact problem `DefaultMap` tries to address.

Let's say we want to have keys pointing to arrays of values:

```js
var personsToGroup = {
  John: 1,
  Martha: 2,
  Philip: 1,
  Lenny: 3
}

// We want:
// Map {
//   1 => ['John', 'Philip'],
//   2 => ['Martha'],
//   3 => ['Lenny']
// }

// Using a Map
var map = new Map();

for (var person in personsToGroup) {
  var group = personsToGroup[person];

  // This is tedious & leads to more lookups if written carelessly
  if (!map.has(group))
    map.set(group, []);

  map.get(group).push(person);
}

// Using a DefaultMap
var map = new DefaultMap(() => []);

for (var person in personsToGroup) {
  var group = personsToGroup[person];

  map.get(group).push(person);
}
```

But there are plenty of other use cases. Why not use the `DefaultMap` with more complex containers?

```js
// Maps K => <V, number>
var map = new DefaultMap(() => new MultiSet());

// Let's be creative :)
var map = new DefaultMap(() => new DefaultMap(() => []));
```

## Constructor

The `DefaultMap` takes a factory function as single argument.

```js
var map = new DefaultMap(() => []);

map.get('unknown').push(45);

// The factory takes the name of the key and the current size of the map
var map = new DefaultMap((key, size) => `${key}-${size}`);
```

## Members & Methods

The `DefaultMap` has the exact same interface as JavaScript's [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
