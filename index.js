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
  FibonacciHeap: FibonacciHeap,
  MinFibonacciHeap: FibonacciHeap.MinFibonacciHeap,
  MaxFibonacciHeap: FibonacciHeap.MaxFibonacciHeap,
  Heap: Heap,
  MinHeap: Heap.MinHeap,
  MaxHeap: Heap.MaxHeap,
  MultiSet: require('./multiset.js'),
  LinkedList: require('./linked-list.js'),
  Queue: require('./queue.js'),
  Stack: require('./stack.js'),
  SuffixArray: SuffixArray,
  GeneralizedSuffixArray: SuffixArray.GeneralizedSuffixArray,
  Trie: require('./trie.js')
};
