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
});
