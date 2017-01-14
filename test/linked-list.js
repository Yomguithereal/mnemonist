/**
 * Mnemonist Linked List Unit Tests
 * =================================
 */
var assert = require('assert'),
    LinkedList = require('../linked-list.js');

describe('LinkedList', function() {

  it('should be possible to push values.', function() {
    var list = new LinkedList();

    list.push('test');

    assert.strictEqual(list.size, 1);
  });

  it('should be possible to add values at the beginning & the end of the list.', function() {
    var list = new LinkedList();

    list.push(2);
    list.push(3);
    list.unshift(1);

    assert.strictEqual(list.size, 3);
    assert.deepEqual(list.toArray(), [1, 2, 3]);
  });

  it('should be possible to clear the list.', function() {
    var list = new LinkedList();

    list.push(2);
    list.push(3);

    list.clear();

    assert.strictEqual(list.size, 0);
    assert.deepEqual(list.toArray(), []);
  });

  it('should be possible to get the first & last items of the list.', function() {
    var list = new LinkedList();

    assert.strictEqual(list.first(), undefined);
    assert.strictEqual(list.last(), undefined);

    list.push('hello');

    assert.strictEqual(list.first(), 'hello');
    assert.strictEqual(list.first(), list.last());

    list.push('world');

    assert.strictEqual(list.first(), 'hello');
    assert.strictEqual(list.last(), 'world');

    assert.strictEqual(list.first(), list.peek());
  });

  it('should be possible to shift the list.', function() {
    var list = new LinkedList();

    list.push(1);
    list.push(2);
    list.push(3);

    assert.strictEqual(list.shift(), 1);
    assert.strictEqual(list.shift(), 2);
    assert.strictEqual(list.shift(), 3);
    assert.strictEqual(list.shift(), undefined);
  });

  it('should be possible to iterate over the list.', function() {
    var list = new LinkedList();

    list.push(1);
    list.push(2);
    list.push(3);

    var times = 0;

    list.forEach(function(item, i, l) {
      assert.strictEqual(item, i + 1);
      assert.strictEqual(list, l);
      times++;
    });

    assert.strictEqual(times, 3);
  });

  it('should be possible to serialize the list to JSON.', function() {
    var list = new LinkedList();

    list.push(2);
    list.push(3);
    list.unshift(1);

    assert.strictEqual(JSON.stringify(list), '[1,2,3]');
  });

  it('should be possible to create a list from an arbitrary iterable.', function() {
    var items = {one: 1, two: 2, three: 3};

    var list = LinkedList.from(items);

    assert.strictEqual(list.size, 3);
    assert.strictEqual(list.last(), 3);
  });
});
