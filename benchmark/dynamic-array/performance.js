var DynamicArray = require('../../dynamic-array.js');

var SIZE = 10000000;

console.time('Standard JavaScript Array (holding uint8) #push');
var array = [];

for (var i = 0; i < SIZE; i++)
  array.push(i % 255);

console.timeEnd('Standard JavaScript Array (holding uint8) #push');

console.time('DynamicUint8Array #push');
var dynamicArray = new DynamicArray(Uint8Array, {
  initialSize: 10
});

for (var i = 0; i < SIZE; i++)
  dynamicArray.push(i % 255);
console.timeEnd('DynamicUint8Array #push');

var v;

console.time('Standard JavaScript Array (holding uint8) #get');

for (var i = 0; i < SIZE; i++)
  v = array[i];

console.timeEnd('Standard JavaScript Array (holding uint8) #get');

console.time('DynamicUint8Array #get');

for (var i = 0; i < SIZE; i++)
  v = dynamicArray.get(i);

console.timeEnd('DynamicUint8Array #get');
