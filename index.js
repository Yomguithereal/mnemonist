/**
 * Mnemonist Library Endpoint
 * ===========================
 *
 * Exporting every data structure through a unified endpoint. Consumers
 * of this library should prefer the modular access though.
 */
module.exports = {
  Heap: require('./heap.js'),
  LinkedList: require('./linked-list.js'),
  Stack: require('./stack.js'),
  Trie: require('./trie.js')
};
