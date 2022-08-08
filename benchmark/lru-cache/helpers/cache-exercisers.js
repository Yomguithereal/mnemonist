var random = require('pandemonium/random');
var Benchmark = require('benchmark')
var Keymaster = require('./key-distributions.js');

var TEST_CAP = 30000

function makeStandardKeys() {
  var StrKeys = {}
  var NumKeys = {}
  //
  // 400k entries with approx 42k distinct values btwn 0 and 60k, distributed 300k/65k/23k/10k/5k/3k (~97% in the top 30k)
  NumKeys.gen97 = Keymaster.longTailIntGen(60000, -0.4);
  NumKeys.arr97 = Keymaster.longTailArr(400000, 60000, -0.4);
  StrKeys.arr97 = Keymaster.stringifyArr(NumKeys.arr97);
  StrKeys.gen97 = Keymaster.longTailStrGen(60000, -0.4);
  NumKeys.arr97.note = 'Long-tail pool of 42,000 distinct numeric values, 97% in the top 30k, 75% in the top 10k'; StrKeys.arr97.note = NumKeys.arr97.note.replace(/numeric/, 'string');
  //
  // 400k entries with approx 50k distinct values btwn 0 and 60k, distributed 230k/80k/40k/22k/15k/10k (~88% in the top 30k)
  // var NumKeys.arr88 = Keymaster.longTailArr(400000, 60000, -0.7)
  //
  // 400k entries with approx 60k distinct values btwn 0 and 60k, distributed 135k/85k/61k/48k/39k/33k (~70% in the top 30k)
  NumKeys.gen70 = Keymaster.longTailIntGen(60000, -10);
  NumKeys.arr70 = Keymaster.longTailArr(400000, 60000, -10);
  StrKeys.arr70 = Keymaster.stringifyArr(NumKeys.arr70);
  StrKeys.gen70 = Keymaster.longTailStrGen(60000, -10);
  NumKeys.arr70.note = 'Long-tail pool of ~60,000 distinct numeric values, 70% in the top 30k, 33% in the top 10k'; StrKeys.arr70.note = NumKeys.arr70.note.replace(/numeric/, 'string');
  //
  // 120k entries with approx 52k distinct values btwn 0 and 60k, distributed evenly
  NumKeys.arrFlat = Keymaster.flatDistArr(120000, 60000);
  StrKeys.arrFlat = Keymaster.stringifyArr(NumKeys.arrFlat);
  //
  // 31k entries running 0-31k in order
  NumKeys.arrOrd = Keymaster.ascendingArr(31000, 31000);
  StrKeys.arrOrd = Keymaster.stringifyArr(NumKeys.arrOrd);
  //
  return { StrKeys, NumKeys }
}

function read1(cache, arrA) {
  var count = arrA.length;
  for (var ii = 0; ii < count; ii++) {
    cache.get(arrA[ii % arrA.length])
  }
}

function readFetch(cache, arrA, rng) {
  var count = arrA.length;
  for (var ii = 0; ii < count; ii++) {
    var keyA = arrA[ii % arrA.length];
    var result = cache.get(keyA);
    if (! result) {
      cache.set(keyA, rng());
    }
  }
}

function readFetch2(cache, [arrA, arrB], rng) {
  var count = arrA.length;
  for (var ii = 0; ii < count; ii++) {
    var keyA = arrA[ii % arrA.length];
    var keyB = arrB[ii % arrB.length];
    var result;
    result = cache.get(keyA)
    if (! result) { cache.set(keyA, rng()); }
    result = cache.get(keyB)
    if (! result) { cache.set(keyB, rng()); }
  }
}

function write1(cache, arrA) {
  var count = arrA.length;
  for (var ii = 0; ii < count; ii++) {
    var storeme = arrA[ii % arrA.length]
    cache.set(storeme, storeme)
  }
}

function write1Read1(cache, [arrA, arrB], count) {
  var blen = arrB.length;
  if (! count) { count = arrA.length; }
  for (var ii = 0; ii < count; ii++) {
    var storeme = arrA[ii % arrA.length]
    cache.set(storeme, storeme)
    cache.get(arrB[ii % blen])
  }
}

function write1Read4(cache, [arrA, arrB], count) {
  var blen = arrB.length;
  var boff0 = 0, boff1 = blen * 0.25, boff2 = blen * 0.50, boff3 = blen * 0.75;
  if (! count) { count = arrA.length; }
  for (var ii = 0; ii < count; ii++) {
    var storeme = arrA[ii % arrA.length]
    cache.set(storeme, storeme)
    cache.get(arrB[(ii + boff0) % blen])
    cache.get(arrB[(ii + boff1) % blen])
    cache.get(arrB[(ii + boff2) % blen])
    cache.get(arrB[(ii + boff3) % blen])
  }
}

function writeSome(cache, arrA, frac = 0.2) {
  var count = arrA.length;
  for (var ii = 0; ii < count; ii++) {
    if (Math.random() > frac) { continue; }
    var storeme = arrA[ii % arrA.length];
    cache.set(storeme, storeme);
  }
}

function delete1(cache, [arrA], count) {
  if (! count) { count = arrA.length; }
  for (var ii = 0; ii < count; ii++) {
    var delme = arrA[ii % arrA.length]
    cache.delete(delme, delme)
  }
}

function makeLoadedCaches(CacheFactories, arrA, count, capacity = TEST_CAP, options) {
  var caches = CacheFactories.map((CacheFactory) => makeLoadedCache(CacheFactory, arrA, count, capacity, options));
  caches.note = `${capacity}-capacity caches${arrA.note ? ' preloaded with ' + arrA.note : ''}`
  return caches
}

function makeCaches(CacheFactories, capacity = TEST_CAP, options = {}) {
  var caches = CacheFactories.map((CacheFactory) => {
    var cache = new CacheFactory(null, null, capacity, options);
    cache.name = CacheFactory.name;
    return cache;
  })
  caches.note = `${capacity}-capacity caches`
  return caches
}

function makeLoadedCache(CacheFactory, arrA, count, capacity = TEST_CAP, options) {
  if (! count) { count = arrA.length; }
  var cache = new CacheFactory(null, null, capacity, options);
  cache.name = CacheFactory.name;
  write1(cache, arrA, count);
  var capK = Math.round(capacity / 1000);
  cache.note = `Pre-loaded ${cache.name}@${capK}k`;
  return cache;
}

function times(count, func, ...args) {
  for (var ii = 0; ii < count; ii++) {
    func(ii, count, ...args);
  }
}

async function promisedTimes(count, func, ...args) {
  var results = [];
  for (var ii = 0; ii < count; ii++) {
    var result = await func(ii, count, ...args);
    results.push(result);
  }
  return Promise.all(results);
}

function round(val, decimals) {
  chunk = Math.round(Math.pow(10, decimals));
  return Math.round(val * chunk) / chunk;
}

function sleep(millis) { return new Promise((yay) => setTimeout(yay, millis)); }

module.exports = {
  read1, readFetch, write1, write1Read1, write1Read4, delete1, writeSome,
  makeStandardKeys, makeLoadedCaches, makeLoadedCache, makeCaches,
  times, promisedTimes, round, sleep,
}
