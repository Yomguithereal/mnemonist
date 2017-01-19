/* eslint no-new: 0 */
/**
 * Mnemonist Bloom Filter Unit Tests
 * ==================================
 */
var assert = require('assert'),
    BloomFilter = require('../bloom-filter.js');

describe('BloomFilter', function() {

  it('should throw when given options are invalid.', function() {

    assert.throws(function() {
      new BloomFilter(-34);
    }, /capacity/);

    assert.throws(function() {
      new BloomFilter({capacity: -34});
    }, /capacity/);

    assert.throws(function() {
      new BloomFilter();
    }, /created/);

    assert.throws(function() {
      new BloomFilter({capacity: 3, errorRate: -45});
    }, /errorRate/);
  });

  it('should compute the correct settings.', function() {
    var filter = new BloomFilter(3);

    assert.strictEqual(filter.data.length, 4);
    assert.strictEqual(filter.hashFunctions, 7);
  });

  it('should be possible to add items to the filter.', function() {
    var filter = new BloomFilter(3);

    filter.add('hello');

    assert.deepEqual(filter.data, [128, 0, 86, 65]);

    filter.add('world');

    assert.deepEqual(filter.data, [131, 130, 94, 89]);

    filter.add('longer string');

    assert.deepEqual(filter.data, [167, 130, 95, 121]);
  });

  it('should be possible to insert more items.', function() {
    var filter = new BloomFilter(50);

    for (var i = 0; i < filter.capacity; i++)
      filter.add(i % 2 ? ('hello' + i) : ('world' + i));

    assert.deepEqual(filter.data, [168, 120, 121, 113, 105, 114, 37, 230, 138, 115, 203, 112, 167, 31, 235, 139, 90, 200, 77, 118, 194, 243, 25, 93, 128, 18, 115, 178, 23, 200, 73, 134, 160, 117, 57, 192, 116, 205, 164, 241, 63, 169, 140, 184, 195, 92, 45, 15, 33, 254, 79, 217, 147, 240, 50, 100, 251, 96, 216, 34, 104, 35, 6, 17, 179, 77, 146, 178]);
  });

  it('should be possible to test items.', function() {
    var filter = new BloomFilter(3);

    filter.add('hello');

    assert.strictEqual(filter.test('hello'), true);
    assert.strictEqual(filter.test('world'), false);
  });

  it('should be possible to create a filter from an arbitrary iterable.', function() {
    var set = new Set(['hello', 'world']);

    assert.throws(function() {
      BloomFilter.from(set.values());
    }, /capacity/);

    var filter = BloomFilter.from(set);

    assert.strictEqual(filter.capacity, 2);
    assert.strictEqual(filter.test('world'), true);

    filter = BloomFilter.from(set.values(), 2);

    assert.strictEqual(filter.capacity, 2);
    assert.strictEqual(filter.test('world'), true);
  });
});
