/**
 * Mnemonist LRUCache Unit Tests
 * ==============================
 */
var assert = require('assert'),
    LRUCache = require('../lru-cache.js'),
    LRUMap = require('../lru-map.js'),
    LRUCacheWithDelete = require('../lru-cache-with-delete.js'),
    LRUMapWithDelete = require('../lru-map-with-delete.js'),
    LRUCacheWithExpiry = require('../lru-cache-with-expiry.js');
//
var NodeUtil = require('util');

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

      if (/LRUCache/.test(name))
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

    if (/With/.test(name)) {

      it('should be possible to delete keys from a LRU cache.', function() {
        var cache = new Cache(3);
        let wasDeleted;

        assert.strictEqual(cache.capacity, 3);

        // Delete when nothing has ever been added
        wasDeleted = cache.delete('one');
        assert.strictEqual(wasDeleted, false);

        cache.set('one', 'uno');
        cache.set('two', 'dos');
        cache.set('three', 'tres');

        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'tres'], ['two', 'dos'], ['one', 'uno']]);

        // Delete a key that has never been seen
        wasDeleted = cache.delete('NEVER SEEN EM');
        assert.strictEqual(wasDeleted, false);

        // Delete head
        wasDeleted = cache.delete('three');
        assert.deepStrictEqual(Array.from(cache.entries()), [['two', 'dos'], ['one', 'uno']]);
        assert.strictEqual(wasDeleted, true);
        wasDeleted = cache.delete('three');
        assert.strictEqual(wasDeleted, false);

        cache.set('three', 'trois');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois'], ['two', 'dos'], ['one', 'uno']]);

        // Delete node which is neither head or tail
        wasDeleted = cache.delete('two');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois'], ['one', 'uno']]);
        assert.strictEqual(wasDeleted, true);
        wasDeleted = cache.delete('two');
        assert.strictEqual(wasDeleted, false);

        // Delete tail
        wasDeleted = cache.delete('one');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois']]);
        assert.strictEqual(wasDeleted, true);

        // Delete the only key
        wasDeleted = cache.delete('three');
        assert.strictEqual(wasDeleted, true);
        assert.strictEqual(cache.capacity, 3);
        assert.strictEqual(cache.size, 0);
        assert.strictEqual(cache.head, 0);
        assert.strictEqual(cache.tail, 0);

        // Delete from an emptied LRU
        wasDeleted = cache.delete('three');
        assert.strictEqual(wasDeleted, false);

        cache.set('one', 'uno');
        cache.set('two', 'dos');
        cache.set('three', 'tres');
        cache.set('two', 'deux');
        cache.set('four', 'cuatro');

        assert.deepStrictEqual(Array.from(cache.entries()), [['four', 'cuatro'], ['two', 'deux'], ['three', 'tres']]);

      });

      it('should be possible to remove keys from a LRU cache, receiving their value.', function() {
        var cache = new Cache(3);
        let dead;
        var missingMarker = 'ABSENT';

        assert.strictEqual(cache.capacity, 3);

        // Remove when nothing has ever been added
        dead = cache.remove('one');
        assert.strictEqual(dead, undefined);
        dead = cache.remove('one', missingMarker);
        assert.equal(dead, missingMarker);

        cache.set('one', 'uno');

        cache.set('two', 'dos');
        cache.set('three', 'tres');

        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'tres'], ['two', 'dos'], ['one', 'uno']]);

        // Remove a key that has never been seen
        dead = cache.remove('NEVER SEEN EM');
        assert.strictEqual(dead, undefined);

        // Remove head
        dead = cache.remove('three');
        assert.deepStrictEqual(Array.from(cache.entries()), [['two', 'dos'], ['one', 'uno']]);
        assert.strictEqual(dead, 'tres');

        cache.set('three', 'trois');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois'], ['two', 'dos'], ['one', 'uno']]);

        // Remove node which is neither head or tail
        dead = cache.remove('two');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois'], ['one', 'uno']]);
        assert.strictEqual(dead, 'dos');

        // Remove tail
        dead = cache.remove('one');
        assert.deepStrictEqual(Array.from(cache.entries()), [['three', 'trois']]);
        assert.strictEqual(dead, 'uno');

        // Remove the only key
        dead = cache.remove('three');
        assert.strictEqual(dead, 'trois');
        assert.strictEqual(cache.capacity, 3);
        assert.strictEqual(cache.size, 0);
        assert.strictEqual(cache.head, 0);
        assert.strictEqual(cache.tail, 0);

        // Remove from an emptied LRU
        dead = cache.remove('three');
        assert.strictEqual(dead, undefined);

        cache.set('one', 'uno');
        cache.set('two', 'dos');
        cache.set('three', 'tres');
        cache.set('two', 'deux');
        cache.set('four', 'cuatro');

        assert.deepStrictEqual(Array.from(cache.entries()), [['four', 'cuatro'], ['two', 'deux'], ['three', 'tres']]);

      });

      it('sets and removes falsy values gracefully', function() {
        var cache = new Cache(3);
        let ret;
        var arr = [];
        var bag = {};
        var mum = '';
        var missingMarker = 'ABSENT';

        cache.set('arr', arr); ret = cache.remove('arr'); assert.equal(ret, arr);
        cache.set('bag', bag); ret = cache.remove('bag'); assert.equal(ret, bag);
        cache.set('nul', null); ret = cache.remove('nul'); assert.strictEqual(ret, null);
        cache.set('mum', mum); ret = cache.remove('mum'); assert.equal(ret, mum);
        cache.set('zip', 0); ret = cache.remove('zip'); assert.strictEqual(ret, 0);
        cache.set('boo', false); ret = cache.remove('boo'); assert.strictEqual(ret, false);
        cache.set('und', undefined);
        ret = cache.remove('und', missingMarker);
        assert.strictEqual(ret, undefined);
      });

      it('allows a custom missing indicator', function() {
        var cache = new Cache(3);
        let ret;
        var missingMarker = 'ABSENT';

        // if an entry's proper value is undefined, undefined is returned.
        cache.set('und', undefined);
        ret = cache.remove('und', missingMarker);
        assert.strictEqual(ret, undefined);
        // if an entry is absent, the supplied marker is returned.
        ret = cache.remove('und', missingMarker);
        assert.equal(ret, missingMarker);
      });

      it('maintains LRU order regardless of deletions', function() {
        var cache = new Cache(5);
        let wasDeleted;

        cache.set('one', 'uno'); cache.set('two', 'dos'); cache.set('three', 'tres');
        cache.set('four', 'cuatro'); cache.set('five', 'cinco');
        cache.get('one'); // order is [ one // five four three two ] <-- two will be removed
        cache.set('six', 'seis');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['six', 'seis'], ['one', 'uno'], ['five', 'cinco'], ['four', 'cuatro'], ['three', 'tres']]);
        wasDeleted = cache.delete('five');
        assert.strictEqual(wasDeleted, true);
        wasDeleted = cache.delete('not_here');
        assert.strictEqual(wasDeleted, false);
        cache.set('one', 'rast');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['one', 'rast'], ['six', 'seis'], ['four', 'cuatro'], ['three', 'tres']]);
        cache.set('seven', 'siete');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro'], ['three', 'tres']]);
        cache.set('eight', 'ocho');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['eight', 'ocho'], ['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro']]);
        wasDeleted = cache.delete('five');
        assert.strictEqual(wasDeleted, false);
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['eight', 'ocho'], ['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro']]);
      });


      it('maintains LRU order regardless of removals', function() {
        var cache = new Cache(5);
        let dead;

        cache.set('one', 'uno'); cache.set('two', 'dos'); cache.set('three', 'tres');
        cache.set('four', 'cuatro'); cache.set('five', 'cinco');
        cache.get('one'); // order is [ one // five four three two ] <-- two will be removed
        cache.set('six', 'seis');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['six', 'seis'], ['one', 'uno'], ['five', 'cinco'], ['four', 'cuatro'], ['three', 'tres']]);
        dead = cache.remove('five');
        assert.strictEqual(dead, 'cinco');
        dead = cache.remove('not_here');
        assert.strictEqual(dead, undefined);
        cache.set('one', 'rast');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['one', 'rast'], ['six', 'seis'], ['four', 'cuatro'], ['three', 'tres']]);
        cache.set('seven', 'siete');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro'], ['three', 'tres']]);
        cache.set('eight', 'ocho');
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['eight', 'ocho'], ['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro']]);
        dead = cache.remove('five');
        assert.strictEqual(dead, undefined);
        assert.deepStrictEqual(Array.from(cache.entries()),
          [['eight', 'ocho'], ['seven', 'siete'], ['one', 'rast'], ['six', 'seis'], ['four', 'cuatro']]);
      });

      it('enjoys a healthy workout of deletions', function() {
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

      it('enjoys a healthy workout of removals', function() {
        var cache = new Cache(4);
        cache.set(0, 'cero'); cache.set(1, 'uno'); cache.set(2, 'dos'); cache.remove(1);
        cache.set(3, 'tres'); cache.set(4, 'cuatro'); cache.get(2);
        assert.deepStrictEqual(Array.from(cache.entries()), [[2, 'dos'], [4, 'cuatro'], [3, 'tres'], [0, 'cero']]);

        cache.set(5, 'cinco'); cache.set(6, 'seis'); cache.remove(1); cache.remove(2); cache.set(5, 'cinq');
        assert.deepStrictEqual(Array.from(cache.entries()), [[5, 'cinq'], [6, 'seis'], [4, 'cuatro']]);

        cache.set(7, 'siete'); cache.set(8, 'ocho'); cache.set(9, 'nueve'); cache.remove(8); cache.set(10, 'diez');
        assert.deepStrictEqual(Array.from(cache.entries()), [[10, 'diez'], [9, 'nueve'], [7, 'siete'], [5, 'cinq']]);

        cache.set(7, 'sept'); cache.get(5); cache.set(8, 'huit'); cache.set(9, 'neuf'); cache.set(10, 'dix');
        assert.deepStrictEqual(Array.from(cache.entries()), [[10, 'dix'], [9, 'neuf'], [8, 'huit'], [5, 'cinq']]);

        cache.get(8); cache.remove(10); cache.set(1, 'rast'); cache.set(2, 'deux'); cache.get(8);
        assert.deepStrictEqual(Array.from(cache.entries()), [[8, 'huit'], [2, 'deux'], [1, 'rast'], [9, 'neuf']]);

        cache.remove(2); cache.remove(9); cache.get(1); cache.set(2, 'dva'); cache.get(1); cache.set(3, 'tri');
        assert.deepStrictEqual(Array.from(cache.entries()), [[3, 'tri'], [1, 'rast'], [2, 'dva'], [8, 'huit']]);
      });

    }

    describe('inspection', function() {
      function makeExercisedCache(capacity) {
        var cache = new Cache(capacity), ii;
        cache.set(1, 'a'); cache.set(2, 'b'); cache.set('too old', 'c'); cache.set('oldest', 'd');
        for (ii = 0; ii < capacity - 3; ii++) { cache.set(ii * 2, ii * 2); }
        cache.set(4, 'D'); cache.set(2, 'B'); cache.get(1);
        cache.set(5, 'e'); cache.set(6, 'f');
        return cache;
      }

      it('toString() states the name size and capacity', function () {
        var cache = new Cache(null, null, 200, {ttk: 900000});
        cache.set(0, 'cero'); cache.set(1, 'uno');
        assert.deepStrictEqual(cache.toString(), `[object ${name}:2/200]`);
        if (typeof Symbol !== 'undefined') {
          assert.deepStrictEqual(cache[Symbol.toStringTag], `${name}:2/200`);
        }
        assert.deepStrictEqual(cache.summary, `${name}:2/200`);
        cache.set(2, 'dos'); cache.set(3, 'tres');
        assert.deepStrictEqual(cache.toString(), `[object ${name}:4/200]`);
        cache = makeExercisedCache(200);
        assert.deepStrictEqual(cache.toString(), `[object ${name}:200/200]`);
      });

      if (typeof Symbol !== 'undefined') {
        it('registers its inspect method for the console.log and friends to use', function () {
          var cache = makeExercisedCache(7);
          assert.deepStrictEqual(cache[Symbol.for('nodejs.util.inspect.custom')], cache.inspect);
        });

        it('attaches the summary getter to the magic [Symbol.toStringTag] property', function () {
          var cache = makeExercisedCache(7);
          assert.deepStrictEqual(cache[Symbol.toStringTag], cache.summary);
        });
      }

      it('accepts limits on what inspect returns', function () {
        var cache = new Cache(15), inspectedItems;
        // empty
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, []);
        //
        cache.set(1, 'a');
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[1, 'a']]);
        //
        cache.set(2, 'b');
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[2, 'b'], [1, 'a']]);
        //
        cache.set(3, 'c');
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[3, 'c'], [2, 'b'], [1, 'a']]);
        //
        cache.set(4, 'd');
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[4, 'd'], [3, 'c'], [2, 'b'], [1, 'a']]);
        //
        cache.set(5, 'e');
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[5, 'e'], [4, 'd'], [3, 'c'], [2, 'b'], [1, 'a']]);
        //
        cache.set(6, 'f');
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[6, 'f'], [5, 'e'], [4, 'd'], ['_...', 2], [1, 'a']]);
        //
        var ii;
        for (ii = 0; ii < 20; ii++) { cache.set(ii * 2, ii * 2); }
        inspectedItems = Array.from(cache.inspect({maxToDump: 5}).entries());
        assert.deepStrictEqual(inspectedItems, [[38, 38], [36, 36], [34, 34], ['_...', 11], [10, 10]]);
      });

      it('puts a reasonable limit on what the console will show (large)', function () {
        var cache = makeExercisedCache(600);
        var asSeenInConsole = NodeUtil.inspect(cache);
        // we're trying not to depend on what a given version of node actually serializes
        var itemsDumped = /6 => 'f',\s*5 => 'e',\s*1 => 'a',(.|\n)+1168 => 1168,\s*'_\.\.\.' => 581,\s*'oldest' => 'd'/;
        assert.deepStrictEqual(itemsDumped.test(asSeenInConsole), true);
        assert.deepStrictEqual(new RegExp(`${name}:\[600/600\]`).test(asSeenInConsole), true);
        assert.deepStrictEqual(asSeenInConsole.length < 800, true);
      });

      it('puts a reasonable limit on what the console will show (small)', function () {
        var cache = makeExercisedCache(7);
        var asSeenInConsole = NodeUtil.inspect(cache);
        var itemsDumped = /6 => 'f',\s*5 => 'e',\s*1 => 'a',\s*2 => 'B',\s*4 => 'D',\s*0 => 0,\s*'oldest' => 'd'/;
        assert.deepStrictEqual(itemsDumped.test(asSeenInConsole), true);
        assert.deepStrictEqual(new RegExp(`${name}:7/7`).test(asSeenInConsole), true);
      });

      it('listens to advice about maximum inspection depth', function () {
        var cache = makeExercisedCache(7);
        var asSeenInConsole = NodeUtil.inspect({foo: {bar: cache}});
        var itemsDumped = /6 => 'f',\s*5 => 'e',\s*1 => 'a',\s*2 => 'B',\s*4 => 'D',\s*0 => 0,\s*'oldest' => 'd'/;
        assert.deepStrictEqual(itemsDumped.test(asSeenInConsole), true);
        assert.deepStrictEqual(asSeenInConsole.length > 150, true);
        // Cannot depend on this existing in older versions.
        // asSeenInConsole = NodeUtil.inspect({foo: {bar: [cache]}});
        // deepStrictEqual(asSeenInConsole.length < 70, true);
        // deepStrictEqual(new RegExp(`\\[ \\[object ${name}:7/7\\] \\]`).test(asSeenInConsole), true);
      });

      it('allows inspection of the raw item if "all" is given', function () {
        var cache = makeExercisedCache(250);
        var inspected = cache.inspect({maxToDump: 8, all: true});
        var kk;
        for (kk of ['items', 'K', 'V', 'size', 'capacity']) {
          assert.deepStrictEqual(inspected[kk] === cache[kk], true);
        }
        assert.deepStrictEqual(Object.keys(cache), Object.keys(inspected));
      });

    });

  });
}

makeTests(LRUCache, 'LRUCache');
makeTests(LRUMap, 'LRUMap');
makeTests(LRUCacheWithDelete, 'LRUCacheWithDelete');
makeTests(LRUMapWithDelete, 'LRUMapWithDelete');
makeTests(LRUCacheWithExpiry, 'LRUCacheWithExpiry');
