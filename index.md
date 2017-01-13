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

It gathers classic data structures (think [heap]({{ site.baseurl }}/heap), [trie]({{ site.baseurl }}/trie) etc.) as well as more exotic ones such as [Buckhard-Keller trees]({{ site.baseurl }}/bk-tree) etc.

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

* [Fibonacci Heap]({{ site.baseurl }}/fibonacci-heap)
* [Heap]({{ site.baseurl }}/heap)
* [Linked List]({{ site.baseurl }}/linked-list)
* [MultiSet]({{ site.baseurl }}/multiset)
* [Queue]({{ site.baseurl }}/queue)
* [Stack]({{ site.baseurl }}/stack)
* [Suffix Arrays]({{ site.baseurl }}/suffix-array)
* [Generalized Suffix Arrays]({{ site.baseurl }}/generalized-suffix-array)
* [Trie]({{ site.baseurl }}/trie)

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

## License

MIT
