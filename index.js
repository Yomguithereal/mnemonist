/**
 * Mnemonist Library Endpoint
 * ===========================
 *
 * Exporting every data structure through a unified endpoint. Consumers
 * of this library should prefer the modular access though.
 */
var Heap = require('./heap.js'),
    FibonacciHeap = require('./fibonacci-heap.js'),
    SuffixArray = require('./suffix-array.js');

module.exports = {
  BiMap: require('./bi-map.js'),
  BitSet: require('./bit-set.js'),
  BloomFilter: require('./bloom-filter.js'),
  BKTree: require('./bk-tree.js'),
  StaticDisjointSet: require('./static-disjoint-set.js'),
  DynamicArray: require('./dynamic-array.js'),
  FibonacciHeap: FibonacciHeap,
  MinFibonacciHeap: FibonacciHeap.MinFibonacciHeap,
  MaxFibonacciHeap: FibonacciHeap.MaxFibonacciHeap,
  FuzzyMap: require('./fuzzy-map.js'),
  FuzzyMultiMap: require('./fuzzy-multi-map.js'),
  Heap: Heap,
  MinHeap: Heap.MinHeap,
  MaxHeap: Heap.MaxHeap,
  IncrementalMap: require('./incremental-map.js'),
  InvertedIndex: require('./inverted-index.js'),
  LinkedList: require('./linked-list.js'),
  MultiMap: require('./multi-map.js'),
  MultiSet: require('./multi-set.js'),
  Queue: require('./queue.js'),
  Stack: require('./stack.js'),
  SuffixArray: SuffixArray,
  GeneralizedSuffixArray: SuffixArray.GeneralizedSuffixArray,
  Set: require('./set.js'),
  SparseSet: require('./sparse-set.js'),
  SymSpell: require('./symspell.js'),
  Trie: require('./trie.js'),
  VPTree: require('./vp-tree.js')
};
