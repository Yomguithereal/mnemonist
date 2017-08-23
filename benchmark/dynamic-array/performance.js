var DynamicArray = require('../../dynamic-array.js');

var SIZE = 10000000;

console.time('Standard JavaScript Array (holding uint8)');
var array = [];

for (var i = 0; i < SIZE; i++)
  array.push(i % 255);

console.timeEnd('Standard JavaScript Array (holding uint8)');

console.time('DynamicUint8Array');
var dynamicArray = new DynamicArray(Uint8Array, {
  initialSize: 10
});

for (var i = 0; i < SIZE; i++)
  dynamicArray.push(i % 255);
console.timeEnd('DynamicUint8Array');
