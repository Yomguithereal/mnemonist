/**
 * Mnemonist Inverted Index
 * =========================
 *
 * JavaScript implementation of an inverted index.
 */
var Iterator = require('obliterator/iterator'),
    iterate = require('./utils/iterate.js'),
    helpers = require('./set.js');

function identity(x) {
  return x;
}

/**
 * InvertedIndex.
 *
 * @constructor
 * @param {function} tokenizer - Tokenizer function.
 */
function InvertedIndex(descriptor) {
  this.clear();

  if (Array.isArray(descriptor)) {
    this.documentTokenizer = descriptor[0];
    this.queryTokenizer = descriptor[1];
  }
  else {
    this.documentTokenizer = descriptor;
    this.queryTokenizer = descriptor;
  }

  if (!this.documentTokenizer)
    this.documentTokenizer = identity;
  if (!this.queryTokenizer)
    this.queryTokenizer = identity;

  if (typeof this.documentTokenizer !== 'function')
    throw new Error('mnemonist/InvertedIndex.constructor: document tokenizer is not a function.');

  if (typeof this.queryTokenizer !== 'function')
    throw new Error('mnemonist/InvertedIndex.constructor: query tokenizer is not a function.');
}

/**
 * Method used to clear the InvertedIndex.
 *
 * @return {undefined}
 */
InvertedIndex.prototype.clear = function() {

  // Properties
  this.items = [];
  this.mapping = new Map();
  this.size = 0;
  this.dimension = 0;
};

/**
 * Method used to add a document to the index.
 *
 * @param  {any} doc - Item to add.
 * @return {InvertedIndex}
 */
InvertedIndex.prototype.add = function(doc) {

  // Increasing size
  this.size++;

  // Storing document
  var key = this.items.length;
  this.items.push(doc);

  // Tokenizing the document
  var tokens = this.documentTokenizer(doc);

  if (!Array.isArray(tokens))
    throw new Error('mnemonist/InvertedIndex.add: tokenizer function should return an array of tokens.');

  // Indexing
  var token,
      container;

  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i];
    container = this.mapping.get(token);

    if (!container) {
      container = new Set();
      this.mapping.set(token, container);
    }

    container.add(key);
  }

  this.dimension = this.mapping.size;

  return this;
};

/**
 * Method used to query the index in a AND fashion.
 *
 * @param  {any} query - Query
 * @return {Set}       - Intersection of documents matching the query.
 */
InvertedIndex.prototype.query = function(query) {

  // Early termination
  if (!this.size)
    return [];

  // First we need to tokenize the query
  var tokens = this.queryTokenizer(query);

  if (!Array.isArray(tokens))
    throw new Error('mnemonist/InvertedIndex.query: tokenizer function should return an array of tokens.');

  if (!tokens.length)
    return [];

  var matchingSet = new Set(),
      token,
      set,
      i,
      l;

  for (i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i];
    set = this.mapping.get(token);

    // Empty intersection
    if (!set || !set.size)
      return new Set();

    if (!matchingSet.size)
      helpers.add(matchingSet, set);
    else
      helpers.intersect(matchingSet, set);
  }

  var results = new Array(matchingSet.size),
      iterator = matchingSet.values(),
      step;

  i = 0;

  while ((step = iterator.next(), !step.done))
    results[i++] = this.items[step.value];

  return results;
};
InvertedIndex.prototype.andQuery = InvertedIndex.prototype.query;

/**
 * Method used to query the index in an OR fashion.
 *
 * @param  {any} query - Query
 * @return {Set}       - Union of documents matching the query.
 */
InvertedIndex.prototype.orQuery = function(query) {

  // Early termination
  if (!this.size)
    return [];

  // First we need to tokenize the query
  var tokens = this.queryTokenizer(query);

  if (!Array.isArray(tokens))
    throw new Error('mnemonist/InvertedIndex.orQuery: tokenizer function should return an array of tokens.');

  if (!tokens.length)
    return [];

  var matchingSet = new Set(),
      token,
      set,
      i,
      l;

  for (i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i];
    set = this.mapping.get(token);

    // Empty set
    if (!set || !set.size)
      continue;

    helpers.add(matchingSet, set);
  }

  var results = new Array(matchingSet.size),
      iterator = matchingSet.values(),
      step;

  i = 0;

  while ((step = iterator.next(), !step.done))
    results[i++] = this.items[step.value];

  return results;
};

/**
 * Method used to iterate over each of the documents.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
InvertedIndex.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.documents.length; i < l; i++)
    callback.call(scope, this.documents[i], i, this);
};

/**
 * Method returning an iterator over the index's documents.
 *
 * @return {Iterator}
 */
InvertedIndex.prototype.documents = function() {
  var documents = this.items,
      l = documents.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

      var value = documents[i++];

      return {
        value: value,
        done: false
      };
  });
};

/**
 * Method returning an iterator over the index's tokens.
 *
 * @return {Iterator}
 */
InvertedIndex.prototype.tokens = function() {
  return this.mapping.keys();
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  InvertedIndex.prototype[Symbol.iterator] = InvertedIndex.prototype.documents;

// TODO: fuzzy inverted index

/**
 * Convenience known methods.
 */
InvertedIndex.prototype.inspect = function() {
  var array = this.documents.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: InvertedIndex,
    enumerable: false
  });

  return array;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a InvertedIndex.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} tokenizer - Tokenizer function.
 * @return {InvertedIndex}
 */
InvertedIndex.from = function(iterable, descriptor) {
  var index = new InvertedIndex(descriptor);

  iterate(iterable, function(doc) {
    index.add(doc);
  });

  return index;
};

/**
 * Exporting.
 */
module.exports = InvertedIndex;
