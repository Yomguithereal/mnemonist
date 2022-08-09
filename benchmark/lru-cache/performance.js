var random = require('pandemonium/random');
var Benchmark = require('benchmark')
var Keymaster = require('./helpers/key-distributions.js');
var Exerciser = require('./helpers/cache-exercisers.js');
var LRUCache = require('../../lru-cache.js'),
    LRUMap = require('../../lru-map.js'),
    LRUCacheWithDelete = require('../../lru-cache-with-delete.js'),
    LRUMapWithDelete = require('../../lru-map-with-delete.js'),
    LRUCacheWithExpiry = require('../../lru-cache-with-expiry.js');

// Benchmark.options.minSamples = 3;

var CACHES = [LRUCacheWithExpiry, LRUCache] //, LRUMap, LRUMapWithDelete, LRUMap, LRUCacheWithDelete, LRUCache];

var {
  makeStandardKeys, write1Read1, write1Read4, write1, read1,
} = Exerciser;
var { StrKeys, NumKeys } = makeStandardKeys()

function runEmptyCacheBenches(Keyset, benchOptions = {}) {
  const { gen70, gen97, arr70, arr97, arrFlat, arrOrd } = Keyset

  var emptyCaches = Exerciser.makeCaches(CACHES);
  scenario('Empty caches, repeated reads', emptyCaches, arr97.note, (cache) => (function() {
    read1(cache, arr97);
  }));
}

function runLoadedCacheBenches(Keyset, benchOptions = {}) {
  const { gen70, gen97, arr70, arr97, arrFlat, arrOrd } = Keyset

  var fullCaches = Exerciser.makeLoadedCaches(CACHES, arrOrd);

  if (benchOptions.do_expires) {
    fullCaches.forEach((cache) => { if (cache.monitor) { cache.monitor(200, null, {logging: true}); } });
  }

  scenario('1x flat writes, 4x gentle spread read', fullCaches, arr70.note, (cache) => (function() {
    write1Read4(cache, [arrFlat, arr70], arr70.length);
  }));

  scenario('Individual get then set operations', fullCaches, '97% short tail keys', (cache) => (function() {
    cache.get(gen97());
    cache.set(gen97(), 'hi');
  }));

  scenario('Individual get then set', fullCaches, 'flat distribution 33% larger than the cache', (cache) => (function() {
    cache.get(String(random(0, 40000)));
    cache.set(String(random(0, 40000)), 'hi');
  }));

  scenario('Read-only sharp spread',  fullCaches, arr97.note, (cache) => (function() {
    read1(cache, arr97);
  }));

  scenario('Read-only gentle spread', fullCaches, arr70.note, (cache) => (function() {
    read1(cache, arr70);
  }));

}

function scenario(act, caches, dataNote, actionsFactory, info) {
  var suite = decoratedSuite(act, caches.note, dataNote);
  caches.forEach((cache) => {
    var actions = actionsFactory(cache, info);
    suite.add(`${padEnd(act, 40)} -- ${padEnd(cache.name, 18)} --`, actions);
    // console.log(actions())
  })
  suite.run({ minSamples: 36 });
}

const SPACES = '                                    ';
function padEnd(str, len) {
  var bite = str.length > len ? 0 : len - str.length;
  return `${str}${SPACES.slice(0, bite)}`;
}

function decoratedSuite(act, subjectNote, dataNote) {
  return new Benchmark.Suite('Testing caches')
    .on('start', (event) => {
      console.log('\n ', act);
      console.log('    using', subjectNote);
      console.log('    with', String(dataNote) + "\n        Results:");
    })
    .on('error', (event) => { console.error("error in benchmark", event.target.name, event.target.error) })
    .on('cycle', (event) => {
      const benchmark = event.target;
      console.log("    => ", benchmark.toString());
    })
}

console.log('Running with String Keys');
runLoadedCacheBenches(StrKeys);
runEmptyCacheBenches(StrKeys);
