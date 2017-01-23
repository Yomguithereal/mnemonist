/* eslint no-new: 0 */
/**
 * Mnemonist Index Unit Tests
 * ===========================
 */
var assert = require('assert'),
    Index = require('../index.js');

describe('Index', function() {

  it('should throw if given invalid hash functions.', function() {

    assert.throws(function() {
      new Index({hello: 'world'});
    }, /hash/);

    assert.throws(function() {
      new Index([{hello: 'world'}]);
    }, /hash/);

    assert.throws(function() {
      new Index([null, {hello: 'world'}]);
    }, /hash/);
  });

  it('should be possible to add items to the index.', function() {
    var index = new Index(function(item) {
      return item.title.toLowerCase();
    });

    index.add({title: 'Hello'});
    index.add({title: 'World'});

    assert.strictEqual(index.size, 2);
  });

  it('should be possible to set values.', function() {
    var index = new Index(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello'});
    index.set('World', {title: 'World'});

    assert.strictEqual(index.size, 2);
  });

  it('should be possible to clear the index.', function() {
    var index = new Index(function(item) {
      return item.title.toLowerCase();
    });

    index.add({title: 'Hello'});
    index.add({title: 'World'});

    index.clear();

    assert.strictEqual(index.size, 0);
  });

  it('should be possible to get items from the index.', function() {
    var index = new Index(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello'});
    index.set('World', {title: 'World'});

    assert.deepEqual(index.get('HELLO'), {title: 'Hello'});
    assert.deepEqual(index.get('shawarama'), undefined);
  });

  it('should be possible to iterate over an index\'s values.', function() {
    var index = new Index(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello'});
    index.set('World', {title: 'World'});

    var i = 0;

    index.forEach(function(value) {
      assert.deepEqual(value, !i ? {title: 'Hello'} : {title: 'World'});
      i++;
    });

    assert.strictEqual(i, 2);
  });

  it('should be possible to create an iterator over an index\'s values.', function() {
    var index = new Index(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello'});
    index.set('World', {title: 'World'});

    var iterator = index.values();

    assert.deepEqual(iterator.next().value, {title: 'Hello'});
    assert.deepEqual(iterator.next().value, {title: 'World'});
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over an index\'s values using for...of.', function() {
    var index = new Index(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello'});
    index.set('World', {title: 'World'});

    var i = 0;

    for (var value of index) {
      assert.deepEqual(value, !i ? {title: 'Hello'} : {title: 'World'});
      i++;
    }

    assert.strictEqual(i, 2);
  });

  it('should be possible to create an index from arbitrary iterables.', function() {
    function writeHash(item) {
      return item.title.toLowerCase();
    }

    function readHash(query) {
      return query.toLowerCase();
    }

    var index = Index.from([{title: 'Hello'}, {title: 'World'}], [writeHash, readHash]);

    assert.strictEqual(index.size, 2);
    assert.deepEqual(index.get('hellO'), {title: 'Hello'});

    var map = new Map([
      ['Hello', {title: 'Hello'}],
      ['World', {title: 'World'}]
    ]);

    index = Index.from(map, readHash, true);

    assert.strictEqual(index.size, 2);
    assert.deepEqual(index.get('WOrlD'), {title: 'World'});
  });
});
