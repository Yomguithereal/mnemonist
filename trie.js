/**
 * Mnemonist Trie
 * ===============
 *
 * Very simple Trie implementation.
 */

/**
 * Trie.
 *
 * @constructor
 */
function Trie() {
  this.clear();
}

/**
 * Method used to clear the trie.
 *
 * @return {undefined}
 */
Trie.prototype.clear = function() {

  // Properties
  this.root = {};
  this.size = 0;
};

// inspect, toJSON, toString

module.exports = Trie;
