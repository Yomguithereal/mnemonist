// Benchmarking set operations vs. merging sorted lists
var op = require('../../set.js'),
    merge = require('../../utils/merge.js');

var SIZE = 10000000;

var listA = [1, 2, 3, 4, 5, 6],
    listB = [5, 6, 7, 8, 9, 10],
    listC = [-10, -5, 5, 6, 8, 10, 506],
    listD = [1, 2, 3, 4, 5, 18];

var setA = new Set(listA),
    setB = new Set(listB),
    setC = new Set(listC),
    setD = new Set(listD);

var i, r;

console.time('List intersection');
for (i = 0; i < SIZE; i++)
  r = merge.intersectionUnique(listA, listB);
console.timeEnd('List intersection');
console.log(r);

console.time('Set intersection');
for (i = 0; i < SIZE; i++)
  r = op.intersection(setA, setB);
console.timeEnd('Set intersection');
console.log(r);

console.time('List intersection k-way');
for (i = 0; i < SIZE; i++)
  r = merge.intersectionUnique(listA, listB, listC, listD);
console.timeEnd('List intersection k-way');
console.log(r);

console.time('Set intersection');
for (i = 0; i < SIZE; i++)
  r = op.intersection(setA, setB, setC, setD);
console.timeEnd('Set intersection');
console.log(r);
