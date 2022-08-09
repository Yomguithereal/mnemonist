/**
 * Mnemonist LRUCache Unit Tests
 * ==============================
 */
var assert = require('assert'),
  TestHelpers = require('./helpers.js'),
  LRUCacheWithExpiry = require('../lru-cache-with-expiry.js');

/* eslint-disable no-multi-spaces */

function timeFaker({initT, units = 60 * 1000}) {
  var fakeClock = {
    initT,
    units,
    currT: initT,
    advance(val) { this.currT += (val * this.units); },
    setTo(val) {   this.currT = initT + (val * this.units); },
    get since() { return (this.currT - this.initT) / this.units; },
  };
  // make getTime method detachable from fakeClock without missing its `this`
  fakeClock.getTime = () => fakeClock.currT;
  return fakeClock;
}

function episode14(fakeClock, cache) {
  fakeClock.setTo(0);  cache.set(1, 't00');
  fakeClock.setTo(2);  cache.set(20, 't002');
  fakeClock.setTo(3);  cache.set(30, 't003'); cache.set(31, 't003');
}
function episode5(fakeClock, cache) {
  fakeClock.setTo(5);    cache.set(50, 't05');
}
function episode68(fakeClock, cache) {
  fakeClock.setTo(6);
  cache.set(61, 'evictme'); cache.set(62, 't06OftenRead'); cache.set(63, 't06SooneGone');
  cache.get(1); cache.get(20); cache.get(30); cache.get(50); cache.get(31);
  fakeClock.setTo(8);
  cache.set(81, 't08'); cache.get(62);
}
function episode89(fakeClock, cache) {
  fakeClock.setTo(8);
  cache.delete(30); cache.get(20); cache.delete(81); cache.set(82, 't08'); cache.get(62); cache.delete(61);
  // now it has holes, but nothing should change
  fakeClock.setTo(9.5);
}

