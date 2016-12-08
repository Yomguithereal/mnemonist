/**
 * Mnemonist Trie
 * ===============
 *
 * Very simple Trie implementation.
 */

/**
 * Constants.
 */
var SENTINEL = '\uE000';

/**
 * Trie.
 *
 * @constructor
 */
function Trie() {
  this.clear();
  this.end = SENTINEL;
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

/**
 * Method used to add an item to the trie.
 *
 * @param  {string|array} item - Item to add.
 * @return {Trie}
 */
Trie.prototype.add = function(item) {
  if (typeof item === 'string')
    item = item.split('');

  if (!item || !item.length)
    return this;

  var node = this.root,
      token;

  for (var i = 0, l = item.length; i < l; i++) {
    token = item[i];

    if (!node.hasOwnProperty(token))
      node[token] = {};

    node = node[token];
  }

  node[this.end] = true;

  this.size++;
  return this;
};

/**
 * Method used to delete an item from the trie.
 *
 * @param  {string|array} item - Item to delete.
 * @return {boolean}
 */
Trie.prototype.delete = function(item) {
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

  if (!node[this.end])
    return false;

  this.size--;

  delete node[this.end];

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
 * Method used to assert whether the given item is in the Trie.
 *
 * @param  {string|array} item - Item to check.
 * @return {boolean}
 */
Trie.prototype.has = function(item) {
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

  return this.end in node;
};

/**
 * Method used to retrieve every item in the trie with the given prefix.
 *
 * @param  {string|array} prefix - Prefix to query.
 * @return {array<string|array>}
 */
Trie.prototype.get = function(prefix) {
  var string = typeof prefix === 'string',
      item = prefix;

  if (string)
    item = prefix.split('');

  var matches = [];

  if (!item || !item.length)
    return matches;

  var node = this.root,
      token;

  for (var i = 0, l = item.length; i < l; i++) {
    token = item[i];
    node = node[token];

    if (!node)
      return [];
  }

  var queue = [[node, string ? '' : []]],
      tokens,
      step,
      k;

  while (queue.length) {
    step = queue.pop();
    node = step[0];
    tokens = step[1];

    if (node[this.end])
      matches.push(string ? prefix + tokens : prefix.concat(tokens));

    for (k in node)
      queue.push([node[k], string ? tokens + k : tokens.concat(k)]);
  }

  return matches;
};

/**
 * Method used to get the longest matching prefix for the given item.
 *
 * @param  {string|array} item - Item to query.
 * @return {string|array}
 */
Trie.prototype.longestPrefix = function(item) {
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
Trie.prototype.toJSON = function() {
  return this.root;
};

module.exports = Trie;
