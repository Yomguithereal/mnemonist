/**
 * Mnemonist MultiSet Unit Tests
 * ==============================
 */
var assert = require('assert'),
    MultiSet = require('../multiset.js');

describe('MultiSet', function() {

  it('should be possible to add items to a set.', function() {
    var set = new MultiSet();

    assert.strictEqual(set.distinctSize, 0);
    assert.strictEqual(set.size, 0);

    set.add('hello');

    assert.strictEqual(set.distinctSize, 1);
    assert.strictEqual(set.size, 1);

    set.add('hello', 4);

    assert.strictEqual(set.distinctSize, 1);
    assert.strictEqual(set.size, 5);
  });

  it('should be possible to count an item in the set.', function() {
    var set = new MultiSet();

    set.add('hello', 4);

    assert.strictEqual(set.count('hello'), 4);
    assert.strictEqual(set.count('world'), 0);
  });

  it('should be possible to check whether an item is in the set.', function() {
    var set = new MultiSet();

    set.add('hello');

    assert.strictEqual(set.has('hello'), true);
    assert.strictEqual(set.has('world'), false);
  });

  it('should be possible to set the count of an item in the set.', function() {
    var set = new MultiSet();

    set.add('hello');
    set.set('hello', 4);

    set.set('world', 2);

    assert.strictEqual(set.distinctSize, 2);
    assert.strictEqual(set.size, 6);
    assert.strictEqual(set.count('hello'), 4);
    assert.strictEqual(set.count('world'), 2);

    set.set('hello', 2);

    assert.strictEqual(set.size, 4);
    assert.strictEqual(set.count('hello'), 2);
  });

  it('should be possible to completely delete items.', function() {
    var set = new MultiSet();

    set.add('hello');
    set.add('hello');

    assert.strictEqual(set.distinctSize, 1);
    assert.strictEqual(set.size, 2);
    assert.strictEqual(set.count('hello'), 2);

    set.delete('hello');

    assert.strictEqual(set.has('hello'), false);
    assert.strictEqual(set.count('hello'), 0);
    assert.strictEqual(set.distinctSize, 0);
    assert.strictEqual(set.size, 0);
  });

  it('should be possible to remove items.', function() {
    var set = new MultiSet();

    set.add('hello', 4);

    set.remove('hello');
    assert.strictEqual(set.count('hello'), 3);

    set.remove('hello', 2);
    assert.strictEqual(set.count('hello'), 1);

    set.remove('hello', 4);
    assert.strictEqual(set.distinctSize, 0);
    assert.strictEqual(set.size, 0);
    assert.strictEqual(set.has('hello'), false);
  });
});