function makeTests(Cache, name) {
  describe(name, function() {
    //
    describe('construction', function() {
      it('uses pleasant defaults', function () {
        var initT = Date.now();
        var cache = new Cache(6);
        assert.strictEqual(cache.capacity, 6);
        assert.strictEqual(cache.ttk, 15 * 60 * 1000);
        assert.strictEqual(cache.ages.length, cache.capacity);
        assert.strictEqual(TestHelpers.testNear(cache.initT, initT, 0, 5000), true);
        assert.strictEqual(cache.lastT, cache.initT);
      });

      it('allows reasonable configurability', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var initT = fakeClock.getTime();
        var cache = new Cache(null, null, 8, {
          getTime: fakeClock.getTime, ttk: Cache.minutes(10),
        });
        assert.strictEqual(cache.capacity, 8);
        assert.strictEqual(cache.ttk, 10 * 60 * 1000);
        assert.strictEqual(cache.ages.length, cache.capacity);
        assert.strictEqual(cache.initT, initT);
        assert.strictEqual(cache.lastT, cache.initT);
      });

      it('accepts (capacity, options) as constructor signature', function () {
        var fakeClock = timeFaker({initT: 100});
        var initT = fakeClock.getTime();
        var cache = new Cache(8, {getTime: fakeClock.getTime, ttk: Cache.minutes(10)});
        assert.strictEqual(cache.capacity, 8);
        assert.strictEqual(cache.ttk, 10 * 60 * 1000);
        assert.strictEqual(cache.ages.length, cache.capacity);
        assert.strictEqual(cache.initT, initT);
        assert.strictEqual(cache.lastT, cache.initT);
      });

      it('validates inputs', function () {
        var fakeClock = timeFaker({initT: 100});
        let err, cache;
        try {
          cache = new Cache(8, {getTime: fakeClock.getTime, ttl: Cache.minutes(10)});
        } catch (errorThrown) {
          err = errorThrown;
        }
        assert.strictEqual(cache, undefined);
        assert.strictEqual(TestHelpers.testMatches(err, /Please supply options.ttk.*keep.*difference/), true);
      });
    });

    describe('time expiration', function () {

      it('works on an empty cache', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var cache = new Cache(null, null, 6, {getTime: fakeClock.getTime, ttk: 10});
        // empty
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [undefined,  undefined, undefined, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,  0, 0, 0, 0, 0]);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [undefined,  undefined, undefined, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,  0, 0, 0, 0, 0]);
        fakeClock.setTo(9.999);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [undefined,  undefined, undefined, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,  0, 0, 0, 0, 0]);
        fakeClock.setTo(10);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [undefined,  undefined, undefined, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,  0, 0, 0, 0, 0]);
        fakeClock.setTo(987654);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [undefined,  undefined, undefined, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,  0, 0, 0, 0, 0]);
      });

      it('does not expire things that are within the ttk', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var cache = new Cache(null, null, 8, {getTime: fakeClock.getTime, ttk: 10});
        //
        episode14(fakeClock, cache);
        episode5(fakeClock, cache);
        // partially full, nothing should expire
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [50, 31, 30, 20,  1]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20, 30, 31, 50, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,  3,  5, 0, 0, 0]);
        //
        // fill the cache
        episode68(fakeClock, cache);
        assert.deepStrictEqual(Array.from(cache.keys()), [62, 81,  31, 50,  30, 20,  1, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        // full, nothing should expire
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62, 81,  31, 50,  30, 20,  1, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        //
        // delete some stuff
        episode89(fakeClock, cache);
        fakeClock.setTo(9.5);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 20, 31,  50,  1, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
      });
      //

      it('Expires things that are at or after the ttk (partial cache)', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var cache = new Cache(null, null, 8, {getTime: fakeClock.getTime, ttk: 10});
        episode14(fakeClock, cache);
        episode5(fakeClock, cache);
        fakeClock.setTo(9.5);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [50, 31, 30, 20,  1]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20, 30, 31, 50, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,  3,  5, 0, 0, 0]);
        assert.deepStrictEqual(cache.deletedSize, 0);
        //
        // The item written at t=0 will expire but 2 and 3 will not.
        fakeClock.setTo(10);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [50, 31, 30, 20]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20, 30, 31, 50, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,  3,  5, 0, 0, 0]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        // It's idempotent (but with no performance gains)
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [50, 31, 30, 20]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20, 30, 31, 50, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,  3,  5, 0, 0, 0]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        //
        // We can keep expiring... the item written at t=2 will expire but 3 will not.
        fakeClock.setTo(12);
        cache.expire();
        //
        // Everything but one item will be expired
        fakeClock.setTo(14);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [50]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20, 30, 31, 50, undefined, undefined, undefined]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,  3,  5, 0, 0, 0]);
        assert.deepStrictEqual(cache.deletedSize, 4);
        //
        // Everything will be expired
        fakeClock.setTo(9999);
        cache.expire();
      });

      it('Expires things that are at or after the ttk (full cache)', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var cache = new Cache(null, null, 8, {getTime: fakeClock.getTime, ttk: 10});
        episode14(fakeClock, cache);
        episode5(fakeClock, cache);
        episode68(fakeClock, cache);
        fakeClock.setTo(9.5);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62, 81,  31, 50,  30, 20,  1, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 0);
        //
        fakeClock.setTo(10);
        // The item written at t=0 will expire but 2 and 3 will not.
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62, 81,  31, 50,  30, 20, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        // It's idempotent (but with no performance gains)
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62, 81,  31, 50,  30, 20, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        //
        // We can keep expiring... the item written at t=2 will expire but 3 will not.
        fakeClock.setTo(12);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62, 81,  31, 50,  30, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 2);
        //
        // Everything but one item will be expired
        fakeClock.setTo(17);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [81]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 7);
        //
        // Everything will be expired
        fakeClock.setTo(9999);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 81, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 0);
      });

      it('Expires things that are at or after the ttk (full cache with holes)', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var cache = new Cache(null, null, 8, {getTime: fakeClock.getTime, ttk: 10});
        episode14(fakeClock, cache);
        episode5(fakeClock, cache);
        episode68(fakeClock, cache);
        episode89(fakeClock, cache);
        fakeClock.setTo(9.5);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 20, 31,  50,  1, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        //
        fakeClock.setTo(10);
        // The item written at t=0 will expire but 2 and 3 will not.
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 20, 31,  50, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 2);
        // It's idempotent (but with no performance gains)
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 20, 31,  50, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 2);
        //
        // We can keep expiring... the item written at t=2 will expire but 3 will not.
        fakeClock.setTo(12);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 31, 50, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 3);
        //
        // Everything but one item will be expired
        fakeClock.setTo(17);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [82]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 7);
        //
        // Everything will be expired
        fakeClock.setTo(9999);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 0);
      });

      it('Enjoys a good workout', function () {
        var fakeClock = timeFaker({initT: 0, units: 1});
        var cache = new Cache(null, null, 8, {getTime: fakeClock.getTime, ttk: 10});
        episode14(fakeClock, cache);
        episode5(fakeClock, cache);
        episode68(fakeClock, cache);
        episode89(fakeClock, cache);
        fakeClock.setTo(9.5);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 20, 31,  50,  1, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        //
        fakeClock.setTo(10);
        // The item written at t=0 will expire but 2 and 3 will not.
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [62,  82, 20, 31,  50, 63]);
        assert.deepStrictEqual(Array.from(cache.K),      [1,  20,  30, 31,  50, 82, 62, 63]);
        assert.deepStrictEqual(Array.from(cache.ages),   [0,   2,  3,   3,   5,  8,  6,  6]);
        assert.deepStrictEqual(cache.deletedSize, 2);
        // clock still at 10
        cache.set(101, 't100'); cache.get(50); cache.delete(63); cache.set(102, 't100');
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [102, 50, 101, 62,  82, 20, 31]);
        assert.deepStrictEqual(Array.from(cache.K),      [101,  20,  30, 31,  50, 82, 62, 102]);
        assert.deepStrictEqual(Array.from(cache.ages),   [10,    2,  3,   3,   5,  8,  6,  10]);
        assert.deepStrictEqual(cache.deletedSize, 1);
        //
        // We can keep expiring... the item written at t=2 will expire but 3 will not.
        fakeClock.setTo(12);
        cache.get(20);
        assert.deepStrictEqual(Array.from(cache.keys()), [20, 102, 50, 101, 62,  82, 31]);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [102, 50, 101, 62,  82, 102]);
        assert.deepStrictEqual(Array.from(cache.K),      [101,  20,  30, 31,  50, 82, 62, 102]);
        assert.deepStrictEqual(Array.from(cache.ages),   [10,    2,  3,   3,   5,  8,  6,  10]);
        assert.deepStrictEqual(cache.deletedSize, 2);
        //
        // Everything but one item will be expired
        fakeClock.setTo(19);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), [102, 101]);
        assert.deepStrictEqual(Array.from(cache.K),      [101, 20,  30, 31,  50, 82, 62, 102]);
        assert.deepStrictEqual(Array.from(cache.ages),   [10,   2,  3,   3,   5,  8,  6,  10]);
        assert.deepStrictEqual(cache.deletedSize, 6);
        //
        // Everything will be expired
        fakeClock.setTo(9999);
        cache.expire();
        assert.deepStrictEqual(Array.from(cache.keys()), []);
        assert.deepStrictEqual(Array.from(cache.K),      [101, 20,  30, 31,  50, 82, 62, 102]);
        assert.deepStrictEqual(Array.from(cache.ages),   [10,   2,  3,   3,   5,  8,  6,  10]);
        assert.deepStrictEqual(cache.deletedSize, 0);
      });
    });

    describe('self-monitoring', function () {
      it('calls #expire on a regular interval, emitting log messages', function(done) {
        //
        // get ready to sleep while the monitor call expire ~ nloops times
        var cache = new Cache(4);
        // clobber this cache's expire method with a spy
        var expireWasCalled = 0;
        cache.expire = function() { expireWasCalled++; };
        //
        var monitorT = 50, nloops = 4, timer, logger = TestHelpers.dummyLogger();
        var assessOutcome = function() {
          cache.stopMonitor();
          try {
            assert.strictEqual((expireWasCalled === nloops), true);
            assert.strictEqual(logger.debugs.length, nloops);
            done();
          } catch (err) { done(err); } finally { clearInterval(timer); }
        };
        // start the monitor
        timer = cache.monitor(monitorT, {logger});
        // wake up after the n'th loop has run to stop the monitor and check the results
        setTimeout(assessOutcome, (monitorT * (nloops + 0.8)));
      });

      it('accepts callbacks for metrics and error handling', function(done) {
        //
        // get ready to sleep while the monitor call expire ~ nloops times
        var cache = new Cache(4);
        var monitorT = 50, nloops = 4, timer, logger = TestHelpers.dummyLogger();
        //
        var didErrorCalls = [], didExpireCalls = [];
        var didError = function(err, inst) {
          didErrorCalls.push([err, inst]);
          return true;
        };
        var didExpire = function(inst, begT) {
          didExpireCalls.push([inst, begT]);
          if (didExpireCalls.length > 2) { throw new Error('catch me please'); }
        };
        var assessOutcome = function() {
          cache.stopMonitor();
          try {
            assert.strictEqual(logger.debugs.length, 0); // not called, because we gave didExpire
            assert.strictEqual(logger.errors.length, 0); // not called, because we gave didError
            assert.strictEqual(didExpireCalls.length, 4);
            assert.strictEqual(didErrorCalls.length, 2);
            done();
          } catch (err) { done(err); } finally { clearInterval(timer); }
        };
        // start the monitor
        timer = cache.monitor(monitorT, {logger, didError, didExpire});
        // wake up after the n'th loop has run to stop the monitor and check the results
        global.setTimeout(assessOutcome, monitorT * (nloops + 0.8));
      });

    });
  });
}

makeTests(LRUCacheWithExpiry, 'LRUCacheWithExpiry');
