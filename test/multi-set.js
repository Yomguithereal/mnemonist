/**
 * Mnemonist MultiSet Unit Tests
 * ==============================
 */
var assert = require('assert'),
    MultiSet = require('../multi-set.js'),
    MultiMap = require('../multi-map.js');

describe('MultiSet', function() {

  it('should be possible to add items.', function() {
    var set = new MultiSet();

    set.add('hello');
    set.add('hello');
    set.add('world');

    assert.strictEqual(set.size, 3);
    assert.strictEqual(set.dimension, 2);
  });

  it('should be possible to check whether an item exists in the set.', function() {
    var set = new MultiSet();

    set.add('hello');

    assert.strictEqual(set.has('hello'), true);
    assert.strictEqual(set.has('world'), false);
  });

  it('should be possible to retrieve an item\'s multiplicity.', function() {
    var set = new MultiSet();

    set.add('hello', 3);
    set.add('world');

    assert.strictEqual(set.multiplicity('hello'), 3);
    assert.strictEqual(set.multiplicity('world'), 1);
    assert.strictEqual(set.multiplicity('warum?'), 0);
  });

  it('should be possible to completely clear the set.', function() {
    var set = new MultiSet();

    set.add('hello');
    set.add('hello');
    set.add('world');

    set.clear();

    assert.strictEqual(set.size, 0);
    assert.strictEqual(set.dimension, 0);
  });

  it('should be possible to delete an item from the set.', function() {
    var set = new MultiSet();

    set.add('hello');
    set.add('hello');
    set.add('world');

    set.delete('hello');

    assert.strictEqual(set.size, 1);
    assert.strictEqual(set.dimension, 1);
    assert.strictEqual(set.multiplicity('hello'), 0);
  });

  it('should be possible to remove an arbitrary number of an item from the set.', function() {
    var set = new MultiSet();

    set.add('hello', 5);
    set.remove('hello');

    assert.strictEqual(set.size, 4);
    assert.strictEqual(set.dimension, 1);
    assert.strictEqual(set.multiplicity('hello'), 4);

    set.remove('hello', 16);

    assert.strictEqual(set.size, 0);
    assert.strictEqual(set.dimension, 0);
    assert.strictEqual(set.multiplicity('hello'), 0);
    assert.strictEqual(set.has('hello'), false);
  });

  it('should be possible to iterate over a set.', function() {
    var set = new MultiSet();

    set.add('hello', 3);

    var i = 0;

    set.forEach(function(value, key) {
      assert.strictEqual(value, 'hello');
      assert.strictEqual(key, 'hello');
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should be possible to create an iterator over a set\'s values.', function() {
    var set = new MultiSet();

    set.add('hello', 2);

    var iterator = set.values();

    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().value, 'hello');
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an iterator over a set\'s multiplicities.', function() {
    var set = new MultiSet();

    set.add('hello', 2);
    set.add('world');

    var iterator = set.multiplicities();

    assert.deepEqual(iterator.next().value, ['hello', 2]);
    assert.deepEqual(iterator.next().value, ['world', 1]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over a set using for...of.', function() {
    var set = new MultiSet();

    set.add('hello', 3);

    var i = 0;

    for (var value of set) {
      assert.strictEqual(value, 'hello');
      i++;
    }

    assert.strictEqual(i, 3);
  });

  it('should be possible to create a set from an arbitrary iterable.', function() {
    var map = new MultiMap();

    map.set('one', 'hello');
    map.set('two', 'hello');

    var set = MultiSet.from(map);

    assert.strictEqual(set.size, 2);
    assert.strictEqual(set.dimension, 1);

    assert.strictEqual(set.multiplicity('hello'), 2);
  });
});
