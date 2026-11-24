/**
 * Mnemonist DefaultWeakMap Unit Tests
 * ===================================
 */
var assert = require('assert'),
    DefaultWeakMap = require('../default-weak-map.js');

var FACTORY = function() {
  return [];
};

describe('DefaultWeakMap', function() {

  it('should throw if passed factory is not a function.', function() {

    assert.throws(function() {
      new DefaultWeakMap(null);
    }, /function/);
  });

  it('should be possible to set & get keys.', function() {
    var map = new DefaultWeakMap(FACTORY);
    const one = {}, two = {}, unknown = {};

    map.get(one).push(1);
    map.set(two, [2]);

    assert.deepStrictEqual(map.get(one), [1]);
    assert.deepStrictEqual(map.get(two), [2]);

    assert.deepStrictEqual(map.get(unknown), []);

    map.clear();

    assert.deepStrictEqual(map.get(one), []);
  });

  it('should be possible to delete keys.', function() {
    var map = new DefaultWeakMap(FACTORY);
    const one = {};

    map.set(one, 1);

    assert.strictEqual(map.has(one), true);
    assert.strictEqual(map.delete(one), true);
    assert.strictEqual(map.has(one), false);
    assert.strictEqual(map.delete(one), false);
  });

  it('should preserve explicitly stored undefined values.', function() {
    var calls = 0;
    var key = {};
    var map = new DefaultWeakMap(function() {
      calls++;
      return 'created';
    });

    map.set(key, undefined);

    assert.strictEqual(map.get(key), undefined);
    assert.strictEqual(map.has(key), true);
    assert.strictEqual(calls, 0);

    assert.strictEqual(map.delete(key), true);
    assert.strictEqual(map.get(key), 'created');
    assert.strictEqual(calls, 1);
  });

  it('should cache undefined values returned by the factory.', function() {
    var calls = 0;
    var key = {};
    var map = new DefaultWeakMap(function() {
      calls++;
      return undefined;
    });

    assert.strictEqual(map.get(key), undefined);
    assert.strictEqual(map.get(key), undefined);
    assert.strictEqual(map.has(key), true);
    assert.strictEqual(calls, 1);
  });

  it('should be possible to peek.', function() {
    var map = new DefaultWeakMap(FACTORY);
    const one = {}, two = {};

    map.get(one).push(1);

    assert.deepStrictEqual(map.peek(one), [1]);
    assert.strictEqual(map.peek(two), undefined);
    assert.strictEqual(map.has(two), false);
  });
});
