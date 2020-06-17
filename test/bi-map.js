/**
 * Mnemonist BiMap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    BiMap = require('../bi-map.js');

describe('BiMap', function() {

  it('should be possible to set keys.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.inverse.size, 2);
  });

  it('should handle constraints.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    // key is already set
    map.set('two', 'monde');

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.inverse.size, 2);

    // value is already set
    map.set('three', 'monde');

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.inverse.size, 2);


    // key & value are already set
    map = new BiMap();
    map.set('A', 'B');
    map.set('C', 'D');

    map.set('A', 'D');

    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.inverse.size, 1);
  });

  it('should be possible to test the existence of a key in the map.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    assert.strictEqual(map.has('one'), true);
    assert.strictEqual(map.has('three'), false);
  });

  it('should be possible to delete keys.', function() {
    var map = new BiMap();

    map.set('one', 'hello');

    map.delete('one');

    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.has('one'), false);
    assert.strictEqual(map.inverse.has('hello'), false);
  });

  it('should be possible to clear the map.', function() {
    var map = new BiMap();

    map.set('one', 'hello');

    map.clear();

    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.has('one'), false);
  });

  it('should be possible to get items in the map.', function() {
    var map = new BiMap();

    map.set('one', 'hello');

    assert.strictEqual(map.get('one'), 'hello');
    assert.strictEqual(map.inverse.get('hello'), 'one');
  });

  it('should be possible to iterate over the map.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    var i = 0;

    map.forEach(function(value, key) {
      assert.strictEqual(key, !i ? 'one' : 'two');
      assert.strictEqual(value, !i ? 'hello' : 'world');
      i++;
    });

    assert.strictEqual(i, 2);
  });

  it('should be possible to create an iterator over the map\'s keys.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    var iterator = map.keys();

    assert.strictEqual(iterator.next().value, 'one');
    assert.strictEqual(iterator.next().value, 'two');
    assert.strictEqual(iterator.next().done, true);

    iterator = map.inverse.keys();

    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().value, 'world');
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an iterator over the map\'s values.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    var iterator = map.values();

    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().value, 'world');
    assert.strictEqual(iterator.next().done, true);

    iterator = map.inverse.values();

    assert.strictEqual(iterator.next().value, 'one');
    assert.strictEqual(iterator.next().value, 'two');
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an iterator over the map\'s entries.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    var iterator = map.entries();

    assert.deepEqual(iterator.next().value, ['one', 'hello']);
    assert.deepEqual(iterator.next().value, ['two', 'world']);
    assert.deepEqual(iterator.next().done, true);

    iterator = map.inverse.entries();

    assert.deepEqual(iterator.next().value, ['hello', 'one']);
    assert.deepEqual(iterator.next().value, ['world', 'two']);
    assert.deepEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the map using for...of.', function() {
    var map = new BiMap();

    map.set('one', 'hello');
    map.set('two', 'world');

    var i = 0;

    for (var entry of map) {
      assert.strictEqual(entry[0], !i ? 'one' : 'two');
      assert.strictEqual(entry[1], !i ? 'hello' : 'world');
      i++;
    }

    assert.strictEqual(i, 2);
  });

  it('should be possible to create a map from an arbitrary iterable.', function() {
    var map = BiMap.from(new Map([['one', 'hello'], ['two', 'world']]));

    assert.strictEqual(map.size, 2);
    assert.deepEqual(map.get('one'), 'hello');
  });
});
