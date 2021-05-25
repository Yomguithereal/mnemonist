/**
 * Mnemonist LRUCache Unit Tests
 * ==============================
 */
var assert = require('assert'),
    LRUCache = require('../lru-cache.js'),
    LRUMap = require('../lru-map.js'),
    ObliviousLRUCache = require('../oblivious-lru-cache.js');

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

      if (name === 'LRUCache' || name === 'ObliviousLRUCache')
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

    if (name === 'ObliviousLRUCache') {
      it('should be possible to delete keys from a LRU cache.', function() {
        var cache = new Cache(3);

        assert.strictEqual(cache.capacity, 3);

        cache.set('one', 1);
        cache.set('two', 2);
        cache.set('three', 3);

        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['two', 2], ['one', 1]]);

        // Delete head
        cache.delete('three');
        assert.deepStrictEqual(Array.from(cache.entries()), [['two', 2], ['one', 1]]);

        cache.set('three', 3);
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['two', 2], ['one', 1]]);
        // Delete node which is neither head or tail
        cache.delete('two');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3], ['one', 1]]);

        // Delete tail
        cache.delete('one');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 3]]);

        // Delete the only key
        cache.delete('three');
        assert.strictEqual(cache.capacity, 3);
        assert.strictEqual(cache.size, 0);
        assert.strictEqual(cache.head, 0);
        assert.strictEqual(cache.tail, 0);

        cache.set('one', 1);
        cache.set('two', 2);
        cache.set('three', 3);
        cache.set('two', 6);
        cache.set('four', 4);

        assert.deepStrictEqual(Array.from(cache.entries()), [['four', 4], ['two', 6], ['three', 3]]);
      });
    }
  });
}

makeTests(LRUCache, 'LRUCache');
makeTests(LRUMap, 'LRUMap');
makeTests(ObliviousLRUCache, 'ObliviousLRUCache');
