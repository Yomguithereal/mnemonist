[![Build Status](https://travis-ci.org/Yomguithereal/mnemonist.svg)](https://travis-ci.org/Yomguithereal/mnemonist)

# Mnemonist

Mnemonist is a curated collection of data structures for the JavaScript language.

It gathers classic data structures (think heap, trie etc.) as well as more exotic ones such as Buckhard-Keller trees etc.

It strives at being:

* As performant as possible for a high-level language.
* Completely modular (don't need to import the whole library just to use a simple heap).
* Simple & straightforward to use and consistent with JavaScript standard objects' API.

## Installation

```
npm install --save mnemonist
```

## Documentation

Full documentation for the library can be found [here](https://yomguithereal.github.io/mnemonist).

* [Burkhard-Keller Tree](https://yomguithereal.github.io/mnemonist/bk-tree)
* [Bloom Filter](https://yomguithereal.github.io/mnemonist/bloom-filter)
* [Fibonacci Heap](https://yomguithereal.github.io/mnemonist/fibonacci-heap)
* [Heap](https://yomguithereal.github.io/mnemonist/heap)
* [Linked List](https://yomguithereal.github.io/mnemonist/linked-list)
* [Queue](https://yomguithereal.github.io/mnemonist/queue)
* [Stack](https://yomguithereal.github.io/mnemonist/stack)
* [Suffix Array](https://yomguithereal.github.io/mnemonist/suffix-array)
* [Generalized Suffix Array](https://yomguithereal.github.io/mnemonist/generalized-suffix-array)
* [Trie](https://yomguithereal.github.io/mnemonist/trie)
* [Vantage Point Tree](https://yomguithereal.github.io/mnemonist/vp-tree)

Note that this list does not include a `Graph` data structure, whose implementation is usually far too complex for the scope of this library.

However, we advise the reader to take a look at the [`graphology`](https://graphology.github.io/) library instead.

## Contribution

Contributions are obviously welcome. Be sure to lint the code & add relevant unit tests.

```
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

[MIT](LICENSE.txt)
