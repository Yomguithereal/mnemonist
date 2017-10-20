/**
 * Mnemonist IncrementalMap Unit Tests
 * ====================================
 */
var assert = require('assert'),
    IncrementalMap = require('../incremental-map.js');

describe('IncrementalMap', function() {

  it('should be possible to add/get keys.', function() {
    var map = new IncrementalMap();

    map.add('hello');
    map.add('world');

    map.add('hello');

    assert.strictEqual(map.size, 2);
    assert.strictEqual(map.get('hello'), 0);
    assert.strictEqual(map.get('world'), 1);
    assert.strictEqual(map.get('unknown'), undefined);

    assert.strictEqual(map.has('world'), true);
    assert.strictEqual(map.has('unknown'), false);
  });

  it('should be possible to change step/offset.', function() {
    var map = new IncrementalMap({step: 2, offset: 2});

    map.add('one');
    map.add('two');

    assert.strictEqual(map.has('one'), true);
    assert.strictEqual(map.has('three'), false);
    assert.strictEqual(map.get('one'), 2);
    assert.strictEqual(map.get('two'), 4);
  });

  it('should be possible to use iterators.', function() {
    var map = new IncrementalMap();

    map.add('one');
    map.add('two');
    map.add('three');

    assert.deepEqual(Array.from(map.keys()), ['one', 'two', 'three']);
    assert.deepEqual(Array.from(map.values()), [0, 1, 2]);
    assert.deepEqual(Array.from(map.entries()), [['one', 0], ['two', 1], ['three', 2]]);
  });
});
