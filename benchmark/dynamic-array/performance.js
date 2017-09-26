var DynamicArray = require('../../dynamic-array.js');
var HashedArrayTree = require('../../hashed-array-tree.js');

var SIZE = 20000000;

console.time('Standard JavaScript Array (holding uint8) #push');
var array = [];

for (var i = 0; i < SIZE; i++)
  array.push(i % 256);

console.timeEnd('Standard JavaScript Array (holding uint8) #push');

console.time('DynamicUint8Array #push');
var dynamicArray = new DynamicArray(Uint8Array, {
  initialSize: 10
});

for (var i = 0; i < SIZE; i++)
  dynamicArray.push(i % 256);
console.timeEnd('DynamicUint8Array #push');

console.time('HashedArrayTree uint8 #push');
var hashedArrayTree = new HashedArrayTree(Uint8Array);

for (var i = 0; i < SIZE; i++)
  hashedArrayTree.push(i % 256);
console.timeEnd('HashedArrayTree uint8 #push');

console.log();

console.time('Standard JavaScript Array (holding uint8) #set');
for (var i = 0; i < SIZE; i++)
  array[i] = i % 256;
console.timeEnd('Standard JavaScript Array (holding uint8) #set');

console.time('DynamicUint8Array #set');
for (var i = 0; i < SIZE; i++)
  dynamicArray.set(i, i % 256);
console.timeEnd('DynamicUint8Array #set');

console.time('HashedArrayTree uint8 #set');
for (var i = 0; i < SIZE; i++)
  hashedArrayTree.set(i, i % 256);
console.timeEnd('HashedArrayTree uint8 #set');

console.log();
var v;

console.time('Standard JavaScript Array (holding uint8) #get');
for (var i = 0; i < SIZE; i++)
  v = array[i];
console.timeEnd('Standard JavaScript Array (holding uint8) #get');

console.time('DynamicUint8Array #get');
for (var i = 0; i < SIZE; i++)
  v = dynamicArray.get(i);
console.timeEnd('DynamicUint8Array #get');

console.time('HashedArrayTree uint8 #get');
for (var i = 0; i < SIZE; i++)
  v = hashedArrayTree.get(i);
console.timeEnd('HashedArrayTree uint8 #get');

console.log();

console.time('Standard JavaScript Array (holding uint8) #pop');
for (var i = 0; i < SIZE; i++)
  v = array.pop();
console.timeEnd('Standard JavaScript Array (holding uint8) #pop');

console.time('DynamicUint8Array #pop');
for (var i = 0; i < SIZE; i++)
  v = dynamicArray.pop();
console.timeEnd('DynamicUint8Array #pop');

console.time('HashedArrayTree uint8 #pop');
for (var i = 0; i < SIZE; i++)
  v = hashedArrayTree.pop();
console.timeEnd('HashedArrayTree uint8 #pop');
