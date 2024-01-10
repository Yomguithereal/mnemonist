---
layout: page
title: DefaultMap
---

A `DefaultMap` is simply a `Map` that will use the given factory to automatically create values for non-existing keys on demand.

It's basically the same thing as python's renowned [defaultdict](https://docs.python.org/3.7/library/collections.html#collections.defaultdict).

```js
const DefaultMap = require('mnemonist/default-map');
```

## Use case

Sometimes, it might be tedious to check whether a key exists in a map before initializing the attached value and then proceed to operate on it.

This is the exact problem `DefaultMap` tries to address.

Let's say we want to have keys pointing to arrays of values:

```js
const personsToGroup = {
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
const map = new Map();

for (const person in personsToGroup) {
  const group = personsToGroup[person];

  // This is tedious & leads to more lookups if written carelessly
  if (!map.has(group))
    map.set(group, []);

  map.get(group).push(person);
}

// Using a DefaultMap
const map = new DefaultMap(() => []);

for (const person in personsToGroup) {
  const group = personsToGroup[person];

  map.get(group).push(person);
}
```

But there are plenty of other use cases. Why not use the `DefaultMap` with more complex containers?

```js
// Maps K => <V, number>
const map = new DefaultMap(() => new MultiSet());
```
```js
// Let's be creative :)
const map = new DefaultMap(() => new DefaultMap(() => []));
```

## Constructor

The `DefaultMap` takes a factory function as single argument.

```js
const map = new DefaultMap(() => []);

map.get('unknown').push(45);

// The factory takes the name of the key and the current size of the map
const map = new DefaultMap((key, size) => `${key}-${size}`);
```

## Members & Methods

The `DefaultMap` has the exact same interface as JavaScript's [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). Except for the following:

* [#.peek](#peek)

### #.peek

Same as `#.get` except that it won't create a value using the provided factory if key is not found.

```js
const map = new DefaultMap(() => []);

map.peek('one');
>>> undefined
map.size
>>> 0
```

## Typical factories

* [autoIncrement](#autoincrement)

### autoIncrement

A factory that will create a new incremental key for each unseen key.

```js
const map = new DefaultMap(DefaultMap.autoIncrement());

map.get('unknown-one');
>>> 0
map.get('unknown-two');
>>> 1
```
