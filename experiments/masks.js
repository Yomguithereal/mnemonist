var bitwise = require('../utils/bitwise.js');
var random = require('pandemonium/random');

var MAX = Math.pow(2, 31) - 1;

var b = x => ('0'.repeat(32) + x.toString(2)).slice(-32);

// NOTE: issue lies when 1 bit is the critical one
var A = random(0, MAX);
var B = random(0, MAX);
var M = bitwise.msb32(A ^ B);

console.log('A', b(A), A);
console.log('B', b(B), B);
console.log('M', b(M), M);
console.log('a', b(A & M), A & M);
console.log('b', b(B & M), B & M);
