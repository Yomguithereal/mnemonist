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
  BloomFilter: require('./bloom-filter.js'),
  BKTree: require('./bk-tree.js'),
  FibonacciHeap: FibonacciHeap,
  MinFibonacciHeap: FibonacciHeap.MinFibonacciHeap,
  MaxFibonacciHeap: FibonacciHeap.MaxFibonacciHeap,
  Heap: Heap,
  MinHeap: Heap.MinHeap,
  MaxHeap: Heap.MaxHeap,
  Index: require('./index.js'),
  LinkedList: require('./linked-list.js'),
  MultiMap: require('./multi-map.js'),
  MultiSet: require('./multi-set.js'),
  Queue: require('./queue.js'),
  Stack: require('./stack.js'),
  SuffixArray: SuffixArray,
  GeneralizedSuffixArray: SuffixArray.GeneralizedSuffixArray,
  SymSpell: require('./symspell.js'),
  Trie: require('./trie.js'),
  VPTree: require('./vp-tree.js')
};
