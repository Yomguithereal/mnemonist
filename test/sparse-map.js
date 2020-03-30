/**
 * Mnemonist SparseMap Unit Tests
 * ===============================
 */
var assert = require('assert'),
    SparseMap = require('../sparse-map.js');
    // obliterator = require('obliterator');

describe('SparseMap', function() {

  it('should be possible to set members in the map.', function() {
    var map = new SparseMap(10);

    map.set(3, 14);
    map.set(4, 22);
    map.set(3, 35);

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.length, 10);
  });

  it('should be possible to get the value associated to members in the map.', function() {
    var map = new SparseMap(10);

    map.set(3, 14);
    map.set(4, 22);
    map.set(3, 35);

    assert.strictEqual(map.has(3), true);
    assert.strictEqual(map.has(1), false);

    assert.strictEqual(map.get(3), 35);
    assert.strictEqual(map.get(4), 22);
  });

  it('should be possible to use a value array constructor.', function() {
    var map = new SparseMap(Uint8Array, 10);

    map.set(3, 14);
    map.set(4, 22);
    map.set(3, 35);

    assert.strictEqual(map.has(3), true);
    assert.strictEqual(map.has(1), false);

    assert.strictEqual(map.get(3), 35);
    assert.strictEqual(map.get(4), 22);
  });

  // it('should be possible to delete items from the map.', function() {
  //   var map = new SparseMap(10);

  //   map.add(3);
  //   map.delete(3);
  //   map.delete(4);

  //   assert.strictEqual(map.size, 0);
  // });

  // it('should be possible to clear the map.', function() {
  //   var map = new SparseMap(10);

  //   for (var i = 0; i < 6; i++)
  //     map.add(i);

  //   map.clear();

  //   assert.strictEqual(map.size, 0);
  //   assert.strictEqual(map.has(1), false);
  // });

  // it('should be possible to iterate over the map\'s items.', function() {
  //   var map = new SparseMap(10);

  //   map.add(3);
  //   map.add(6);
  //   map.add(9);

  //   var array = [3, 6, 9],
  //       i = 0;

  //   map.forEach(function(number) {
  //     assert.strictEqual(number, array[i++]);
  //   });
  // });

  // it('should be possible to create an iterator over the map\'s values.', function() {
  //   var map = new SparseMap(10);

  //   map.add(3);
  //   map.add(6);
  //   map.add(9);

  //   assert.deepEqual(obliterator.take(map.values()), [3, 6, 9]);
  // });
});
