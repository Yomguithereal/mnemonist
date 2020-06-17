---
layout: page
title: DefaultWeakMap
---

A `DefaultWeakMap` is a `WeakMap` that will use the given factory to automatically create values for non-existing keys on demand.
It's similar to [`DefaultMap`]({{ site.baseurl }}/default-map) but the keys are stored as weak references and can be garbage collected.
Keys must be objects, and cannot be primitive data types (string, number, bigint, boolean, undefined, and symbol).

```js
var DefaultWeakMap = require('mnemonist/default-weak-map');
```

## Use case

Sometimes, it might be tedious to check whether a key exists in a weak map before initializing the attached value and then proceed to operate on it.

This is the exact problem `DefaultWeakMap` tries to address.

Let's say we want to have keys pointing to arrays of values:

```js
const group1 = { room: '1' }
const group2 = { room: '2' }
const group3 = { room: '3' }

const personsToGroup = {
  John: group1,
  Martha: group2,
  Philip: group1,
  Lenny: group3
}

// We want:
// WeakMap {
//   group1 => ['John', 'Philip'],
//   group2 => ['Martha'],
//   group3 => ['Lenny']
// }

// Using a WeakMap
const map = new WeakMap();

for (const [person, group] of Object.entries(personsToGroup)) {
  // This is tedious & leads to more lookups if written carelessly
  if (!map.has(group))
    map.set(group, []);

  map.get(group).push(person);
}

// Using a DefaultWeakMap
const map = new DefaultWeakMap(() => []);

for (const [person, group] of Object.entries(personsToGroup)) {
  map.get(group).push(person);
}
```

But there are plenty of other use cases. Why not use the `DefaultWeakMap` with more complex containers?

```js
// Maps K => <V, number>
const map = new DefaultWeakMap(() => new MultiSet());

// Let's be creative :)
const map = new DefaultWeakMap(() => new DefaultMap(() => []));
```

## Constructor

The `DefaultWeakMap` takes a factory function as single argument.

```js
const map = new DefaultWeakMap(() => []);

const unknown = {};
map.get(unknown).push(45);

// The factory takes the key being accessed
const map = new DefaultWeakMap((key) => `${JSON.stringify(key)}`);
```

## Members & Methods

The `DefaultWeakMap` has the exact same interface as JavaScript's [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap). Except for the following:

* [#.peek](#peek)

### #.peek

Same as `#.get` except that it won't create a value using the provided factory if key is not found.

```js
const map = new DefaultWeakMap(() => []);
const one = {};

map.peek(one);
>>> undefined
```
