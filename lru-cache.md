---
layout: page
title: LRU Cache
---

The `LRUCache`, `LRU` standing for *least recently used*, can be seen as a a fixed-capacity key-value store that will evict infrequent items when full and setting new keys.

For instance, if one creates a `LRUCache` with a capacity of `1000` and one  inserts a thousand-and-first key, the cache will forget its least recently used key-value pair in order not to overflow the allocated memory.

This structure is very useful to cache the result of costly operations when one cannot afford to keep every result in memory and only want to keep the most frequent ones.

For more information, you can check [this](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) Wikipedia page.

This implementation has been designed to work with a javascript raw object. You can alternatively find an implementation relying on ES6's `Map` object [here]({{ site.baseurl }}/lru-map). Depending on the precise use case (string keys, integer keys etc.), one or the other might be faster depending on js engine magic.

```js
const LRUCache = require('mnemonist/lru-cache');
// If you need deletions
const LRUCacheWithDelete = require('mnemonist/lru-cache-with-delete');
```

## Constructor

The `LRUCache` takes a single argument: the desired capacity.

```js
const cache = new LRUCache(1000);
```

Optionally, you can type the used keys & values in order to be more memory-efficient:

```js
// First argument will be instantiated for keys, second one for values
const cache = new LRUCache(Uint32Array, Float32Array, 1000);
```

### Static #.from

Alternatively, one can build a `LRUCache` from an arbitrary JavaScript iterable likewise:

```js
// Attempting the guess the given iterable's length/size
const cache = LRUCache.from({one: 1, two: 2});
```
```js
// Providing the desired capacity
const cache = LRUCache.from({one: 1, two: 2}, 10);
```
```js
// Typing the cache
const cache = LRUCache.from({one: 1, two: 2}, Array, Uint8Array, 10);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.set](#set)
* [#.setpop](#setpop)
* [#.delete](#delete) (only on `LRUCacheWithDelete`)
* [#.remove](#remove) (only on `LRUCacheWithDelete`)
* [#.clear](#clear)

*Read*

* [#.get](#get)
* [#.peek](#peek)
* [#.has](#has)

*Iteration*

* [#.forEach](#foreach)
* [#.keys](#keys)
* [#.values](#values)
* [#.entries](#entries)
* [Iterable](#iterable)

### #.capacity

Maximum number of items the cache is able to store.

```js
const cache = new LRUCache(10);
cache.capacity
>>> 10
```

### #.size

Number of items actually in the cache.

```js
const cache = new LRUCache(10);
cache.size
>>> 0
cache.set('one', 1);
cache.size
>>> 1
```

### #.set

Sets a value for the given key in the cache. If the cache is already full, the least recently used key will be dropped from the cache.

`O(1)`

```js
const cache = new LRUCache(10);
cache.set('one', 1);
cache.has('one');
>>> true
```

### #.setpop

Sets a value for the given key in the cache. If the cache is already full, the least recently used key will be dropped from the cache, and an object containing the dropped key, dropped value and `evicted = true` will be returned. If the key already exists, an object containing the key, previous value and `evicted = false` will be returned. If no eviction or overwrite occurs, `null` is returned.

`O(1)`

```js
const cache = new LRUCache(1);
cache.setpop('one', 1);
>>> null
cache.setpop('one', 10);
>>> {key: 'one', value: 1, evicted: false}
cache.setpop('two', 2);
>>> {key: 'one', value: 10, evicted: true}
```

### #.delete

Deletes the given key and returns whether its was actually in the cache before deletion.

Beware, for performance reasons this method is only available on `LRUCacheWithDelete`.

`O(1)`

```js
const cache = new LRUCacheWithDelete(1);
cache.set('one', 1)

cache.delete('one');
>>> true

cache.delete('one');
>>> false
```

### #.remove

Deletes the given key and returns the associated value if the key was actually in the cache or a default value if it was not.

Beware, for performance reasons this method is only available on `LRUCacheWithDelete`.

`O(1)`

```js
const cache = new LRUCacheWithDelete(1);
cache.set('one', 1)

cache.remove('one');
>>> 1

cache.remove('one');
>>> undefined

cache.remove('one', 'not-found');
>>> 'not-found'
```

### #.clear

Completely clears the cache.

`O(1)`

```js
const cache = new LRUCache(10);
cache.set('one', 1);
cache.clear();

cache.has('one');
>>> false
cache.size
>>> 0
```

### #.get

Retrieves the value associated to the given key in the cache or `undefined` if the key is not found.

If the key is found, the key is moved to the front of the underlying list to be the most recently used item.

`O(1)`

```js
const cache = new LRUCache(10);
cache.set('one', 1);
cache.get('one');
>>> 1
```

### #.peek

Retrieves the value associated to the given key in the cache or `undefined` if the key is not found.

Unlike [`#.get`](#get), it does not modify the underlying list.

`O(1)`

```js
const cache = new LRUCache(10);
cache.set('one', 1);
cache.peek('one');
>>> 1
```

### #.has

Retrieves whether the given key exists in the cache.

`O(1)`

```js
const cache = new LRUCache(10);
cache.set('one', 1);
cache.has('one');
>>> true

cache.has('two');
>>> false
```

### #.forEach

Iterates over the cache from the most to the least recently used key-value pair.

```js
const cache = new LRUCache(10);

cache.set('one', 1);
cache.set('two', 2);

cache.forEach((value, key, cache) => {
  console.log(key, value);
});
```

### #.keys

Returns an iterator over the cache's keys from the most to the least recently used key.

```js
const cache = new LRUCache(10);

cache.set('one', 1);
cache.set('two', 2);

const iterator = cache.keys();

iterator.next().value
>>> 'two'
```

### #.values

Returns an iterator over the cache's values from the most to the least recently used value.

```js
const cache = new LRUCache(10);

cache.set('one', 1);
cache.set('two', 2);

const iterator = cache.values();

iterator.next().value
>>> 2
```

### #.entries

Returns an iterator over the cache's entries from the most to the least recently used entry.

```js
const cache = new LRUCache(10);

cache.set('one', 1);
cache.set('two', 2);

const iterator = cache.entries();

iterator.next().value
>>> ['two', 2]
```

### Iterable

Alternatively, you can iterate over a cache's entries using ES2015 `for...of` protocol:

```js
const cache = new LRUCache(10);

cache.set('one', 1);
cache.set('two', 2);

for (const [key, value] of cache) {
  console.log(key, value);
}
```
