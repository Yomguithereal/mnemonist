var bitwise = require('../../utils/bitwise.js');

var popcount = bitwise.popcount;

var TABLE8 = new Uint8Array(Math.pow(2, 8));

var TABLE16 = new Uint16Array(Math.pow(2, 16));

for (var i = 0; i < TABLE8.length; i++)
  TABLE8[i] = popcount(i);

for (var i = 0; i < TABLE16.length; i++)
  TABLE16[i] = (i & 1) + TABLE16[i >> 1];

var tablePopcount = function(x) {
  return (
    TABLE16[x & 0xffff] +
    TABLE16[(x >> 16) & 0xffff]
  );
};

var table8Popcount = function(x) {
  return (
    TABLE8[x & 0xff] +
    TABLE8[(x >> 8) & 0xff] +
    TABLE8[(x >> 16) & 0xff] +
    TABLE8[(x >> 24) & 0xff]
  );
};

// Does not finish
var iteratedPopcount = function(x) {
  var c = 0;

  while (x) {
    c += x & 1;
    x >>= 1;
  }

  return c;
};

var sparseIteratedPopcount = function(x) {
  var c = 0;

  while (x) {
    c++;
    x &= (x - 1);
  }

  return c;
};

// NOTE: needs 64bits
var mitPopcount = function(x) {
  var tmp = x - ((x >> 1) & 033333333333) - ((x >> 2) & 011111111111);
  return ((tmp + (tmp >> 3))) & 030707070707 % 63;
};

var MASK_01010101 = Math.abs(-1 / 3) | 0,
    MASK_00110011 = Math.abs(-1 / 5) | 0,
    MASK_00001111 = Math.abs(-1 / 17) | 0;

var niftyPopcount = function(x) {
  x = (x & MASK_01010101) + ((x >> 1) & MASK_01010101);
  x = (x & MASK_00110011) + ((x >> 2) & MASK_00110011);
  x = (x & MASK_00001111) + ((x >> 4) & MASK_00001111);

  return x;
};

var tests = [
  '0',
  '1',
  '1001',
  '1101',
  '1111',
  '101001',
  '0011010',
  '10010010000111100',
  '11111100000000000',
  '10010001111101001110100100100010',
  '11111111111111111111111111111111'
].map(function(number) {
  return parseInt(number, 2);
});

var tl = tests.length;

var SIZE = 100000000;

console.time('Popcount');
for (var i = 0; i < SIZE; i++)
  popcount(tests[i % tl]);
console.timeEnd('Popcount');

console.time('Table');
for (var i = 0; i < SIZE; i++)
  tablePopcount(tests[i % tl]);
console.timeEnd('Table');

console.time('Table8');
for (var i = 0; i < SIZE; i++)
  table8Popcount(tests[i % tl]);
console.timeEnd('Table8');

console.time('MIT');
for (var i = 0; i < SIZE; i++)
  mitPopcount(tests[i % tl]);
console.timeEnd('MIT');

console.time('Nifty');
for (var i = 0; i < SIZE; i++)
  niftyPopcount(tests[i % tl]);
console.timeEnd('Nifty');
