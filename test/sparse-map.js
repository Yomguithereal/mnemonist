/**
 * Mnemonist SparseMap Unit Tests
 * ===============================
 */
var assert = require('assert'),
    SparseMap = require('../sparse-map.js'),
    obliterator = require('obliterator');

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
    assert.strictEqual(map.has(12), false);

    assert.strictEqual(map.get(3), 35);
    assert.strictEqual(map.get(4), 22);
    assert.strictEqual(map.get(12), undefined);
  });

  it('should be possible to use a value array constructor.', function() {
    var map = new SparseMap(Uint8Array, 10);

    map.set(3, 14);
    map.set(4, 22);
    map.set(3, 35);

    assert.strictEqual(map.has(3), true);
    assert.strictEqual(map.has(1), false);
    assert.strictEqual(map.has(12), false);

    assert.strictEqual(map.get(3), 35);
    assert.strictEqual(map.get(4), 22);
    assert.strictEqual(map.get(12), undefined);
  });

  it('should be possible to delete items from the map.', function() {
    var map = new SparseMap(10);

    map.set(3, 14);
    map.delete(3);
    map.delete(4);

    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.has(3), false);
    assert.strictEqual(map.has(4), false);

    assert.strictEqual(map.get(3), undefined);
    assert.strictEqual(map.get(4), undefined);

    map.set(2, 35);

    assert.strictEqual(map.size, 1);
    assert.strictEqual(map.get(2), 35);

    map.set(3, 28);

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.get(3), 28);
  });

  [Array, Uint8Array, Float64Array].forEach(function(Values) {
    it('should preserve values when compacting ' + Values.name + ' storage.', function() {
      var map = new SparseMap(Values, 10);

      map.set(1, 11).set(2, 22).set(3, 33).set(4, 44);

      assert.strictEqual(map.delete(2), true);
      assert.deepStrictEqual(Array.from(map.entries()), [[1, 11], [4, 44], [3, 33]]);
      assert.deepStrictEqual(Array.from(map.values()), [11, 44, 33]);
      assert.strictEqual(map.get(4), 44);

      assert.strictEqual(map.delete(1), true);
      assert.deepStrictEqual(Array.from(map.entries()), [[3, 33], [4, 44]]);

      map.set(3, 35).set(2, 25);
      assert.strictEqual(map.delete(2), true);
      assert.strictEqual(map.delete(2), false);
      assert.deepStrictEqual(Array.from(map.entries()), [[3, 35], [4, 44]]);

      var entries = [];

      map.forEach(function(value, key) {
        entries.push([key, value]);
      });

      assert.deepStrictEqual(entries, [[3, 35], [4, 44]]);
    });

    it('should match Map through mixed operations with ' + Values.name + ' storage.', function() {
      var map = new SparseMap(Values, 32),
          reference = new Map(),
          seed = 17;

      for (var i = 0; i < 1000; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;

        var key = (seed >>> 8) % 32,
            value = (seed >>> 16) % 256;

        if (i % 97 === 0) {
          map.clear();
          reference.clear();
        }
        else if (seed % 3 === 0) {
          assert.strictEqual(map.delete(key), reference.delete(key));
        }
        else {
          map.set(key, value);
          reference.set(key, value);
        }

        assert.strictEqual(map.size, reference.size);
        assert.deepStrictEqual(new Map(map), reference);

        for (var j = 0; j < 32; j++) {
          assert.strictEqual(map.has(j), reference.has(j));
          assert.strictEqual(map.get(j), reference.get(j));
        }
      }
    });
  });

  it('should preserve object values when deleting another member.', function() {
    var map = new SparseMap(10),
        first = {},
        last = {};

    map.set(1, first).set(2, last);
    assert.strictEqual(map.delete(1), true);
    assert.strictEqual(map.get(2), last);
  });

  it('should be possible to clear the map.', function() {
    var map = new SparseMap(10);

    for (var i = 0; i < 6; i++)
      map.set(i, i + 1);

    assert.strictEqual(map.size, 6);
    assert.strictEqual(map.get(3), 4);

    map.clear();

    assert.strictEqual(map.size, 0);
    assert.strictEqual(map.has(3), false);
    assert.strictEqual(map.get(3), undefined);
  });

  it('should be possible to iterate over the map\'s items.', function() {
    var map = new SparseMap(10);

    map.set(3, 13);
    map.set(6, 22);
    map.set(9, 8);

    var array = [[3, 13], [6, 22], [9, 8]],
        i = 0;

    map.forEach(function(value, key) {
      assert.deepStrictEqual([key, value], array[i++]);
    });
  });

  it('should be possible to create an iterator over the map\'s keys.', function() {
    var map = new SparseMap(10);

    map.set(3, 13);
    map.set(6, 22);
    map.set(9, 8);

    assert.deepStrictEqual(obliterator.take(map.keys()), [3, 6, 9]);
  });

  it('should be possible to create an iterator over the map\'s values.', function() {
    var map = new SparseMap(10);

    map.set(3, 13);
    map.set(6, 22);
    map.set(9, 8);

    assert.deepStrictEqual(obliterator.take(map.values()), [13, 22, 8]);
  });

  it('should be possible to create an iterator over the map\'s entries.', function() {
    var map = new SparseMap(10);

    map.set(3, 13);
    map.set(6, 22);
    map.set(9, 8);

    assert.deepStrictEqual(obliterator.take(map.entries()), [[3, 13], [6, 22], [9, 8]]);
  });
});
