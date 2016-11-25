/**
 * Mnemonist Bag Unit Tests
 * =========================
 */
var assert = require('assert'),
    Bag = require('../bag.js');

describe('Bag', function() {

  it('should be possible to add items to a bag.', function() {
    var bag = new Bag();

    assert.strictEqual(bag.size, 0);
    assert.strictEqual(bag.sum, 0);

    bag.add('hello');

    assert.strictEqual(bag.size, 1);
    assert.strictEqual(bag.sum, 1);

    bag.add('hello', 4);

    assert.strictEqual(bag.size, 1);
    assert.strictEqual(bag.sum, 5);
  });

  it('should be possible to count an item in the bag.', function() {
    var bag = new Bag();

    bag.add('hello', 4);

    assert.strictEqual(bag.count('hello'), 4);
    assert.strictEqual(bag.count('world'), 0);
  });

  it('should be possible to check whether an item is in the bag.', function() {
    var bag = new Bag();

    bag.add('hello');

    assert.strictEqual(bag.has('hello'), true);
    assert.strictEqual(bag.has('world'), false);
  });

  it('should be possible to set the count of an item in the bag.', function() {
    var bag = new Bag();

    bag.add('hello');
    bag.set('hello', 4);

    bag.set('world', 2);

    assert.strictEqual(bag.size, 2);
    assert.strictEqual(bag.sum, 6);
    assert.strictEqual(bag.count('hello'), 4);
    assert.strictEqual(bag.count('world'), 2);

    bag.set('hello', 2);

    assert.strictEqual(bag.sum, 4);
    assert.strictEqual(bag.count('hello'), 2);
  });

  it('should be possible to completely delete items.', function() {
    var bag = new Bag();

    bag.add('hello');
    bag.add('hello');

    assert.strictEqual(bag.size, 1);
    assert.strictEqual(bag.sum, 2);
    assert.strictEqual(bag.count('hello'), 2);

    bag.delete('hello');

    assert.strictEqual(bag.has('hello'), false);
    assert.strictEqual(bag.count('hello'), 0);
    assert.strictEqual(bag.size, 0);
    assert.strictEqual(bag.sum, 0);
  });

  it('should be possible to remove items.', function() {
    var bag = new Bag();

    bag.add('hello', 4);

    bag.remove('hello');
    assert.strictEqual(bag.count('hello'), 3);

    bag.remove('hello', 2);
    assert.strictEqual(bag.count('hello'), 1);

    bag.remove('hello', 4);
    assert.strictEqual(bag.size, 0);
    assert.strictEqual(bag.sum, 0);
    assert.strictEqual(bag.has('hello'), false);
  });
});
