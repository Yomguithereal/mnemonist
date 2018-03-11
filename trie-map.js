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

// The sentinel is a symbol or fallbacks to char(0).
var SENTINEL = typeof Symbol !== 'undefined' ?
  Symbol('sentinel') :
  String.fromCharCode(0);

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
  this.depth = 0;
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

  if (sequence.length > this.depth)
    this.depth = sequence.length;

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
 * Method used to delete an item from the trie.
 *
 * @param  {string|array} item - Item to delete.
 * @return {boolean}
 */
TrieMap.prototype.delete = function(item) {
  if (typeof item === 'string')
    item = item.split('');

  if (!item || !item.length)
    return false;

  var node = this.root,
      prefix = [],
      token,
      i,
      l;

  for (i = 0, l = item.length; i < l; i++) {
    token = item[i];

    if (!node.hasOwnProperty(token))
      return false;

    node = node[token];
    prefix.push([token, node]);
  }

  if (!node[SENTINEL])
    return false;

  this.size--;

  delete node[SENTINEL];

  if (Object.keys(node).length >= 1)
    return true;

  for (i = prefix.length - 1; i >= 1; i--) {
    if (Object.keys(prefix[i][1]).length < 2)
      delete prefix[i - 1][1][prefix[i][0]];
    else
      break;
  }

  if (Object.keys(this.root[prefix[0][0]]).length < 2)
    delete this.root[prefix[0][0]];

  return true;
};

/**
 * Method used to assert whether the given item is in the TrieMap.
 *
 * @param  {string|array} item - Item to check.
 * @return {boolean}
 */
TrieMap.prototype.has = function(item) {
  if (typeof item === 'string')
    item = item.split('');

  if (!item || !item.length)
    return false;

  var node = this.root,
      token;

  for (var i = 0, l = item.length; i < l; i++) {
    token = item[i];

    if (!node.hasOwnProperty(token))
      return false;

    node = node[token];
  }

  return SENTINEL in node;
};

/**
 * Method used to retrieve every item in the trie with the given prefix.
 *
 * @param  {string|array} prefix - Prefix to query.
 * @return {array<string|array>}
 */
// Rename
// TrieMap.prototype.get = function(prefix) {
//   var string = typeof prefix === 'string',
//       item = prefix,
//       matches = [];

//   if (!item || !item.length)
//     return matches;

//   var node = this.root,
//       token;

//   for (var i = 0, l = item.length; i < l; i++) {
//     token = item[i];
//     node = node[token];

//     if (!node)
//       return matches;
//   }

//   var stack = [node, string ? '' : []],
//       tokens,
//       k;

//   while (stack.length) {
//     tokens = stack.pop();
//     node = stack.pop();

//     if (node[SENTINEL])
//       matches.push(string ? prefix + tokens : prefix.concat(tokens));

//     for (k in node) {
//       if (k === SENTINEL)
//         continue;

//       stack.push(node[k]);
//       stack.push(string ? tokens + k : tokens.concat(k));
//     }
//   }

//   return matches;
// };

/**
 * Method used to get the longest matching prefix for the given item.
 *
 * @param  {string|array} item - Item to query.
 * @return {string|array}
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
