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

  it('should be possible to serialize the list to JSON.', function() {
    var list = new LinkedList();

    list.push(2);
    list.push(3);
    list.unshift(1);

    assert.strictEqual(JSON.stringify(list), '[1,2,3]');
  });
});
