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

Full documentation for the library can be found [here](https://yomguithereal.github.io/mnemonist/fibonacci-heap).

* [Fibonacci Heap](https://yomguithereal.github.io/mnemonist/fibonacci-heap)
* [Heap](https://yomguithereal.github.io/mnemonist/heap)
* [Linked List](https://yomguithereal.github.io/mnemonist/linked-list)
* [MultiSet](https://yomguithereal.github.io/mnemonist/multiset)
* [Queue](https://yomguithereal.github.io/mnemonist/queue)
* [Stack](https://yomguithereal.github.io/mnemonist/stack)
* [Suffix Arrays](https://yomguithereal.github.io/mnemonist/suffix-array)
* [Generalized Suffix Arrays](https://yomguithereal.github.io/mnemonist/generalized-suffix-array)
* [Trie](https://yomguithereal.github.io/mnemonist/trie)

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
