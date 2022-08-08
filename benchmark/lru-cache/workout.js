var random = require('pandemonium/random');
var Benchmark = require('benchmark')
var Keymaster = require('./helpers/key-distributions.js');
var Exerciser = require('./helpers/cache-exercisers.js');
var LRUCache = require('../../lru-cache.js'),
    LRUMap = require('../../lru-map.js'),
    LRUCacheWithDelete = require('../../lru-cache-with-delete.js'),
    LRUMapWithDelete = require('../../lru-map-with-delete.js'),
    LRUCacheWithExpiry = require('../../lru-cache-with-expiry.js');

// TEST_CACHE=LRUMapWithDelete node --prof ./benchmark/lru-cache/workout.js ;
// PFILE=`ls -1t isolate-* | head -n1`; node --prof-process $PFILE > $(basename $PFILE .log).prof.txt ; echo $PFILE;
// mv $PFILE /tmp/prof/
// ## OR ##
// TEST_CACHE=LRUMapWithDelete TEST_REPS=1000 node --inspect-brk ./benchmark/lru-cache/workout.js
// then open up chrome://inspect/#devices, look for this process;
// kick it in gear until it gets past the setup, then witch to profiling and capture your trace.

Benchmark.options.minSamples = 30;

var CACHES = { LRUMap, LRUCache, LRUMapWithDelete, LRUCacheWithDelete, LRUCacheWithExpiry };

var TEST_REPS = Number(process.env.TEST_REPS) || 100;

var CacheFactory = CACHES[process.env.TEST_CACHE];
if (! CacheFactory) {
  console.error("Please specify env var TEST_CACHE with one of", Object.keys(CACHES));
  process.exit(-9);
}

var {
  makeStandardKeys,
  write1Read1, write1Read4, write1, read1, delete1,
} = Exerciser;

var { NumKeys:Keys } = makeStandardKeys()
var cache = Exerciser.makeLoadedCache(CacheFactory, Keys.arrOrd);

var initT = Date.now();
var lastT = initT;

Exerciser.times(TEST_REPS, function (ii) {
  var currDT = new Date();
  var currT = currDT.valueOf();
  console.log(
    ii, "\t",
    Exerciser.round((currT - initT) / (ii * 1000), 3), "\t",
    Exerciser.round((currT - lastT) / 1000, 3), "\t",
    currDT, cache.size, cache.capacity, cache.inspect({maxToDump:5}),
  );
  lastT = currT;
  write1Read4(cache, [Keys.arrFlat, Keys.arr97], Keys.arr97.length);
  write1Read4(cache, [Keys.arrFlat, Keys.arr97], Keys.arr97.length);

  var currDT = new Date();
  var currT = currDT.valueOf();
  console.log(
    ii, "\t",
    Exerciser.round((currT - initT) / (ii * 1000), 3), "\t",
    Exerciser.round((currT - lastT) / 1000, 3), "\t",
    currDT, cache.size, cache.capacity, cache.inspect({maxToDump:5}),
  );
  lastT = currT;
  delete1(cache, [cache.K], cache.capacity);
});
