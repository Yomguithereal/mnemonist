/**
 * Mnemonist RangeMap Unit Tests
 * ==============================
 */
var assert = require('assert'),
    RangeMap = require('../range-map.js');

describe('RangeMap', function() {

  it('should be possible to add/get keys.', function() {
    var map = new RangeMap();

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
});
