var MultiArray = require('../../multi-array.js');
var seedrandom = require('seedrandom');
var createRandom = require('pandemonium/random').createRandom;

var DIMENSION = 50000;
var SIZE = 1000000;

var array = [];
var multiArray = new MultiArray();
var staticMultiArray = new MultiArray(Uint8Array, SIZE);

var i, c, v, r;

var random = createRandom(seedrandom('bench'));

console.time('Array build');
for (i = 0; i < SIZE; i++) {
  c = random(0, DIMENSION);
  v = i % 256;
  if (typeof array[c] === 'undefined')
    array[c] = [];
  array[c].push(v);
}
console.timeEnd('Array build');

random = createRandom(seedrandom('bench'));

console.time('MultiArray build');
for (i = 0; i < SIZE; i++) {
  c = random(0, DIMENSION);
  v = i % 256;
  multiArray.set()
}
console.timeEnd('MultiArray build');
