/**
 * Mnemonist LRUCache Unit Tests
 * ==============================
 */
var assert = require('assert'),
    LRUCache = require('../lru-cache.js');

describe('LRUCache', function() {

  it('should throw if given an invalid capacity.', function() {
    assert.throws(function() {
      var cache = new LRUCache({});
    }, /capacity/);
  });

  it('should be possible to create a LRU cache.', function() {
    var cache = new LRUCache(3);

    assert.strictEqual(cache.capacity, 3);

    cache.set('one', 1);
    cache.set('two', 2);

    assert.strictEqual(cache.size, 2);
    assert.deepEqual(Array.from(cache.entries()), [['two', 2], ['one', 1]]);

    cache.set('three', 3);

    assert.strictEqual(cache.size, 3);
    assert.deepEqual(Array.from(cache.entries()), [['three', 3], ['two', 2], ['one', 1]]);

    cache.set('four', 4);

    assert.strictEqual(cache.size, 3);
    assert.deepEqual(Array.from(cache.entries()), [['four', 4], ['three', 3], ['two', 2]]);

    cache.set('two', 5);
    assert.deepEqual(Array.from(cache.entries()), [['two', 5], ['four', 4], ['three', 3]]);

    assert.strictEqual(cache.has('four'), true);
    assert.strictEqual(cache.has('one'), false);

    assert.strictEqual(cache.get('one'), undefined);
    assert.strictEqual(cache.get('four'), 4);

    assert.deepEqual(Array.from(cache.entries()), [['four', 4], ['two', 5], ['three', 3]]);

    assert.strictEqual(cache.get('three'), 3);
    assert.deepEqual(Array.from(cache.entries()), [['three', 3], ['four', 4], ['two', 5]]);

    assert.strictEqual(cache.get('three'), 3);
    assert.deepEqual(Array.from(cache.entries()), [['three', 3], ['four', 4], ['two', 5]]);

    assert.strictEqual(Object.keys(cache.items).length, 3);
  });

  it('should be possible to clear a LRU cache.', function() {
    var cache = new LRUCache(3);

    cache.set('one', 1);
    cache.set('two', 2);
    cache.set('one', 3);

    assert.deepEqual(Array.from(cache.entries()), [['one', 3], ['two', 2]]);

    assert.strictEqual(cache.get('two'), 2);

    assert.deepEqual(Array.from(cache.entries()), [['two', 2], ['one', 3]]);

    cache.clear();

    assert.strictEqual(cache.capacity, 3);
    assert.strictEqual(cache.size, 0);

    assert.strictEqual(cache.has('two'), false);

    cache.set('one', 1);
    cache.set('two', 2);
    cache.set('three', 3);
    cache.set('two', 6);
    cache.set('four', 4);

    assert.deepEqual(Array.from(cache.entries()), [['four', 4], ['two', 6], ['three', 3]]);
  });

  it('should be possible to create an iterator over the cache\'s keys.', function() {
    var cache = new LRUCache(3);

    cache.set('one', 1);
    cache.set('two', 2);
    cache.set('three', 3);

    assert.deepEqual(Array.from(cache.keys()), ['three', 'two', 'one']);
  });

  it('should be possible to create an iterator over the cache\'s values.', function() {
    var cache = new LRUCache(3);

    cache.set('one', 1);
    cache.set('two', 2);
    cache.set('three', 3);

    assert.deepEqual(Array.from(cache.values()), [3, 2, 1]);
  });

  it('should work with capacity = 1.', function() {
    var cache = new LRUCache(1);

    cache.set('one', 1);
    cache.set('two', 2);
    cache.set('three', 3);

    assert.deepEqual(Array.from(cache.entries()), [['three', 3]]);
    assert.strictEqual(cache.get('one'), undefined);
    assert.strictEqual(cache.get('three'), 3);
    assert.strictEqual(cache.get('three'), 3);

    assert.deepEqual(Array.from(cache.entries()), [['three', 3]]);
  });

  it('should be possible to create a cache from an arbitrary iterable.', function() {
    var cache = LRUCache.from(new Map([['one', 1], ['two', 2]]));

    assert.deepEqual(Array.from(cache.entries()), [['two', 2], ['one', 1]]);
  });

  it('should be possible to create a specialized cache.', function() {
    var cache = new LRUCache(Uint8Array, Float64Array, 3);

    cache.set(3, 5.6);
    cache.set(12, 6.464);
    cache.set(23, 0.45);
    cache.set(59, -0.464);

    assert.deepEqual(Array.from(cache.entries()), [[59, -0.464], [23, 0.45], [12, 6.464]]);

    var cacheFrom = LRUCache.from([], Uint8Array, Float64Array, 3);

    cacheFrom.set(3, 5.6);
    cacheFrom.set(12, 6.464);
    cacheFrom.set(23, 0.45);
    cacheFrom.set(59, -0.464);

    assert.deepEqual(Array.from(cacheFrom.entries()), [[59, -0.464], [23, 0.45], [12, 6.464]]);
  });
});
