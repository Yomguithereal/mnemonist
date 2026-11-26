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
    assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  });

  it('should be possible to clear the list.', function() {
    var list = new LinkedList();

    list.push(2);
    list.push(3);

    list.clear();

    assert.strictEqual(list.size, 0);
    assert.deepStrictEqual(list.toArray(), []);
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

  it('should be possible to find the first node that contains a specified value', function() {
    var list = new LinkedList();

    list.push(1);
    list.push(2);
    list.push(3);
    list.push(2);

    assert.strictEqual(list.find(1).item, list.first());
    assert.strictEqual(list.find(2).next, list.find(3));
    assert.strictEqual(list.find(5), undefined);
  });

  it('should be possible to find the last node that contains a specified value', function () {
    var list = new LinkedList();

    list.push(1);
    list.push(2);
    list.push(3);
    list.push(2);

    assert.strictEqual(list.findLast(1).item, list.first());
    assert.strictEqual(list.findLast(2).item, list.last());
    assert.strictEqual(list.findLast(2).next, null);
    assert.strictEqual(list.findLast(5), undefined);
  });

  it('should be possible to add an item after a specified item', function() {
    var list = new LinkedList();

    list.push(1);
    list.push(2);
    list.push(3);

    assert.strictEqual(list.addAfter(3, 4), 4);
    assert.strictEqual(list.addAfter(2, 10), 5);
    assert.strictEqual(list.find(2).next, list.find(10));
    assert.strictEqual(list.find(3).next, list.find(4));
    assert.strictEqual(list.last(), 4);
  });

  it('should be possible to add an item before a specified item', function() {
    var list = new LinkedList();

    list.push(1);
    list.push(2);
    list.push(3);

    assert.strictEqual(list.addBefore(3, 4), 4);
    assert.strictEqual(list.addBefore(4, 5), 5);
    assert.strictEqual(list.addBefore(1, 6), 6);
    assert.strictEqual(list.addBefore(10, 5), 6);
    assert.strictEqual(list.first(), 6);
    assert.strictEqual(list.find(2).next, list.find(5));
    assert.strictEqual(list.find(5).next, list.find(4));
    assert.strictEqual(list.last(), 3);
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

  it('should be possible to create a values iterator.', function() {
    var list = LinkedList.from([1, 2, 3]);

    var iterator = list.values();

    assert.strictEqual(iterator.next().value, 1);
    assert.strictEqual(iterator.next().value, 2);
    assert.strictEqual(iterator.next().value, 3);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to create an entries iterator.', function() {
    var list = LinkedList.from([1, 2, 3]);

    var iterator = list.entries();

    assert.deepStrictEqual(iterator.next().value, [0, 1]);
    assert.deepStrictEqual(iterator.next().value, [1, 2]);
    assert.deepStrictEqual(iterator.next().value, [2, 3]);
    assert.strictEqual(iterator.next().done, true);
  });

  it('should be possible to iterate over the list.', function() {
    var list = LinkedList.from([1, 2, 3]),
        i = 0;

    for (var item of list)
      assert.strictEqual(item, ++i);
  });
});
