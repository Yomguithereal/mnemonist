var BitSet = require('../../bit-set.js');

var set = new Set([1, 3, 5, 7, 9, 11]);

var bits = new BitSet(12);
bits.set(1);
bits.set(3);
bits.set(5);
bits.set(7);
bits.set(9);
bits.set(11);

var SIZE = 100000;

console.time('Set');
for (var i = 0; i < SIZE; i++)
  set.has(9);
console.timeEnd('Set');

console.time('BitSet');
for (var i = 0; i < SIZE; i++)
  bits.test(9);
console.timeEnd('BitSet');
