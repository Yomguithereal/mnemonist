/* eslint no-new: 0 */
/**
 * Mnemonist Inverted Index Unit Tests
 * ====================================
 */
var assert = require('assert'),
    InvertedIndex = require('../inverted-index.js'),
    words = require('lodash/words');

var STOPWORDS = new Set(['a', 'the', 'i', 'is', 'to']);

var stemmer = function(word) {
  return word.replace(/s$/, '');
};

var tokenizer = function(text) {
  return words(text.toLowerCase())
    .filter(function(word) {
      return !STOPWORDS.has(word);
    })
    .map(stemmer);
};

var documentTokenizer = function(doc) {
  return tokenizer(doc.text);
};

var DOCS = [
  'The cat eats the mouse.',
  'The mouse likes cheese.',
  'Cheese is something mouses really like to eat.'
];

var OBJECT_DOCS = DOCS.map(function(text) {
  return {text: text};
});

describe('InvertedIndex', function() {

  it('should throw if given invalid tokenizer function.', function() {

    assert.throws(function() {
      new InvertedIndex({hello: 'world'});
    }, /tokenizer/);
  });

  it('should throw if the tokenizer does not return an array.', function() {
    assert.throws(function() {
      var index = new InvertedIndex();

      index.add(OBJECT_DOCS[0]);
    }, /array/);
  });

  it('should be possible to add items to the index.', function() {
    var index = new InvertedIndex(documentTokenizer);

    OBJECT_DOCS.forEach(function(doc) {
      index.add(doc);
    });

    assert.strictEqual(index.size, 3);
    assert.strictEqual(index.dimension, 7);
  });

  it('should be possible to create an index from an arbitrary iterable.', function() {
    var index = InvertedIndex.from(OBJECT_DOCS, documentTokenizer);

    assert.strictEqual(index.size, 3);
    assert.strictEqual(index.dimension, 7);
  });

  it('should be possible to query the index.', function() {
    var index = InvertedIndex.from(DOCS, tokenizer);

    var results = index.get('A mouse.');
    assert.deepEqual(results, DOCS);

    results = index.get('cheese');
    assert.deepEqual(results, DOCS.slice(1));

    results = index.get('The cat');
    assert.deepEqual(results, [DOCS[0]]);

    results = index.get('The cat likes');
    assert.deepEqual(results, []);

    results = index.get('really something');
    assert.deepEqual(results, DOCS.slice(-1));
  });

  it('should be possible to iterate using #.forEach', function() {
    var index = InvertedIndex.from(DOCS, tokenizer);

    index.forEach(function(doc, i, instance) {
      assert.strictEqual(instance, index);
      assert.strictEqual(doc, DOCS[i]);
    });
  });

  it('should be possible to create an iterator over documents.', function() {
    var index = InvertedIndex.from(OBJECT_DOCS, documentTokenizer);

    var iterator = index.documents();

    assert.deepEqual(iterator.next().value, OBJECT_DOCS[0]);
    assert.deepEqual(iterator.next().value, OBJECT_DOCS[1]);
    assert.deepEqual(iterator.next().value, OBJECT_DOCS[2]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an iterator over tokens.', function() {
    var index = InvertedIndex.from(OBJECT_DOCS, documentTokenizer);

    var iterator = index.tokens();

    assert.deepEqual(iterator.next().value, 'cat');
    assert.deepEqual(iterator.next().value, 'eat');
    assert.deepEqual(iterator.next().value, 'mouse');
    assert.deepEqual(iterator.next().value, 'like');
    assert.deepEqual(iterator.next().value, 'cheese');
    assert.deepEqual(iterator.next().value, 'something');
    assert.deepEqual(iterator.next().value, 'really');
    assert.strictEqual(iterator.next().done, true);
  });
});
