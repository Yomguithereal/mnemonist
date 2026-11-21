var assert = require('assert'),
    BitSet = require('../bit-set.js'),
    BitVector = require('../bit-vector.js');

[BitSet, BitVector].forEach(function(Constructor) {
  describe(Constructor.name + ' select boundaries', function() {
    [[40], [31, 64], [0, 64, 95]].forEach(function(positions) {
      it('should include empty words in positions for ' + positions.join(','), function() {
        var bits = new Constructor(100);
        positions.forEach(function(position) { bits.set(position); });
        positions.forEach(function(position, i) {
          assert.strictEqual(bits.select(i + 1), position);
          assert.strictEqual(bits.rank(position + 1), i + 1);
        });
      });
    });

    [1, 32, 33, 64].forEach(function(length) {
      it('should select the last bit in a full set of length ' + length, function() {
        var bits = new Constructor(length);
        for (var i = 0; i < length; i++)
          bits.set(i);
        assert.strictEqual(bits.select(length), length - 1);
      });
    });

    it('should return -1 when there is no requested set bit.', function() {
      var bits = new Constructor(100);
      assert.strictEqual(bits.select(1), -1);
      bits.set(40);
      [0, -1, 2, 100].forEach(function(rank) {
        assert.strictEqual(bits.select(rank), -1);
      });
    });
  });
});
