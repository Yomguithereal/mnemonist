/**
 * Mnemonist TrieMap
 * ==================
 *
 * JavaScript TrieMap implementation based upon plain objects. As such this
 * structure is more a convenience building upon the trie's advantages than
 * a real performant alternative to already existing structures.
 *
 * Note that the Trie is based upon the TrieMap since the underlying machine
 * is the very same. The Trie just does not let you set values and only
 * considers the existence of the given prefixes.
 */
var iterate = require('./utils/iterate.js');

/**
 * Constants.
 */
var SENTINEL = String.fromCharCode(0);

/**
 * TrieMap.
 *
 * @constructor
 */
function TrieMap() {
  this.clear();
}

/**
 * Method used to clear the trie.
 *
 * @return {undefined}
 */
TrieMap.prototype.clear = function() {

  // Properties
  this.root = {};
  this.size = 0;
};

/**
 * Method used to set the value of the given prefix in the trie.
 *
 * @param  {string|array} prefix - Sequence to follow.
 * @param  {any}          value  - Value for the prefix.
 * @return {TrieMap}
 */
TrieMap.prototype.set = function(prefix, value) {
  var node = this.root,
      token;

  for (var i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];

    node = node[token] || (node[token] = {});
  }

  // Do we need to increase size?
  if (!(SENTINEL in node))
    this.size++;

  node[SENTINEL] = value;

  return this;
};

/**
 * Method used to return the value sitting at the end of the given prefix or
 * undefined if none exist.
 *
 * @param  {string|array} prefix - Sequence to follow.
 * @return {any|undefined}
 */
TrieMap.prototype.get = function(prefix) {
  var node = this.root,
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    // Prefix does not exist
    if (typeof node === 'undefined')
      return;
  }

  if (!(SENTINEL in node))
    return;

  return node[SENTINEL];
};

/**
 * Method used to delete a prefix from the trie.
 *
 * @param  {string|array} prefix - Sequence to delete.
 * @return {boolean}
 */
TrieMap.prototype.delete = function(prefix) {
  var node = this.root,
      toPrune = null,
      tokenToPrune = null,
      parent,
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    parent = node;
    node = node[token];

    // Prefix does not exist
    if (typeof node === 'undefined')
      return false;

    // Keeping track of a potential branch to prune
    if (toPrune !== null) {
      if (Object.keys(node).length > 1) {
        toPrune = null;
        tokenToPrune = null;
      }
    }
    else {
      if (Object.keys(node).length < 2) {
        toPrune = parent;
        tokenToPrune = token;
      }
    }
  }

  if (!(SENTINEL in node))
    return false;

  this.size--;

  if (toPrune)
    delete toPrune[tokenToPrune];
  else
    delete node[SENTINEL];

  return true;
};

// TODO: add #.prune?

/**
 * Method used to assert whether the given prefix exists in the TrieMap.
 *
 * @param  {string|array} prefix - Prefix to check.
 * @return {boolean}
 */
TrieMap.prototype.has = function(prefix) {
  var node = this.root,
      token;

  for (var i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    if (typeof node === 'undefined')
      return false;
  }

  return SENTINEL in node;
};

/**
 * Method used to retrieve every item in the trie with the given prefix.
 *
 * @param  {string|array} prefix - Prefix to query.
 * @return {array}
 */
TrieMap.prototype.find = function(prefix) {
  var isString = typeof prefix === 'string';

  var node = this.root,
      matches = [],
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    if (typeof node === 'undefined')
      return matches;
  }

  // Performing DFS from prefix
  var stack = [node, prefix],
      k;

  while (stack.length) {
    prefix = stack.pop();
    node = stack.pop();

    if (SENTINEL in node)
      matches.push([prefix, node[SENTINEL]]);

    for (k in node) {
      if (k === SENTINEL)
        continue;

      stack.push(node[k]);
      stack.push(isString ? prefix + k : prefix.concat(k));
    }
  }

  return matches;
};

/**
 * Method used to get the longest matching prefix for the given prefix.
 *
 * @param  {string|array} prefix - Prefix to query.
 * @return {array}
 */
TrieMap.prototype.longestPrefix = function(prefix) {
  var node = this.root,
      longest = 0,
      hasValue = SENTINEL in node,
      value = node[SENTINEL],
      token,
      i,
      l;

  for (i = 0, l = prefix.length; i < l; i++) {
    token = prefix[i];
    node = node[token];

    if (typeof node === 'undefined')
      break;

    if (SENTINEL in node) {
      hasValue = true;
      longest = i + 1;
      value = node[SENTINEL];
    }
  }

  if (!hasValue)
    return null;

  return [prefix.slice(0, longest), value];
};

/**
 * Method used to get the shortest matching prefix for the given prefix.
 *
 * @param  {string|array} prefix - Sequence to query.
 * @param  {number}       [min=0]  - Minimum length for the retrieved prefix.
 * @return {array}
 */
// TrieMap.prototype.shortestPrefix = function(prefix, min) {
//   min = min || 0;
// };

// TODO: used for clustering -> should rather give an iterator with a min prefix length

/**
 * Method returning an iterator over the trie's values.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
// TrieMap.prototype.values = function(prefix) {

// };

/**
 * Method returning an iterator over the trie's prefixes.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
// TrieMap.prototype.prefixes = function(prefix) {

// };
// TrieMap.prototype.keys = TrieMap.prototype.prefixes;

/**
 * Method returning an iterator over the trie's entries.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
// TrieMap.prototype.entries = function(prefix) {

// };

/**
 * Convenience known methods.
 */
TrieMap.prototype.inspect = function() {
  var proxy = {
    size: this.size
  };

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: TrieMap,
    enumerable: false
  });

  return proxy;
};

TrieMap.prototype.toJSON = function() {
  return this.root;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a trie.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {Heap}
 */
TrieMap.from = function(iterable) {
  var trie = new TrieMap();

  iterate(iterable, function(value) {
    trie.add(value);
  });

  return trie;
};

/**
 * Exporting.
 */
TrieMap.SENTINEL = SENTINEL;
module.exports = TrieMap;
