var DynamicArray = require('../../dynamic-array.js');

var SIZE = 10000000;

console.time('Array');
var array = [];

for (var i = 0; i < SIZE; i++)
  array.push(i % 255);

console.timeEnd('Array');

console.time('DynamicArray');
var dynamicArray = new DynamicArray(Uint8Array, {
  initialSize: 10
});

for (var i = 0; i < SIZE; i++)
  dynamicArray.push(i % 255);
console.timeEnd('DynamicArray');
