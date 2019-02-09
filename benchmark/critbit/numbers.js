var shuffleInPlace = require('pandemonium/shuffle-in-place');
var random = require('pandemonium/random');

var SIZE = 500000;
var MAX = Math.pow(2, 32) - 1;

var w, r, l = SIZE;

var words = new Set();

while (words.size < SIZE)
  words.add(random(0, MAX));

words = Array.from(words);

shuffleInPlace(words);

var CritBitTreeMap = require('../../critbit-tree-map');
var FixedCritBitTreeMap = require('../../fixed-critbit-tree-map');
var TrieMap = require('../../trie-map');
var SemiDynamicTrie = require('../../semi-dynamic-trie');

var critbit = new CritBitTreeMap();
var fixed = new FixedCritBitTreeMap(words.length);
var map = new Map();
var object = {};

/**
 * Set operations.
 */
console.group('set ops');

// console.time('Critbit Set');
// for (w = 0; w < l; w++)
//   critbit.set(words[w], w);
// console.timeEnd('Critbit Set');

// console.log('Cribit sanity check', critbit.size, l);

// console.time('Fixed Critbit Set');
// for (w = 0; w < l; w++)
//   fixed.set(words[w], w);
// console.timeEnd('Fixed Critbit Set');

// console.log('Fixed Cribit sanity check', fixed.size, l);

console.time('Map Set');
for (w = 0; w < l; w++)
  map.set(words[w], w);
console.timeEnd('Map Set');

console.time('Object Set');
for (w = 0; w < l; w++)
  object[words[w]] = w;
console.timeEnd('Object Set');

console.groupEnd('set ops');

/**
 * Get operations.
 */
shuffleInPlace(words);
console.log();
console.group('get ops');

// console.time('Critbit Get');
// for (w = 0; w < l; w++)
//   r = critbit.get(words[w]);
// console.timeEnd('Critbit Get');

// console.time('Fixed Critbit Get');
// for (w = 0; w < l; w++)
//   r = fixed.get(words[w]);
// console.timeEnd('Fixed Critbit Get');

console.time('Map Get');
for (w = 0; w < l; w++)
  r = map.get(words[w]);
console.timeEnd('Map Get');

console.time('Object Get');
for (w = 0; w < l; w++)
  r = object[words[w]];
console.timeEnd('Object Get');

console.groupEnd('get ops');

/**
 * Miss operations.
 */
console.log();
console.group('miss ops');

// console.time('Critbit Miss');
// for (w = 0; w < l; w++)
//   r = critbit.get(randomString(3, 25));
// console.timeEnd('Critbit Miss');

// console.time('Fixed Critbit Miss');
// for (w = 0; w < l; w++)
//   r = fixed.get(randomString(3, 25));
// console.timeEnd('Fixed Critbit Miss');

console.time('Map Miss');
for (w = 0; w < l; w++)
  r = map.get(random(0, MAX));
console.timeEnd('Map Miss');

console.time('Object Miss');
for (w = 0; w < l; w++)
  r = object[random(0, MAX)];
console.timeEnd('Object Miss');

console.groupEnd('miss ops');

/**
 * Delete operations.
 */
shuffleInPlace(words);
console.log();
console.group('delete ops');

// console.time('Critbit Delete');
// for (w = 0; w < l; w++)
//   critbit.delete(words[w]);
// console.timeEnd('Critbit Delete');

console.time('Map Delete');
for (w = 0; w < l; w++)
  map.delete(words[w]);
console.timeEnd('Map Delete');

console.time('Object Delete');
for (w = 0; w < l; w++)
  delete object[words[w]];
console.timeEnd('Object Delete');

console.groupEnd('delete ops');
