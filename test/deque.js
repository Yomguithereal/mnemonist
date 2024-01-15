/**
 * Mnemonist Deque Unit Tests
 * ===========================
 */
var assert = require('assert'),
    Deque = require('../deque.js');

describe('Deque', function() {

  it('should be possible to push values.', function() {
    var deque = new Deque();

    deque.push('test');

    assert.strictEqual(deque.size, 1);
  });

  it('should be possible to add values at the beginning & the end of the deque.', function() {
    var deque = new Deque();

    deque.push(2);
    deque.push(3);
    deque.unshift(1);

    assert.strictEqual(deque.size, 3);
    assert.deepStrictEqual(deque.toArray(), [1, 2, 3]);
  });

  it('should be possible to clear the deque.', function() {
    var deque = new Deque();

    deque.push(2);
    deque.push(3);

    deque.clear();

    assert.strictEqual(deque.size, 0);
    assert.deepStrictEqual(deque.toArray(), []);
  });

  it('should be possible to get the first & last items of the deque.', function() {
    var deque = new Deque();

    assert.strictEqual(deque.first(), undefined);
    assert.strictEqual(deque.last(), undefined);

    deque.push('hello');

    assert.strictEqual(deque.first(), 'hello');
    assert.strictEqual(deque.first(), deque.last());

    deque.push('world');

    assert.strictEqual(deque.first(), 'hello');
    assert.strictEqual(deque.last(), 'world');

    assert.strictEqual(deque.first(), deque.peek());
  });

  it('should be possible to shift the deque.', function() {
    var deque = new Deque();

    deque.push(1);
    deque.push(2);
    deque.push(3);

    assert.strictEqual(deque.shift(), 1);
    assert.strictEqual(deque.shift(), 2);
    assert.strictEqual(deque.shift(), 3);
    assert.strictEqual(deque.shift(), undefined);
  });

  it('should be possible to iterate over the deque.', function() {
    var deque = new Deque();

    deque.push(1);
    deque.push(2);
    deque.push(3);

    var times = 0;

    deque.forEach(function(item, i, l) {
      assert.strictEqual(item, i + 1);
      assert.strictEqual(deque, l);
      times++;
    });

    assert.strictEqual(times, 3);
  });

  it('should be possible to serialize the deque to JSON.', function() {
    var deque = new Deque();

    deque.push(2);
    deque.push(3);
    deque.unshift(1);

    assert.strictEqual(JSON.stringify(deque), '[1,2,3]');
  });

  it('should be possible to create a deque from an arbitrary iterable.', function() {
    var items = {one: 1, two: 2, three: 3};

    var deque = Deque.from(items);

    assert.strictEqual(deque.size, 3);
    assert.strictEqual(deque.last(), 3);
  });

  it('should be possible to create a values iterator.', function() {
    var deque = Deque.from([1, 2, 3]);

    var iterator = deque.values();

    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var deque = Deque.from([1, 2, 3]);

    var iterator = deque.entries();

    assert.deepStrictEqual(iterator.next().value, [0, 1]);
    assert.deepStrictEqual(iterator.next().value, [1, 2]);
    assert.deepStrictEqual(iterator.next().value, [2, 3]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the deque.', function() {
    var deque = Deque.from([1, 2, 3]),
        i = 0;

    for (var item of deque)
      assert.strictEqual(item, ++i);
  });
});
