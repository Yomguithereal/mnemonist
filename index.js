/**
 * Mnemonist Library Endpoint
 * ===========================
 *
 * Exporting every data structure through a unified endpoint. Consumers
 * of this library should prefer the modular access though.
 */
module.exports = {
  FibonacciHeap: require('./fibonacci-heap.js'),
  Heap: require('./heap.js'),
  LinkedList: require('./linked-list.js'),
  Queue: require('./queue.js'),
  Stack: require('./stack.js'),
  Trie: require('./trie.js')
};
