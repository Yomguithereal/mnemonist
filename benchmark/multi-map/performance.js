var MultiMap = require('../../multi-map.js');
var randomString = require('pandemonium/random-string');

var SIZE = 1000000;

var map = new MultiMap();

console.time('#.set');
for (var i = 0; i < SIZE; i++)
  map.set(i, randomString(i % 25));
console.timeEnd('#.set');
