var randomString = require('pandemonium/random-string');
var random = require('pandemonium/random');
var typed = require('../../../utils/typed-arrays.js');
var {snipToLast} = require('../../../utils/snip.js');

module.exports.random = random;
module.exports.randomString = randomString;

function randArr(size, range, rng) {
  var ValArrayFactory = typed.getPointerArray(range);
  var arr = new ValArrayFactory(size)
  for (var ii = 0; ii < size; ii++) {
    arr[ii] = rng(ii);
  }
  return arr
}
module.exports.randArr = randArr;

function longTailArr(size, range, power) {
  var intgen = longTailIntGen(range, power)
  return randArr(size, range, intgen);
}
module.exports.longTailArr = longTailArr;

function flatDistArr(size, range, offset = 0) {
  var intgen = () => random(offset, range + offset);
  return randArr(size, range, intgen);
}
module.exports.flatDistArr = flatDistArr;

function ascendingArr(size, range) {
  var intgen = (ii) => (ii);
  return randArr(size, range, intgen);
}
module.exports.ascendingArr = ascendingArr;

function longTailIntGen(range, power = -0.8) {
  return function intgen() {
    var rand = Math.random()
    var yy = (1 - rand)**(power) - 1
    var result = Math.floor(0.25 * range * yy)
    if (result < range) { return result }
    return intgen()
  }
}
module.exports.longTailIntGen = longTailIntGen;

function longTailStrGen(range, power = -0.8, tag = '') {
  var intgen = longTailIntGen(range, power);
  return function strgen() {
    return String(intgen()) + tag;
  }
}
module.exports.longTailStrGen = longTailStrGen;

function stringifyArr(arr, tag = '') {
  var stringArr = [];
  for (var ii = 0; ii < arr.length; ii++) {
    stringArr.push(String(arr[ii]) + tag);
  }
  return stringArr;
}
module.exports.stringifyArr = stringifyArr;

function comparePairTails([kk1, vv1], [kk2, vv2]) {
  if (vv2 > vv1) { return 1 }
  if (vv2 < vv1) { return -1 }
  if (kk2 > kk1) { return -1 }
  if (kk2 < kk1) { return 1 }
  return 1
}

function showDistribution(arr, chunk = 1) {
  var counts = new Map();
  for (var item of arr) {
    const bin = chunk * Math.floor(item / chunk)
    if (! counts.has(bin)) { counts.set(bin, 0); }
    counts.set(bin, 1 + counts.get(bin));
  }
  var entries = [...counts].sort(comparePairTails)
  var histo = new Map(entries)
  histo.last = entries[entries.length - 1]
  return histo
}
module.exports.showDistribution = showDistribution;

function examineDist(keys, chunks = 10_000) {
  var histA = showDistribution(keys, 1000)
  var histB = showDistribution(keys, chunks)
  console.log(
    keys.length,
    histA.size,
    snipToLast(histA.entries(), new Map(), {maxToDump: 25, last: histA.last, size: histA.size}),
    histB,
  )
}
module.exports.examineDist = examineDist;

// var HewJass = longTailArr(2_000_000, 1e6, -0.5);
// examineDist(HewJass, 100_000);
