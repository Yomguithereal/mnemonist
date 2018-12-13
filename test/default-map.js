/**
 * Mnemonist DefaultMap Unit Tests
 * ==============================
 */
var assert = require('assert'),
    DefaultMap = require('../default-map.js'),
    take = require('obliterator/take');

var FACTORY = function() {
  return [];
};

describe('DefaultMap', function() {

  it('should throw if passed factory is not a function.', function() {

    assert.throws(function() {
      new DefaultMap(null);
    }, /function/);
  });

  it('should be possible to set & get keys.', function() {
    var map = new DefaultMap(FACTORY);

    map.get('one').push(1);
    map.set('two', [2]);

    assert.deepEqual(map.get('one'), [1]);
    assert.deepEqual(map.get('two'), [2]);

    assert.strictEqual(map.size, 2);

    assert.deepEqual(map.get('unknown'), []);

    assert.strictEqual(map.size, 3);

    map.clear();

    assert.strictEqual(map.size, 0);
    assert.deepEqual(map.get('one'), []);
  });

  it('should be possible to delete keys.', function() {
    var map = new DefaultMap(FACTORY);

    map.set('one', 1);

    assert.strictEqual(map.has('one'), true);
    assert.strictEqual(map.delete('one'), true);
    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.has('one'), false);
    assert.strictEqual(map.delete('one'), false);
  });

  it('should be possible to iterate over the map\'s items.', function() {
    var map = new DefaultMap(FACTORY);

    map.get('one').push(1);
    map.get('two').push(2);

    var items = [];

    map.forEach(function(list, key) {
      items.push([key, list]);
    });

    assert.deepEqual(items, [
      ['one', [1]],
      ['two', [2]]
    ]);
  });

  it('should be possible to create iterators.', function() {
    var map = new DefaultMap(FACTORY);

    map.get('one').push(1);
    map.get('two').push(2);

    var entries = [
      ['one', [1]],
      ['two', [2]]
    ];

    assert.deepEqual(take(map.entries()), entries);
    assert.deepEqual(take(map.keys()), entries.map(function(e) {
      return e[0];
    }));
    assert.deepEqual(take(map.values()), entries.map(function(e) {
      return e[1];
    }));
  });

  it('should be possible to use typical factories.', function() {
    var map = new DefaultMap(DefaultMap.autoIncrement());

    assert.strictEqual(map.get('test'), 0);
    assert.strictEqual(map.get('test2'), 1);
    assert.strictEqual(map.size, 2);
  });
});
