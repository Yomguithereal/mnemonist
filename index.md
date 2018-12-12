---
layout: home
---

<p align="center">
  <strong>
    Curated collection of data structures for the JavaScript language.
  </strong>
  <br>
  <br>
</p>

---

Mnemonist is a collection of data structures implemented in JavaScript.

It gathers classic data structures (think [heap]({{ site.baseurl }}/heap), [trie]({{ site.baseurl }}/trie) etc.) as well as more exotic ones such as [Burkhard-Keller trees]({{ site.baseurl }}/bk-tree) etc.

It strives at being:

* As performant as possible for a high-level language.
* Completely modular (don't need to import the whole library just to use a simple heap).
* Simple & straightforward to use and consistent with JavaScript standard objects' API.
* Completely typed and comfortably usable with Typescript.

## Installation

You can download the source directly from the Github [repository]({{ site.github }}) or using npm:

```bash
npm install --save mnemonist
```

## Documentation

**Classics**

* [Heap]({{ site.baseurl }}/heap)
* [Linked List]({{ site.baseurl }}/linked-list)
* [LRUCache]({{ site.baseurl }}/lru-cache), [LRUMap]({{ site.baseurl }}/lru-map)
* [MultiMap]({{ site.baseurl }}/multi-map)
* [MultiSet]({{ site.baseurl }}/multi-set)
* [Queue]({{ site.baseurl }}/queue)
* [Set (helpers)]({{ site.baseurl }}/set)
* [Stack]({{ site.baseurl }}/stack)
* [Trie]({{ site.baseurl }}/trie)
* [TrieMap]({{ site.baseurl }}/trie-map)

**Low-level & structures for very specific use cases**

* [Circular Buffer]({{ site.baseurl }}/circular-buffer)
* [Fibonacci Heap]({{ site.baseurl }}/fibonacci-heap)
* [Fixed Reverse Heap]({{ site.baseurl }}/fixed-reverse-heap)
* [Fixed Stack]({{ site.baseurl }}/fixed-stack)
* [Hashed Array Tree]({{ site.baseurl }}/hashed-array-tree)
* [Static DisjointSet]({{ site.baseurl }}/static-disjoint-set)
* [SparseSet]({{ site.baseurl }}/sparse-set)
* [Suffix Array]({{ site.baseurl }}/suffix-array)
* [Generalized Suffix Array]({{ site.baseurl }}/generalized-suffix-array)
* [Vector]({{ site.baseurl }}/vector)

**Information retrieval & Natural language processing**

* [Fuzzy Map]({{ site.baseurl }}/fuzzy-map)
* [Fuzzy MultiMap]({{ site.baseurl }}/fuzzy-multi-map)
* [Inverted Index]({{ site.baseurl }}/inverted-index)
* [SymSpell]({{ site.baseurl }}/symspell)

**Space & time indexation**

* [Static IntervalTree]({{ site.baseurl }}/static-interval-tree)

**Metric space indexation**

* [Burkhard-Keller Tree]({{ site.baseurl }}/bk-tree)
* [Vantage Point Tree]({{ site.baseurl }}/vp-tree)

**Probabilistic & succinct data structures**

* [BitSet]({{ site.baseurl }}/bit-set)
* [BitVector]({{ site.baseurl }}/bit-vector)
* [Bloom Filter]({{ site.baseurl }}/bloom-filter)

**Utility classes**

* [BiMap]({{ site.baseurl }}/bi-map)
* [IncrementalMap]({{ site.baseurl }}/incremental-map)
* [DefaultMap]({{ site.baseurl }}/default-map)

---

Note that this list does not include a `Graph` data structure whose implementation is usually far too complex for the scope of this library.

However, we advise the reader to take a look at the [`graphology`](https://graphology.github.io/) library instead.

Don't find the data structure you need? Maybe we can work it out [together]({{ site.github }}/issues).

## Contribution

Contributions are obviously welcome. Be sure to lint the code & add relevant unit tests.

```bash
# Installing
git clone git@github.com:Yomguithereal/mnemonist.git
cd mnemonist
npm install

# Linting
npm run lint

# Running the unit tests
npm test
```

## Changelog

The full changelog for the library can be found [here](https://github.com/Yomguithereal/mnemonist/blob/master/CHANGELOG.md#changelog).

## About

This documentation has been built using [Jekyll](https://jekyllrb.com/), using the [Papyrus](https://github.com/hugoferreira/papyrus-theme) theme by [@hugoferreira](https://github.com/hugoferreira).

## License

MIT
