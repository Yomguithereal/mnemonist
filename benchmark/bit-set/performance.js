var BitSet = require('../../bit-set.js');

console.time('Bits');
var bits = new BitSet(100000000);

for (var i = 0, l = bits.length; i < l; i++)
  bits.set(i);

for (var i = 0, l = bits.length; i < l; i++)
  bits.get(i);

for (var i = 0, l = bits.length; i < l; i++)
  bits.reset(i);

for (var i = 0, l = bits.length; i < l; i++)
  bits.flip(i);
console.timeEnd('Bits');

