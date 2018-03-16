# Changelog

## 0.21.0 (provisional)

* Adding `CircularBuffer`.
* Adding `#.toArray` to `Heap`.

## 0.20.0

* Adding `TrieMap`.
* Reworking the `Trie` considerably.

## 0.19.0

* Adding `StaticIntervalTree`.
* Adding `PointerVector`.
* Adding `Queue.of`.
* Adding `Stack.of`.
* Improving `Vector` & `BitVector` reallocation performance.
* Improving `InvertedIndex` performance.

## 0.18.O

* Adding `FiniteStack`.
* Adding `#.keys` to `MultiSet`.
* Adding `#.count` alias to `MultiSet`.
* Adding `#.count` alias to `MultiMap`.
* Adding `#.remove` to `MultiMap`.
* Adding `Vector.from`.
* Adding `#.values` to `Vector`.
* Adding `#.entries` to `Vector`.
* Fixing bug when feeding invalid values to a `MultiSet`.
* Fixing `.from` static methods not taking byte arrays into account.
* Fixing bugs related to `Stack.pop` edge cases. 
* Optimizing `Stack` performance.

## 0.17.0

* Adding `HashedArrayTree`.
* Adding `BitVector`.
* Adding `#.frequency` to `MultiSet`.
* Adding `#.grow` to `DynamicArray`.
* Adding `#.reallocate` to `DynamicArray`.
* Adding `#.resize` to `DynamicArray`.
* Fixing several `MultiSet` issues.
* Renaming `DynamicArray` to `Vector`.
* Renaming the `DynamicArray.initialLength` option to `initialCapacity`.
* Renaming `DynamicArray.allocated` to `capacity`.
* Optimizing `MultiSet` performance.
* Optimizing `SparseSet` memory consumption.

## 0.16.0

* Adding `#.has` to `FuzzyMap`.
* Adding `#.has` to `FuzzyMultiMap`.
* Adding `#.multiplicity` to `MultiMap`.
* Renaming `RangeMap` to `IncrementalMap`.
* Renaming `Index` to `FuzzyMap`.
* Renaming `MultiIndex` to `FuzzyMultiMap`.
* Renaming `DynamicArray` `initialSize` option to `initialLength`.
* Improving `MultiMap.set` performance.
* Improving `BitSet.reset` performance.
* Improving `Set.isSubset` & `Set.isSuperset` performance.

## 0.15.0

* Adding `RangeMap`.
* Improving `MultiSet`.
* Out-of-bound `DynamicArray.set` will now correctly grow the array.
* Fixing `StaticDisjointSet.find` complexity.

## O.14.0

* Adding `DynamicArray`.
* Adding `SparseSet`.
* Adding `StaticDisjointSet`.
* Adding iterator methods to `BitSet`.
* Adding `#.rank` & `#.select` to `BitSet`.
* `BitSet` now relies on `Uint32Array` rather than `Uint8Array`.
* Improving `BitSet` performances.
* Using `obliterator` to handle iterators.

## 0.13.0

* Adding `BiMap`.
* Adding `BitSet`.
* Fixing universal iterator.

## 0.12.0

* Adding `InvertedIndex`.

## 0.11.0

* Adding bunch of set functions.

## 0.10.2

* Fixing error in `Trie.get`.
* Fixing error related to `Trie.size`.

## 0.10.1

* Fixing an error in `VPTree.neighbors`.

## 0.10.0

* Adding `Index`.
* Adding `MultiIndex`.
* Adding `MultiMap`.
* Adding `MultiSet`.
* Adding `SymSpell`.

## 0.9.0

* Adding `VPTree`.

## 0.8.0

* Adding `BKTree`.

## 0.7.0

* Adding `BloomFilter`.
* Adding static `#.from` method to all relevant structures.
* Adding iterators to all relevant structures.
* Removing the `MultiSet` until proper API is found.

## 0.6.0

* Adding `MultiSet`.

## 0.5.0

* Adding `SuffixArray` & `GeneralizedSuffixArray`.
* Better `Trie` sentinel.

## 0.4.0

* Adding `Queue`.
* Adding possibility to pass custom comparator to `Heap` & `FibonacciHeap`.

## 0.3.0

* Adding `FibonacciHeap`.
* Fixing bug related to `Heap`.

## 0.2.0

* Adding `Trie`.

## 0.1.0

* Adding `Heap`.

## 0.0.1

* Adding `LinkedList`.
* Adding `Stack`.
