var StaticIntervalTree = require('../../static-interval-tree');
var createRandom = require('pandemonium/random').createRandom;
var seedrandom = require('seedrandom');

var random = createRandom(seedrandom('test'));

var SIZE = 5000000;
var MAX = 5000;
var INTERVALS = new Array(SIZE);

var s, e, r, i, p;

for (i = 0; i < SIZE; i++) {
  s = random(0, MAX - 2);
  e = random(s + 1, MAX);

  INTERVALS[i] = [s, e];
}

console.log('Intervals:', SIZE);

console.time('StaticIntervalTree.from');
var tree = StaticIntervalTree.from(INTERVALS);
console.timeEnd('StaticIntervalTree.from');
console.log('Tree height: ' + tree.height);

p = random(0, MAX);

console.time('Array point');
r = [];
for (i = 0; i < SIZE; i++) {
  if (p <= INTERVALS[i][1] && p >= INTERVALS[i][0])
    r.push(INTERVALS[i]);
}
console.timeEnd('Array point');
console.log(r.length, 'intervals retrieved');

console.time('StaticIntervalTree point');
r = tree.intervalsContainingPoint(p);
console.timeEnd('StaticIntervalTree point');
console.log(r.length, 'intervals retrieved');
