---
layout: page
title: SymSpell
---

The Symmetric delete spelling correction index is a data-structure used for spelling correction & fuzzy search.

It has been designed by [Wolfe Garbe](https://github.com/wolfgarbe) and aims at being more performant that previous solutions such as the [Burkhard-Keller]({{ site.baseurl }}/bk-tree).

However, it really shines when you want the max edit distance between your queries & items stored in the index to be quite small - 2 or 3 for instance. Else it begins to need a lot of space and its efficiency will drop.

For more information, you can head toward [this](http://blog.faroo.com/2015/03/24/fast-approximate-string-matching-with-large-edit-distances/) seminal blog post.

```js
var SymSpell = require('mnemonist/symspell');
```

## Use case

Let's say we want to build an autocomplete system.

When the user inputs a string, we are going to search for every term we know being at most at a Levenshtein distance of 2 of the user's query.

The naive method would be to "brute-force" the list of terms likewise:

```js
var suggestions = terms.filter(term => {
  return levenshtein(term, query) <= 2;
});
```

But, even if this works with few terms, it will soon become hard to compute if the list of terms grows too much.

SymSpell indexes solves this problem by indexing the list of terms such as it becomes efficient to query them in a fuzzy way.

```js
var index = SymSpell.from(terms);

// We can now query the index easily:
var suggestions = index.search(query);
```

## Constructor

The `SymSpell` takes a single optional argument being some options.

```js
var index = new SymSpell(options);
```

*Example with a higher max distance*

```js
var index = new SymSpell({
  maxDistance: 3
});
```

*Options*

* **maxDistance** <code class="type">[number=2]</code> - maximum edit distance between stored terms and query.
* **verbosity** <code id="verbosity" class="type">[number=2]</code> - verbosity of the index:
  - <code class="type">0</code>: Returns only the top suggestion.
  - <code class="type">1</code>: Returns suggestions with the smallest edit distance.
  - <code class="type">2</code>: Returns every found suggestion.

### Static #.from

Alternatively, one can build a `SymSpell` from an arbitrary JavaScript iterable likewise:

```js
var index = SymSpell.from(['hello', 'mello'], options);
```

## Members

* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)
* [#.clear](#clear)

*Read*

* [#.search](#search)

### #.size

Total number of items stored in the index.

```js
var index = new SymSpell();

index.add('hello');

index.size
>>> 1
```

### #.add

Adds a single item to the index.

```js
var index = new SymSpell();

index.add('hello');
```

### #.clear

Completely clears the index of its items.

```js
var index = new SymSpell();

index.add('hello');
index.clear();

index.size
>>> 0
```

### #.search

Returns every item relevant to the given query.

```js
var index = new SymSpell();

index.add('hello');
index.add('mello');
index.add('roman');

index.search('vello');
>>> [
  {item: 'hello', distance: 1, count: 1}
  {item: 'mello', distance: 1, count: 1}
]
```
