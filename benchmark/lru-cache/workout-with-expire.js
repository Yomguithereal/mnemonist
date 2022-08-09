#!/usr/bin/env node --max-old-space-size=8000
var random = require('pandemonium/random');
var Benchmark = require('benchmark')
var Keymaster = require('./helpers/key-distributions.js');
var Exerciser = require('./helpers/cache-exercisers.js');
var LRUCache = require('../../lru-cache.js'),
    LRUMap = require('../../lru-map.js'),
    LRUCacheWithDelete = require('../../lru-cache-with-delete.js'),
    LRUMapWithDelete = require('../../lru-map-with-delete.js'),
    LRUCacheWithExpiry = require('../../lru-cache-with-expiry.js');
// var {setInterval, setTimeout} = require('timers/promises');

// Run
//   runbench.sh lru-cache/workout-with-expire.js
//
// ## OR ##
//
//   TEST_REPS=1000 node --inspect-brk ./benchmark/lru-cache/workout.js
//
// then open up chrome://inspect/#devices, and look for your process
// kick it in gear until it gets past the setup, then switch to
// profiling and capture your trace.

var CACHES = { LRUMap, LRUCache, LRUMapWithDelete, LRUCacheWithDelete, LRUCacheWithExpiry };

var TEST_REPS = Number(process.env.TEST_REPS) || 30;

var CacheFactory = CACHES[process.env.TEST_CACHE || "LRUCacheWithExpiry"];
if (! CacheFactory) {
  console.error("Please specify env var TEST_CACHE with one of", Object.keys(CACHES));
  process.exit(-9);
}

var { write1Read1, write1Read4, write1, read1, delete1, writeSome, readFetch, times, sleep } = Exerciser;
var { longTailStrGen } = Keymaster

const CACHE_CAPACITY  = 1e6;
const CACHE_TTK       = 10 * 1000;
const CACHE_EXPIRE_MS =  2 * 1000;
const BATCH_WRITE_MS  =  3 * 1000;
const DISTINCT_KEYS   = 2e6;

// 3 million strings with about 500k distinct values, 37% of which are 0-100k and 99% 0-1.5M
var Sharp = Keymaster.stringifyArr(Keymaster.longTailArr(3e6, DISTINCT_KEYS, -0.4), 'A');
//
// 3 million strings with about 1.4M distinct values, 12% of which are 0-100k and 87% 0-1.5M
var Broad = Keymaster.stringifyArr(Keymaster.longTailArr(3e6, DISTINCT_KEYS, -10), 'B');
//
var FlatA = Keymaster.stringifyArr(Keymaster.flatDistArr(0.2 * DISTINCT_KEYS, 0.2 * DISTINCT_KEYS), 'A');
var FlatB = Keymaster.stringifyArr(Keymaster.flatDistArr(0.2 * DISTINCT_KEYS, 0.2 * DISTINCT_KEYS), 'B');
// var FlatNums = Keymaster.flatDistArr(0.2 * DISTINCT_KEYS, 0.2 * DISTINCT_KEYS); Keymaster.examineDist(FlatNums, 100_000);
//
// process used to penalize a cache "miss". power of eg -10 takes much longer than -0.4
var strgen = Keymaster.longTailStrGen(1e6, -0.4, 'A');

// Create cache with a ttk horizon of 5 seconds.
var cache = new CacheFactory(null, null, CACHE_CAPACITY, {ttk: CACHE_TTK});

var writeTimer;

// Start the expiration watcher to run every two seconds.  We are
// doing this to be punishing; a reasonably fast laptop gives ~80-1000ms
// per expire, so this will be 2% of all processing time
if (cache.monitor) { cache.monitor(CACHE_EXPIRE_MS) }

// We have a 1m element cache for two pools of keys being read and written:
//
// * a long-tail distrib of 6m keys with ~2m distinct values. On a
//   every read miss it has to spend time to "load" and store a value,
//   perhaps evicting another item.
// * a flat distrib of 800k keys covering the most frequent values,
//   representing a batch load process that runs on a timer.
// * A TTK expecting deletes of records that have not been "loaded" in 10s
//   enforced by a background async function running every 3 seconds
//   (if the cache is not a time-expiring cache no such process is started
//   and nothing to do with expiration is ever called)
//

async function workout() {
  try {
    var initT = Date.now();
    var lastLoopT = initT, lastWriteT = initT, nWriteBursts = 0;
    //
    function logit(act, actT, ii) {
      var currDT = new Date();
      var currT = currDT.valueOf();
      console.log(
        act, "\t", ii, "\t",
        Exerciser.round((currT - initT) / 1000, 1), "\t",
        Exerciser.round((currT - initT) / ((ii + 1) * 1000), 2), "\t",
        Exerciser.round((currT - actT) / 1000, 1), "\t",
        currDT, cache.sinceExpiry, "\t", `/ ${cache.ttk} ms ${cache.capacity}: ${cache.size}\t`, cache.deletedSize,
      );
    }
    //
    // once every BATCH_WRITE_MS, wake up and write flatly-distributed values covering the short-middle tails
    writeTimer = setInterval(() => {
      writeT = Date.now()
      writeSome(cache, FlatA, 0.10); // 10% of 400k
      writeSome(cache, FlatB, 0.10); // 10% of 400k
      logit('write', lastWriteT, nWriteBursts++);
    }, BATCH_WRITE_MS)
    //
    const tasks = Exerciser.promisedTimes(TEST_REPS, async function (ii) {
      loopT = Date.now();
      readFetch(cache, Broad, strgen);
      readFetch(cache, Sharp, strgen);
      console.log(cache.deletedSize, cache.size);
      logit('loop1', loopT, ii);
      await sleep(10); // yield the thread
    });
    await tasks;
    //
  } catch (err) {
    console.error(err);
    cache.stopMonitor && cache.stopMonitor();
    throw err;
  }
  cache.stopMonitor && cache.stopMonitor();
  if (writeTimer) { clearInterval(writeTimer); }
}

workout();
