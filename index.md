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

It gathers classic data structures (think [heap]({{ site.baseurl }}/heap), [trie]({{ site.baseurl }}/trie) etc.) as well as more exotic ones such as [Burkhard-Keller trees]({{ site.baseurl }}/bk-tree) etc.

It strives at being:

* As performant as possible for a high-level language.
* Completely modular (don't need to import the whole library just to use a simple heap).
* Simple & straightforward to use and consistent with JavaScript standard objects' API.

## Installation

You can download the source directly from the Github [repository]({{ site.github }}) or using npm:

```bash
npm install --save mnemonist
```

## Documentation

* [Burkhard-Keller Tree]({{ site.baseurl }}/bk-tree)
* [Bloom Filter]({{ site.baseurl }}/bloom-filter)
* [Fibonacci Heap]({{ site.baseurl }}/fibonacci-heap)
* [Heap]({{ site.baseurl }}/heap)
* [Index]({{ site.baseurl }}/index-structure)
* [Linked List]({{ site.baseurl }}/linked-list)
* [MultiMap]({{ site.baseurl }}/multi-map)
* [MultiSet]({{ site.baseurl }}/multi-set)
* [Queue]({{ site.baseurl }}/queue)
* [Stack]({{ site.baseurl }}/stack)
* [Suffix Array]({{ site.baseurl }}/suffix-array)
* [SymSpell]({{ site.baseurl }}/symspell)
* [Generalized Suffix Array]({{ site.baseurl }}/generalized-suffix-array)
* [Trie]({{ site.baseurl }}/trie)
* [Vantage Point Tree]({{ site.baseurl }}/vp-tree)

Note that this list does not include a `Graph` data structure whose implementation is usually far too complex for the scope of this library.

However, we advise the reader to take a look at the [`graphology`](https://graphology.github.io/) library instead.

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

The full changelog for the library can be found [here]({{ site.baseurl }}/changelog).

## About

This documentation has been built using [Jekyll](https://jekyllrb.com/), using the [Papyrus](https://github.com/hugoferreira/papyrus-theme) theme by [@hugoferreira](https://github.com/hugoferreira).

## License

MIT
