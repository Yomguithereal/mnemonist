/**
 * Mnemonist LRUCache Unit Tests
 * ==============================
 */
var assert = require('assert'),
    LRUCache = require('../lru-cache.js');

describe('LRUCache', function() {

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
});

// TODO: test case with 1
