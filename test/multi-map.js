/**
 * Mnemonist MultiMap Unit Tests
 * ==============================
 */
var assert = require('assert'),
    MultiMap = require('../multi-map.js'),
    Vector = require('../vector.js');

describe('MultiMap', function() {

  it('should be possible to set keys.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.dimension, 1);
  });

  it('should be possible to test the existence of a key in the map.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');

    assert.strictEqual(map.has('one'), true);
    assert.strictEqual(map.has('two'), false);
  });

  it('should be possible to get the multiplicity of a key in the map.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'test');

    assert.strictEqual(map.multiplicity('three'), 0);
    assert.strictEqual(map.multiplicity('one'), 2);
    assert.strictEqual(map.multiplicity('two'), 1);

    map = new MultiMap(Set);

    map.set('one', 'hello');
    map.set('one', 'hello');
    map.set('two', 'test');

    assert.strictEqual(map.multiplicity('three'), 0);
    assert.strictEqual(map.multiplicity('one'), 1);
    assert.strictEqual(map.multiplicity('two'), 1);
  });

  it('should be possible to remove values.', function() {
    var map = new MultiMap();

    map.set('one', 1);
    map.set('one', 2);
    map.set('one', 1);

    map.remove('one', 1);

    assert.deepStrictEqual(map.get('one'), [2, 1]);
    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.dimension, 1);

    map.remove('one', 1);

    assert.deepStrictEqual(map.get('one'), [2]);
    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.dimension, 1);

    map.remove('one', 1);

    assert.deepStrictEqual(map.get('one'), [2]);
    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.dimension, 1);

    map.remove('one', 2);

    assert.strictEqual(map.get('one'), undefined);
    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.dimension, 0);

    map = new MultiMap(Set);

    map.set('one', 1);
    map.set('one', 2);
    map.set('one', 1);

    map.remove('one', 1);

    assert.deepStrictEqual(Array.from(map.get('one')), [2]);
    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.dimension, 1);

    map.remove('one', 2);

    assert.strictEqual(map.get('one'), undefined);
    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.dimension, 0);
  });

  it('should be possible to delete keys.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    map.delete('one');

    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.dimension, 1);
    assert.strictEqual(map.has('one'), false);
  });

  it('should be possible to clear the map.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');

    map.clear();

    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.dimension, 0);
    assert.strictEqual(map.has('one'), false);
  });

  it('should be possible to get items in the map.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');

    assert.deepStrictEqual(map.get('one'), [
      'hello',
      'world'
    ]);

    map = new MultiMap(Set);

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('one', 'hello');

    assert.strictEqual(map.size, 2);

    assert.strictEqual(map.get('one') instanceof Set, true);
    assert.deepStrictEqual(Array.from(map.get('one')), [
      'hello',
      'world'
    ]);
  });

  it('should be possible to iterate over the map.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    var i = 0;

    map.forEach(function(value, key) {
      assert.strictEqual(key, i < 2 ? 'one' : 'two');
      assert.strictEqual(value, i === 1 ? 'world' : 'hello');
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should be possible to iterate over the map\'s associations.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    var entries = [];

    map.forEachAssociation(function(container, key) {
      entries.push([key, container]);
    });

    assert.deepStrictEqual(entries, [
      ['one', ['hello', 'world']],
      ['two', ['hello']]
    ]);
  });

  it('should be possible to create an iterator over the map\'s keys.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    var iterator = map.keys();

    assert.strictEqual(iterator.next().value, 'one');
    assert.strictEqual(iterator.next().value, 'two');

    assert.deepStrictEqual([...map.keys()], ['one', 'two']);
  });

  it('should be possible to create an iterator over the map\'s values.', function() {
    var map = new MultiMap(Set);

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');
    map.set('two', 'hello');

    var iterator = map.values();

    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().value, 'world');
    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual([...map.values()], ['hello', 'world', 'hello']);

    map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    iterator = map.values();

    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().value, 'world');
    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual([...map.values()], ['hello', 'world', 'hello']);
  });

  it('should be possible to create an iterator over the map\'s entries.', function() {
    var map = new MultiMap(Set);

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');
    map.set('two', 'hello');

    var iterator = map.entries();

    assert.deepStrictEqual(iterator.next().value, ['one', 'hello']);
    assert.deepStrictEqual(iterator.next().value, ['one', 'world']);
    assert.deepStrictEqual(iterator.next().value, ['two', 'hello']);
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual([...map.entries()], [['one', 'hello'], ['one', 'world'], ['two', 'hello']]);

    map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    iterator = map.entries();

    assert.deepStrictEqual(iterator.next().value, ['one', 'hello']);
    assert.deepStrictEqual(iterator.next().value, ['one', 'world']);
    assert.deepStrictEqual(iterator.next().value, ['two', 'hello']);
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual([...map.entries()], [['one', 'hello'], ['one', 'world'], ['two', 'hello']]);
  });

  it('should be possible to create an iterator over the map\'s containers.', function() {
    var map = new MultiMap(Set);

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');
    map.set('two', 'hello');

    var iterator = map.containers();

    assert.deepStrictEqual(iterator.next().value, new Set(['hello', 'world']));
    assert.deepStrictEqual(iterator.next().value, new Set(['hello']));
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual([...map.containers()], [new Set(['hello', 'world']), new Set(['hello'])]);

    map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    iterator = map.containers();

    assert.deepStrictEqual(iterator.next().value, ['hello', 'world']);
    assert.deepStrictEqual(iterator.next().value, ['hello']);
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual([...map.containers()], [['hello', 'world'], ['hello']]);
  });

  it('should be possible to create an iterator over the map\'s associations.', function() {
    var map = new MultiMap(Set);

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');
    map.set('two', 'hello');

    var iterator = map.associations();

    assert.deepStrictEqual(iterator.next().value, ['one', new Set(['hello', 'world'])]);
    assert.deepStrictEqual(iterator.next().value, ['two', new Set(['hello'])]);
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual(
      [...map.associations()],
      [['one', new Set(['hello', 'world'])], ['two', new Set(['hello'])]]
    );

    map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    iterator = map.associations();

    assert.deepStrictEqual(iterator.next().value, ['one', ['hello', 'world']]);
    assert.deepStrictEqual(iterator.next().value, ['two', ['hello']]);
    assert.strictEqual(iterator.next().done, true);

    assert.deepStrictEqual(
      [...map.associations()],
      [['one', ['hello', 'world']], ['two', ['hello']]]
    );
  });

  it('should be possible to iterate over the map using for...of.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('one', 'world');
    map.set('two', 'hello');

    var i = 0;

    for (var entry of map) {
      assert.strictEqual(entry[0], i < 2 ? 'one' : 'two');
      assert.strictEqual(entry[1], i === 1 ? 'world' : 'hello');
      i++;
    }

    assert.strictEqual(i, 3);

    assert.deepStrictEqual([...map], [['one', 'hello'], ['one', 'world'], ['two', 'hello']]);
  });

  it('should be possible to create a map from an arbitrary iterable.', function() {
    var map = MultiMap.from(new Map([['one', 'hello'], ['two', 'world']]));

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.dimension, 2);
    assert.deepStrictEqual(map.get('one'), ['hello']);
  });

  it('should work with vectors.', function() {
    var map = new MultiMap(Vector.Uint8Vector);

    map.set('one', 45);
    map.set('two', 32);
    map.set('one', 9);

    assert.strictEqual(map.size, 3);
    assert.strictEqual(map.dimension, 2);
    assert.deepStrictEqual(Array.from(map.get('one')), [45, 9]);
  });
});
