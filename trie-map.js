/**
 * Mnemonist TrieMap
 * ==================
 *
 * Very simple TrieMap implementation.
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
 * Method used to set the value of the given sequence in the trie.
 *
 * @param  {string|array} sequence - Sequence to follow.
 * @param  {any}          value    - Value for the sequence.
 * @return {TrieMap}
 */
TrieMap.prototype.set = function(sequence, value) {
  var node = this.root,
      token;

  for (var i = 0, l = sequence.length; i < l; i++) {
    token = sequence[i];

    node = node[token] || (node[token] = {});
  }

  // Do we need to increase size?
  if (!(SENTINEL in node))
    this.size++;

  node[SENTINEL] = value;

  return this;
};

/**
 * Method used to return the value sitting at the end of the given sequence or
 * undefined if none exist.
 *
 * @param  {string|array} sequence - Sequence to follow.
 * @return {any|undefined}
 */
TrieMap.prototype.get = function(sequence) {
  var node = this.root,
      token,
      i,
      l;

  for (i = 0, l = sequence.length; i < l; i++) {
    token = sequence[i];
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
 * Method used to delete a sequence from the trie.
 *
 * @param  {string|array} sequence - Sequence to delete.
 * @return {boolean}
 */
TrieMap.prototype.delete = function(sequence) {
  var node = this.root,
      toPrune = null,
      tokenToPrune = null,
      parent,
      token,
      i,
      l;

  for (i = 0, l = sequence.length; i < l; i++) {
    token = sequence[i];
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
 * Method used to assert whether the given sequence exists in the TrieMap.
 *
 * @param  {string|array} sequence - Sequence to check.
 * @return {boolean}
 */
TrieMap.prototype.has = function(sequence) {
  var node = this.root,
      token;

  for (var i = 0, l = sequence.length; i < l; i++) {
    token = sequence[i];
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
 * Method used to get the longest matching prefix for the given sequence.
 *
 * @param  {string|array} sequence - Sequence to query.
 * @return {array}
 */
TrieMap.prototype.longestPrefix = function(item) {
  var string = typeof item === 'string';

  if (string)
    item = item.split('');

  if (!item || !item.length)
    return string ? '' : [];

  var prefix = [],
      node = this.root,
      token;

  for (var i = 0, l = item.length; i < l; i++) {
    token = item[i];

    if (!node.hasOwnProperty(token))
      break;

    prefix.push(token);
    node = node[token];
  }

  return string ? prefix.join('') : prefix;
};

/**
 * Method used to get the shortest matching prefix for the given sequence.
 *
 * @param  {string|array} sequence - Sequence to query.
 * @param  {number}       [min=0]  - Minimum length for the retrieved prefix.
 * @return {array}
 */
TrieMap.prototype.shortestPrefix = function(sequence, min) {
  min = min || 0;
};

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
