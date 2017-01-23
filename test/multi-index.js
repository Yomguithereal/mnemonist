/* eslint no-new: 0 */
/**
 * Mnemonist MultiIndex Unit Tests
 * ===========================
 */
var assert = require('assert'),
    MultiIndex = require('../multi-index.js');

describe('MultiIndex', function() {

  it('should throw if given invalid hash functions.', function() {

    assert.throws(function() {
      new MultiIndex({hello: 'world'});
    }, /hash/);

    assert.throws(function() {
      new MultiIndex([{hello: 'world'}]);
    }, /hash/);

    assert.throws(function() {
      new MultiIndex([null, {hello: 'world'}]);
    }, /hash/);
  });

  it('should be possible to add items to the index.', function() {
    var index = new MultiIndex(function(item) {
      return item.title.toLowerCase();
    });

    index.add({title: 'Hello'});
    index.add({title: 'Hello'});
    index.add({title: 'World'});

    assert.strictEqual(index.size, 3);
  });

  it('should be possible to set values.', function() {
    var index = new MultiIndex(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello'});
    index.set('HeLLo', {title: 'Hello'});
    index.set('World', {title: 'World'});

    assert.strictEqual(index.size, 3);
  });

  it('should be possible to clear the index.', function() {
    var index = new MultiIndex(function(item) {
      return item.title.toLowerCase();
    });

    index.add({title: 'Hello'});
    index.add({title: 'World'});

    index.clear();

    assert.strictEqual(index.size, 0);
  });

  it('should be possible to get items from the index.', function() {
    var index = new MultiIndex(function(item) {
      return item.toLowerCase();
    });

    index.set('Hello', {title: 'Hello1'});
    index.set('HellO', {title: 'Hello2'});
    index.set('World', {title: 'World'});

    assert.deepEqual(index.get('HELLO'), [{title: 'Hello1'}, {title: 'Hello2'}]);
    assert.deepEqual(index.get('shawarama'), undefined);
  });

  it('should be possible to iterate over an index\'s values.', function() {
    var index = new MultiIndex(function(item) {
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
    var index = new MultiIndex(function(item) {
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
    var index = new MultiIndex(function(item) {
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

    var index = MultiIndex.from([{title: 'Hello'}, {title: 'World'}], [writeHash, readHash]);

    assert.strictEqual(index.size, 2);
    assert.deepEqual(index.get('hellO'), [{title: 'Hello'}]);

    var map = new Map([
      ['Hello', {title: 'Hello'}],
      ['World', {title: 'World'}]
    ]);

    index = MultiIndex.from(map, readHash, true);

    assert.strictEqual(index.size, 2);
    assert.deepEqual(index.get('WOrlD'), [{title: 'World'}]);
  });

  it('should work with a Set container.', function() {
    var index = new MultiIndex(function(query) {
      return query.toLowerCase();
    }, Set);

    var three = {title: 'Hello3'};

    index.set('hello', {title: 'Hello1'});
    index.set('hellO', {title: 'Hello2'});
    index.set('HeLLo', three);
    index.set('hello', three);

    assert.strictEqual(index.size, 3);

    var set = index.get('hello');

    assert.deepEqual(Array.from(set), [
      {title: 'Hello1'},
      {title: 'Hello2'},
      {title: 'Hello3'}
    ]);
  });
});
