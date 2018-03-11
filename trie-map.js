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
var iterate = require('./utils/iterate.js'),
    Iterator = require('obliterator/iterator');

/**
 * Constants.
 */
var SENTINEL = String.fromCharCode(0);

/**
 * TrieMap.
 *
 * @constructor
 */
function TrieMap(Token) {
  this.mode = Token === Array ? 'array' : 'string';
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
  var nodeStack = [node],
      prefixStack = [prefix],
      k;

  while (nodeStack.length) {
    prefix = prefixStack.pop();
    node = nodeStack.pop();

    if (SENTINEL in node)
      matches.push([prefix, node[SENTINEL]]);

    for (k in node) {
      if (k === SENTINEL)
        continue;

      nodeStack.push(node[k]);
      prefixStack.push(isString ? prefix + k : prefix.concat(k));
    }
  }

  return matches;
};

// TODO: used for clustering -> should rather give an iterator with a min prefix length
// TODO: DFS iterator

/**
 * Method returning an iterator over the trie's values.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
TrieMap.prototype.values = function(prefix) {
  var node = this.root,
      nodeStack = [],
      token,
      i,
      l;

  // Resolving initial prefix
  if (prefix) {
    for (i = 0, l = prefix.length; i < l; i++) {
      token = prefix[i];
      node = node[token];

      // If the prefix does not exist, we return an empty iterator
      if (typeof node === 'undefined')
        return Iterator.empty();
    }
  }

  nodeStack.push(node);

  return new Iterator(function() {
    var currentNode,
        hasValue = false,
        k;

    while (nodeStack.length) {
      currentNode = nodeStack.pop();

      hasValue = SENTINEL in currentNode;

      for (k in currentNode) {
        if (k === SENTINEL)
          continue;

        nodeStack.push(currentNode[k]);
      }

      if (hasValue)
        return {done: false, value: currentNode[SENTINEL]};
    }

    return {done: true};
  });
};

/**
 * Method returning an iterator over the trie's prefixes.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
TrieMap.prototype.prefixes = function(prefix) {
  var node = this.root,
      nodeStack = [],
      prefixStack = [],
      token,
      i,
      l;

  var isString = this.mode === 'string';

  // Resolving initial prefix
  if (prefix) {
    for (i = 0, l = prefix.length; i < l; i++) {
      token = prefix[i];
      node = node[token];

      // If the prefix does not exist, we return an empty iterator
      if (typeof node === 'undefined')
        return Iterator.empty();
    }
  }
  else {
    prefix = isString ? '' : [];
  }

  nodeStack.push(node);
  prefixStack.push(prefix);

  return new Iterator(function() {
    var currentNode,
        currentPrefix,
        hasValue = false,
        k;

    while (nodeStack.length) {
      currentNode = nodeStack.pop();
      currentPrefix = prefixStack.pop();

      hasValue = SENTINEL in currentNode;

      for (k in currentNode) {
        if (k === SENTINEL)
          continue;

        nodeStack.push(currentNode[k]);
        prefixStack.push(isString ? currentPrefix + k : currentPrefix.concat(k));
      }

      if (hasValue)
        return {done: false, value: currentPrefix};
    }

    return {done: true};
  });
};
TrieMap.prototype.keys = TrieMap.prototype.prefixes;

/**
 * Method returning an iterator over the trie's entries.
 *
 * @param  {string|array} [prefix] - Optional starting prefix.
 * @return {Iterator}
 */
TrieMap.prototype.entries = function(prefix) {
  var node = this.root,
      nodeStack = [],
      prefixStack = [],
      token,
      i,
      l;

  var isString = this.mode === 'string';

  // Resolving initial prefix
  if (prefix) {
    for (i = 0, l = prefix.length; i < l; i++) {
      token = prefix[i];
      node = node[token];

      // If the prefix does not exist, we return an empty iterator
      if (typeof node === 'undefined')
        return Iterator.empty();
    }
  }
  else {
    prefix = isString ? '' : [];
  }

  nodeStack.push(node);
  prefixStack.push(prefix);

  return new Iterator(function() {
    var currentNode,
        currentPrefix,
        hasValue = false,
        k;

    while (nodeStack.length) {
      currentNode = nodeStack.pop();
      currentPrefix = prefixStack.pop();

      hasValue = SENTINEL in currentNode;

      for (k in currentNode) {
        if (k === SENTINEL)
          continue;

        nodeStack.push(currentNode[k]);
        prefixStack.push(isString ? currentPrefix + k : currentPrefix.concat(k));
      }

      if (hasValue)
        return {done: false, value: [currentPrefix, currentNode[SENTINEL]]};
    }

    return {done: true};
  });
};

/**
 * Convenience known methods.
 */
TrieMap.prototype.inspect = function() {
  var proxy = new Array(this.size);

  var iterator = this.entries(),
      step,
      i = 0;

  while ((step = iterator.next(), !step.done))
    proxy[i++] = step.value;

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

  iterate(iterable, function(value, key) {
    trie.set(key, value);
  });

  return trie;
};

/**
 * Exporting.
 */
TrieMap.SENTINEL = SENTINEL;
module.exports = TrieMap;
