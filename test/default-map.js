/**
 * Mnemonist DefaultMap Unit Tests
 * ================================
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

    assert.deepStrictEqual(map.get('one'), [1]);
    assert.deepStrictEqual(map.get('two'), [2]);

    assert.strictEqual(map.size, 2);

    assert.deepStrictEqual(map.get('unknown'), []);

    assert.strictEqual(map.size, 3);

    map.clear();

    assert.strictEqual(map.size, 0);
    assert.deepStrictEqual(map.get('one'), []);
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

  it('should preserve explicitly stored undefined values.', function() {
    var calls = [];
    var map = new DefaultMap(function(key, index) {
      calls.push([key, index]);
      return 'created';
    });

    map.set('known', undefined);

    assert.strictEqual(map.get('known'), undefined);
    assert.strictEqual(map.size, 1);
    assert.deepStrictEqual(calls, []);
    assert.strictEqual(map.get('missing'), 'created');
    assert.deepStrictEqual(calls, [['missing', 1]]);

    assert.strictEqual(map.delete('known'), true);
    assert.strictEqual(map.get('known'), 'created');
    assert.deepStrictEqual(calls, [['missing', 1], ['known', 1]]);
    assert.strictEqual(map.size, 2);
  });

  it('should cache undefined values returned by the factory.', function() {
    var calls = [];
    var map = new DefaultMap(function(key, index) {
      calls.push([key, index]);
      return undefined;
    });

    assert.strictEqual(map.get('one'), undefined);
    assert.strictEqual(map.get('one'), undefined);
    assert.deepStrictEqual(calls, [['one', 0]]);
    assert.strictEqual(map.size, 1);
    assert.deepStrictEqual(take(map.entries()), [['one', undefined]]);

    assert.strictEqual(map.get('two'), undefined);
    assert.deepStrictEqual(calls, [['one', 0], ['two', 1]]);
    assert.strictEqual(map.size, 2);
  });

  it('should be possible to iterate over the map\'s items.', function() {
    var map = new DefaultMap(FACTORY);

    map.get('one').push(1);
    map.get('two').push(2);

    var items = [];

    map.forEach(function(list, key) {
      items.push([key, list]);
    });

    assert.deepStrictEqual(items, [
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

    assert.deepStrictEqual(take(map.entries()), entries);
    assert.deepStrictEqual(take(map.keys()), entries.map(function(e) {
      return e[0];
    }));
    assert.deepStrictEqual(take(map.values()), entries.map(function(e) {
      return e[1];
    }));
  });

  it('should be possible to use typical factories.', function() {
    var map = new DefaultMap(DefaultMap.autoIncrement());

    assert.strictEqual(map.get('test'), 0);
    assert.strictEqual(map.get('test2'), 1);
    assert.strictEqual(map.size, 2);
  });

  it('should be possible to peek.', function() {
    var map = new DefaultMap(FACTORY);

    map.get('one').push(1);

    assert.deepStrictEqual(map.peek('one'), [1]);
    assert.strictEqual(map.peek('two'), undefined);
    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.has('two'), false);
  });
});
