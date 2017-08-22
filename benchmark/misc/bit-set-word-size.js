var BitSet = require('../../bit-set.js');

// Note: it seems that changing the word size has no effect whatsoever on
// the BitSet's performances
suite('BitSet Word Size', function() {
  bench('test', function() {
    var size = 1048576 * 3;

    var set = new BitSet(size);

    for (var i = 0; i < size; i++)
      set.set(i);

    for (var i = 0; i < size; i++)
      set.get(i);
  });
});
