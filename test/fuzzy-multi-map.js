/* eslint no-new: 0 */
/**
 * Mnemonist FuzzyMultiMap Unit Tests
 * ===================================
 */
var assert = require('assert'),
    FuzzyMultiMap = require('../fuzzy-multi-map.js');

describe('FuzzyMultiMap', function() {

  it('should throw if given invalid hash functions.', function() {

    assert.throws(function() {
      new FuzzyMultiMap({hello: 'world'});
    }, /hash/);

    assert.throws(function() {
      new FuzzyMultiMap([{hello: 'world'}]);
    }, /hash/);

    assert.throws(function() {
      new FuzzyMultiMap([null, {hello: 'world'}]);
    }, /hash/);
  });

  it('should be possible to add items to the map.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.title.toLowerCase();
    });

    map.add({title: 'Hello'});
    map.add({title: 'Hello'});
    map.add({title: 'World'});

    assert.strictEqual(map.size, 3);
  });

  it('should be possible to set values.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.toLowerCase();
    });

    map.set('Hello', {title: 'Hello'});
    map.set('HeLLo', {title: 'Hello'});
    map.set('World', {title: 'World'});

    assert.strictEqual(map.size, 3);
  });

  it('should be possible to clear the map.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.title.toLowerCase();
    });

    map.add({title: 'Hello'});
    map.add({title: 'World'});

    map.clear();

    assert.strictEqual(map.size, 0);
  });

  it('should be possible to get items from the map.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.toLowerCase();
    });

    map.set('Hello', {title: 'Hello1'});
    map.set('HellO', {title: 'Hello2'});
    map.set('World', {title: 'World'});

    assert.deepEqual(map.get('HELLO'), [{title: 'Hello1'}, {title: 'Hello2'}]);
    assert.deepEqual(map.get('shawarama'), undefined);
  });

  it('should be possible to test the existence of an item in the map.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.toLowerCase();
    });

    map.set('HELLO', {title: 'hello'});

    assert.strictEqual(map.has('HELLO'), true);
    assert.strictEqual(map.has('Hello'), true);
    assert.strictEqual(map.has('hello'), true);
    assert.strictEqual(map.has('test'), false);
  });

  it('should be possible to iterate over an index\'s values.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.toLowerCase();
    });

    map.set('Hello', {title: 'Hello'});
    map.set('World', {title: 'World'});

    var i = 0;

    map.forEach(function(value) {
      assert.deepEqual(value, !i ? {title: 'Hello'} : {title: 'World'});
      i++;
    });

    assert.strictEqual(i, 2);
  });

  it('should be possible to create an iterator over an index\'s values.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.toLowerCase();
    });

    map.set('Hello', {title: 'Hello'});
    map.set('World', {title: 'World'});

    var iterator = map.values();

    assert.deepEqual(iterator.next().value, {title: 'Hello'});
    assert.deepEqual(iterator.next().value, {title: 'World'});
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over an index\'s values using for...of.', function() {
    var map = new FuzzyMultiMap(function(item) {
      return item.toLowerCase();
    });

    map.set('Hello', {title: 'Hello'});
    map.set('World', {title: 'World'});

    var i = 0;

    for (var value of map) {
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

    var map = FuzzyMultiMap.from([{title: 'Hello'}, {title: 'World'}], [writeHash, readHash]);

    assert.strictEqual(map.size, 2);
    assert.deepEqual(map.get('hellO'), [{title: 'Hello'}]);

    var otherMap = new Map([
      ['Hello', {title: 'Hello'}],
      ['World', {title: 'World'}]
    ]);

    map = FuzzyMultiMap.from(otherMap, readHash, true);

    assert.strictEqual(map.size, 2);
    assert.deepEqual(map.get('WOrlD'), [{title: 'World'}]);
  });

  it('should work with a Set container.', function() {
    var map = new FuzzyMultiMap(function(query) {
      return query.toLowerCase();
    }, Set);

    var three = {title: 'Hello3'};

    map.set('hello', {title: 'Hello1'});
    map.set('hellO', {title: 'Hello2'});
    map.set('HeLLo', three);
    map.set('hello', three);

    assert.strictEqual(map.size, 3);

    var set = map.get('hello');

    assert.deepEqual(Array.from(set), [
      {title: 'Hello1'},
      {title: 'Hello2'},
      {title: 'Hello3'}
    ]);
  });
});
