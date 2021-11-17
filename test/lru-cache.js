/**
 * Mnemonist LRUCache Unit Tests
 * ==============================
 */
var assert = require('assert'),
    LRUCache = require('../lru-cache.js'),
    LRUMap = require('../lru-map.js'),
    LRUCacheWithDelete = require('../lru-cache-with-delete.js'),
    LRUMapWithDelete = require('../lru-map-with-delete.js');

function makeTests(Cache, name) {
  describe(name, function() {

    describe('should throw if given an invalid capacity.', function() {
      [undefined, {}, -1, true, 1.01, Infinity].forEach(function(capacity) {
        it('invalid capacity: ' + capacity, function() {
          assert.throws(function() {
            new Cache(capacity);
          }, /capacity/);
        });
      });
    });

    it('should be possible to create a LRU cache.', function() {
      var cache = new Cache(3);

      assert.strictEqual(cache.capacity, 3);

      cache.set('one', 1);
      cache.set('two', 2);

      assert.strictEqual(cache.size, 2);
      assert.deepStrictEqual(Array.from(cache.entries()), [['two', 2], ['one', 1]]);

      cache.set('three', 3);

      assert.strictEqual(cache.size, 3);
      assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['two', 2], ['one', 1]]);

      cache.set('four', 4);

      assert.strictEqual(cache.size, 3);
      assert.deepStrictEqual(Array.from(cache.entries()), [['four', 4], ['three', 3], ['two', 2]]);

      cache.set('two', 5);
      assert.deepStrictEqual(Array.from(cache.entries()), [['two', 5], ['four', 4], ['three', 3]]);

      assert.strictEqual(cache.has('four'), true);
      assert.strictEqual(cache.has('one'), false);

      assert.strictEqual(cache.get('one'), undefined);
      assert.strictEqual(cache.get('four'), 4);

      assert.deepStrictEqual(Array.from(cache.entries()), [['four', 4], ['two', 5], ['three', 3]]);

      assert.strictEqual(cache.get('three'), 3);
      assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['four', 4], ['two', 5]]);

      assert.strictEqual(cache.get('three'), 3);
      assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['four', 4], ['two', 5]]);

      assert.strictEqual(cache.peek('two'), 5);
      assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['four', 4], ['two', 5]]);

      if (name === 'LRUCache' || name === 'LRUCacheWithDelete')
        assert.strictEqual(Object.keys(cache.items).length, 3);
      else
        assert.strictEqual(cache.items.size, 3);
    });

    it('should be possible to clear a LRU cache.', function() {
      var cache = new Cache(3);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('one', 3);

      assert.deepStrictEqual(Array.from(cache.entries()), [['one', 3], ['two', 2]]);

      assert.strictEqual(cache.get('two'), 2);

      assert.deepStrictEqual(Array.from(cache.entries()), [['two', 2], ['one', 3]]);

      cache.clear();

      assert.strictEqual(cache.capacity, 3);
      assert.strictEqual(cache.size, 0);

      assert.strictEqual(cache.has('two'), false);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);
      cache.set('two', 6);
      cache.set('four', 4);

      assert.deepStrictEqual(Array.from(cache.entries()), [['four', 4], ['two', 6], ['three', 3]]);
    });

    it('should be possible to create an iterator over the cache\'s keys.', function() {
      var cache = new Cache(3);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      assert.deepStrictEqual(Array.from(cache.keys()), ['three', 'two', 'one']);
    });

    it('should be possible to create an iterator over the cache\'s values.', function() {
      var cache = new Cache(3);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      assert.deepStrictEqual(Array.from(cache.values()), [3, 2, 1]);
    });

    it('should be possible to pop an evicted value when items are evicted from cache', function() {
      var cache = new Cache(3);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      var popResult = cache.setpop('four', 4);
      assert.deepStrictEqual(popResult, {evicted: true, key: 'one', value: 1});
      assert.deepStrictEqual(Array.from(cache.values()), [4, 3, 2]);
    });

    it('should return null when setting an item does not overwrite or evict', function() {
          var cache = new Cache(3);

          cache.set('one', 1);
          cache.set('two', 2);
          var popResult = cache.setpop('three', 3);
          assert.equal(popResult, null);
    });

    it('should be possible to pop an overwritten value when items are overwritten from cache', function() {
      var cache = new Cache(3);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      var popResult = cache.setpop('three', 10);
      assert.deepStrictEqual(popResult, {evicted: false, key: 'three', value: 3});
      assert.deepStrictEqual(Array.from(cache.values()), [10, 2, 1]);
    });

    it('should work with capacity = 1.', function() {
      var cache = new Cache(1);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3]]);
      assert.strictEqual(cache.get('one'), undefined);
      assert.strictEqual(cache.get('three'), 3);
      assert.strictEqual(cache.get('three'), 3);

      assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3]]);
    });

    it('should be possible to create a cache from an arbitrary iterable.', function() {
      var cache = Cache.from(new Map([['one', 1], ['two', 2]]));

      assert.deepStrictEqual(Array.from(cache.entries()), [['two', 2], ['one', 1]]);
    });

    it('should be possible to create a specialized cache.', function() {
      var cache = new Cache(Uint8Array, Float64Array, 3);

      cache.set(3, 5.6);
      cache.set(12, 6.464);
      cache.set(23, 0.45);
      cache.set(59, -0.464);

      assert.deepStrictEqual(Array.from(cache.entries()), [[59, -0.464], [23, 0.45], [12, 6.464]]);

      var cacheFrom = Cache.from([], Uint8Array, Float64Array, 3);

      cacheFrom.set(3, 5.6);
      cacheFrom.set(12, 6.464);
      cacheFrom.set(23, 0.45);
      cacheFrom.set(59, -0.464);

      assert.deepStrictEqual(Array.from(cacheFrom.entries()), [[59, -0.464], [23, 0.45], [12, 6.464]]);
    });

    it('should be possible to iterate over the cache using a callback.', function() {
      var cache = new Cache(1);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      var entries = [];

      cache.forEach(function(value, key) {
        entries.push([key, value]);
      });

      assert.deepStrictEqual(entries, Array.from(cache.entries()));
    });

    it('should be possible to iterate over the cache.', function() {
      var cache = new Cache(1);

      cache.set('one', 1);
      cache.set('two', 2);
      cache.set('three', 3);

      var entries = [];

      for (var entry of cache)
        entries.push(entry);

      assert.deepStrictEqual(entries, Array.from(cache.entries()));
    });

    if ((name === 'LRUCacheWithDelete') || (name === 'LRUMapWithDelete')) {

      it('should be possible to delete keys from a LRU cache.', function() {
        var cache = new Cache(3);

        assert.strictEqual(cache.capacity, 3);

        cache.set('one', 'uno');
        cache.set('two', 'dos');
        cache.set('three', 'tres');

        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'tres'], ['two', 'dos'], ['one', 'uno']]);

        let dead;

        // Delete head
        dead = cache.delete('three');
        assert.deepStrictEqual(Array.from(cache.entries()), [['two', 'dos'], ['one', 'uno']]);
        assert.deepStrictEqual(dead, 'tres');

        cache.set('three', 'trois');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois'], ['two', 'dos'], ['one', 'uno']]);

        // Delete node which is neither head or tail
        dead = cache.delete('two');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois'], ['one', 'uno']]);
        assert.deepStrictEqual(dead, 'dos');

        // Delete tail
        dead = cache.delete('one');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois']]);
        assert.deepStrictEqual(dead, 'uno');

        // Delete the only key
        dead = cache.delete('three');
        assert.deepStrictEqual(dead, 'trois');
        assert.strictEqual(cache.capacity, 3);
        assert.strictEqual(cache.size, 0);
        assert.strictEqual(cache.head, 0);
        assert.strictEqual(cache.tail, 0);

        cache.set('one', 'uno');
        cache.set('two', 'dos');
        cache.set('three', 'tres');
        cache.set('two', 'deux');
        cache.set('four', 'cuatro');

        assert.deepStrictEqual(Array.from(cache.entries()), [['four', 'cuatro'], ['two', 'deux'], ['three', 'tres']]);
      });

      it('maintains LRU order regardless of deletions', function() {
        var cache = new Cache(5);
        let dead;

        cache.set('one', 'uno'); cache.set('two', 'dos'); cache.set('three', 'tres');
        cache.set('four', 'cuatro'); cache.set('five', 'cinco');
        cache.get('one'); // order is [ one // five four three two ] <-- two will be removed
        cache.set('six', 'seis');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['six', 'seis'], ['one', 'uno'], ['five', 'cinco'], ['four', 'cuatro'], ['three', 'tres']]);
        dead = cache.delete('five');
        assert.deepStrictEqual(dead, 'cinco');
        cache.set('one', 'rast');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['one', 'rast'], ['six', 'seis'], ['four', 'cuatro'], ['three', 'tres']]);
        cache.set('seven', 'siete');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro'], ['three', 'tres']]);
        cache.set('eight', 'ocho');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['eight', 'ocho'], ['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro']]);
        dead = cache.delete('five');
        assert.deepStrictEqual(dead, undefined);
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['eight', 'ocho'], ['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro']]);
      });


      it('enjoys a healthy workout', function() {
        var cache = new Cache(4);
        cache.set(0, 'cero'); cache.set(1, 'uno'); cache.set(2, 'dos'); cache.delete(1);
        cache.set(3, 'tres'); cache.set(4, 'cuatro'); cache.get(2);
        assert.deepStrictEqual(Array.from(cache.entries()), [[2, 'dos'], [4, 'cuatro'], [3, 'tres'], [0, 'cero']]);

        cache.set(5, 'cinco'); cache.set(6, 'seis'); cache.delete(1); cache.delete(2); cache.set(5, 'cinq');
        assert.deepStrictEqual(Array.from(cache.entries()), [[5, 'cinq'], [6, 'seis'], [4, 'cuatro']]);

        cache.set(7, 'siete'); cache.set(8, 'ocho'); cache.set(9, 'nueve'); cache.delete(8); cache.set(10, 'diez');
        assert.deepStrictEqual(Array.from(cache.entries()), [[10, 'diez'], [9, 'nueve'], [7, 'siete'], [5, 'cinq']]);

        cache.set(7, 'sept'); cache.get(5); cache.set(8, 'huit'); cache.set(9, 'neuf'); cache.set(10, 'dix');
        assert.deepStrictEqual(Array.from(cache.entries()), [[10, 'dix'], [9, 'neuf'], [8, 'huit'], [5, 'cinq']]);

        cache.get(8); cache.delete(10); cache.set(1, 'rast'); cache.set(2, 'deux'); cache.get(8);
        assert.deepStrictEqual(Array.from(cache.entries()), [[8, 'huit'], [2, 'deux'], [1, 'rast'], [9, 'neuf']]);

        cache.delete(2); cache.delete(9); cache.get(1); cache.set(2, 'dva'); cache.get(1); cache.set(3, 'tri');
        assert.deepStrictEqual(Array.from(cache.entries()), [[3, 'tri'], [1, 'rast'], [2, 'dva'], [8, 'huit']]);
      });
    }
  });
}

makeTests(LRUCache, 'LRUCache');
makeTests(LRUMap, 'LRUMap');
makeTests(LRUCacheWithDelete, 'LRUCacheWithDelete');
makeTests(LRUMapWithDelete, 'LRUMapWithDelete');
