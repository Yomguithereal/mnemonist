---
layout: page
title: Set (helpers)
---

Since ES2015, JavaScript has a perfectly fine `Set` object.

However, it direly lacks of some typical helpers such as functions computing the intersection between two sets.

That's what the `mnemonist/set` module provides.

```js
var helpers = require('mnemonist/set');
```

## Functions

*Functions returning a new set*

* [#.intersection](#intersection)
* [#.union](#union)
* [#.difference](#difference)
* [#.symmetricDifference](#symmetricdifference)

*Functions returning information about sets*

* [#.isSubset](#issubset)
* [#.isSuperset](#issuperset)

*Functions updating a set in-place*

* [#.add](#add)
* [#.subtract](#subtract)
* [#.intersect](#intersect)
* [#.disjunct](#disjunct)

*Functions used for counting*

* [#.intersectionSize](#intersectionsize)
* [#.unionSize](#unionsize)
* [#.jaccard](#jaccard)

### #.intersection

Returns the intersection of the given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.intersection(A, B);
>>> Set {2, 3}

// You can intersect as many sets as you want:
var C = new Set([1, 2]);

helpers.intersection(A, B, C);
>>> Set {2}
```

### #.union

Returns the union of the given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.union(A, B);
>>> Set {1, 2, 3, 4}

// You can unite as many sets as you want:
var C = new Set([1, 2]);

helpers.union(A, B, C);
>>> Set {1, 2, 3, 4}
```

### #.difference

Returns the difference of the given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.difference(A, B);
>>> Set {1}
```

### #.symmetricDifference

Returns the symmetric difference (disjunction) of the given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.symmetricDifference(A, B);
>>> Set {1, 4}
```

### #.isSubset

Returns whether the first set is a subset of the second one.

```js
var A = new Set([1, 2]),
    B = new Set([1, 2, 3]),
    C = new Set([1, 4]);

helpers.isSubset(A, B);
>>> true

helpers.isSubset(A, C);
>>> false
```

### #.isSuperset

Returns whether the first set is a superset of the second one.

```js
var A = new Set([1, 2]),
    B = new Set([1, 2, 3]),
    C = new Set([1, 4]);

helpers.isSuperset(B, A);
>>> true

helpers.isSuperset(A, C);
>>> false
```

### #.add

Adds the items of the second set to the first one in-place.

```js
var A = new Set([1, 2]);

helpers.add(A, new Set([2, 3]));

// A is now:
>>> Set {1, 2, 3}
```

### #.subtract

Subtracts the items of the second set from the first one in-place.

```js
var A = new Set([1, 2, 3, 4]);

helpers.subtract(A, new Set([1, 2]));

// A is now:
>>> Set {3, 4}
```

### #.intersect

Mutates the first set to become the intersection of both given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.intersect(A, B);

// A is now:
>>> Set {2, 3}
```

### #.disjunct

Mutates the first set to become the disjunction (symmetric difference) of both given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.disjunct(A, B);

// A is now:
>>> Set {1, 4}
```

### #.intersectionSize

Returns the size of the intersection of both given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.intersectionSize(A, B);
>>> 2

// This is faster and use less memory than:
helpers.intersection(A, B).size;
```

### #.unionSize

Returns the size of the union of both given sets.

```js
var A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

helpers.unionSize(A, B);
>>> 4

// This is faster and use less memory than:
helpers.union(A, B).size;
```

### #.jaccard

Returns the [Jaccard Index](https://en.wikipedia.org/wiki/Jaccard_index) or similarity (i.e. intersection divided by union) between both given sets.

```js
var contact = new Set('contact'),
    context = new Set('context');

helpers.jaccard(contact, context);
>>> 4 / 7
```
