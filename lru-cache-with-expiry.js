/**
 * Mnemonist LRUCacheWithExpiry
 * =============================
 *
 * An extension of LRUCache with time expiry
 */

var LRUCacheWithDelete = require('./lru-cache-with-delete.js'),
    forEach = require('obliterator/foreach'),
    // typed = require('./utils/typed-arrays.js'),
    iterables = require('./utils/iterables.js');

//
// This adds time-to-keep expiration to the LRUCacheWithDelete.
//
// Besides the other ledgers of the backing cache, on every write
// operation the update time is saved in a fixed-sized array. No other
// speed or memory overhead is required for regular operations: most
// importantly, that means there is no age verification on
// read. Customer must periodically call the expire method, which
// evicts items older than the time-to-keep.
//
// The target use case is a 15-minute time-to-keep on caches of 64k
// capacity, where we can tolerate a modest slop in expiration and
// small periodic expiry sweeps. The benchmark script demonstrates a
// 1M-element cache with a 10s ttk being expired every 2 seconds,
// spending 50-60ms on each expiry sweep. I don't know what use case
// would need those extremes but there you go.
//
// Limitations:
//
// * The time-to-live (maximum age of any record returned in a read
//   operation) has only the weak guarantee of `(time-to-keep +
//   maximum-delay-between-expires)`.
//
// * The expire operation must be done as a whole, and this does not
//   offer to do it in a separate thread or make any attempt to be
//   thread safe. However, the benchmarks in `benchmark/lru-cache`
//   show that a full delete of every item in a 30,000 element cache
//   runs in less than 10ms on a 2019 Macbook Pro.
//
// * Having two expire operations scheduled in the same
//   thread should be harmless but would give no speedup, so if you
//   found yourself in a situation where the expire was taking
//   significant time it could be big trouble.
//
// * Due to floating-point shenanigans a custom clock returning
//   fractional times may behave unexpectedly.
//
// Alternatives considered and discarded:
//
// * Rather than walking the full length of the age ledger (or linked
//   list), keep a data structure (heap?) to reveal only the expirable
//   records. This could shorten expiry times in general but I'd worry
//   that if there was a large batch to expire the time spent grooming
//   the heap could swamp the typical-case savings.
//
// * Maintain two or more generations of cached items, rotating then
//   at ttl/2. (write to both, read from the new generation falling
//   back to the old generation, and on each expire discard the oldest
//   generation and add a new empty cache). This would make expiry
//   O(1), with low impact on individual operations but a notable
//   tradeoff in cache efficiency.
//
// * Checking the age on read would significantly impact the read performance.
//
// Potential Opportunities for improvement:
//
// * Reduce the memory footprint of the age ledger by chunking the
//   timestamps to bytes or words.  In the case of byte (256 age
//   bins), a 10-minute ttk, and otherwise default parameters, an
//   expire operation would discard everything older than (ttk -
//   ttk/64) (guaranteeing the ttk but reaping an additional 1.5% of
//   records). Expire must be called at least once every `2 * ttk` (20
//   minutes) or the newest records would be indistinguishable from
//   the oldest records. (Everything would work but it would be a damn
//   shame for cache efficiency). A word-sized (64k bins) ledger makes
//   the tradeoffs minimal, but offering both choices shouldn't be a
//   problem.
//
// * For every record it expires we independently call delete, which
//   doctors the read-age linked list. It may make more sense to walk
//   the linked list.
//

/**
 *
 * LRU cache with time-to-keep expiration
 *
 * Trades fast read/writes for guarantees on timely expiration or fast
 * expiration loops.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @param  {object}   capacity - Configuration
 * @param  {function} [options.getTime = Date.now] - replaces the meaning of time (for mocking and to allow eg a vector clock). Will be called with the object and action as parameters.
 * @param  {number}   [options.ttk = 15 minutes] - when expire is called all items whose update time is older than ttk milliseconds will be deleted. Other items may be as well, depending on implementation.
 *
 * @return {LRUCacheWithExpiry}
 */
function LRUCacheWithExpiry(Keys, Values, capacity, options = {}) {
  if (arguments.length <= 1) {
    options = {}; capacity = Keys;
    LRUCacheWithDelete.call(this, capacity);
  }
  else if (arguments.length <= 2) {
    options = Values; capacity = Keys;
    LRUCacheWithDelete.call(this, capacity);
  }
  else {
    LRUCacheWithDelete.call(this, Keys, Values, capacity);
  }
  if (options.ttl || options.ttl === 0) {
    throw new Error('Please supply options.ttk (time-to-**keep**), not ttl (and understand the difference)');
  }
  this.getTime = options.getTime || Date.now;
  this.ttk = options.ttk || LRUCacheWithExpiry.minutes(15);
  this.ages = new Float64Array(this.capacity);
  //
  this.initT = this.getTime('init', this);
  this.lastT = this.initT;
}

// FIXME: remove?
LRUCacheWithExpiry.prototype.investigate = function(...args) {
  // eslint-disable-next-line no-console
  console.log(this.inspect({all: true}), ...args);
};

/**
 * LRUCacheWithExpiry inherits from LRUCacheWithDelete
 */

for (var k in LRUCacheWithDelete.prototype)
  LRUCacheWithExpiry.prototype[k] = LRUCacheWithDelete.prototype[k];

/**
 * If possible, attaching the
 * * #.entries method to Symbol.iterator (allowing `for (const foo of cache) { ... }`)
 * * the summaryString method to Symbol.toStringTag (allowing `\`${cache}\`` to work)
 */
if (typeof Symbol !== 'undefined') {
  LRUCacheWithExpiry.prototype[Symbol.iterator] = LRUCacheWithDelete.prototype[Symbol.iterator];
  Object.defineProperty(LRUCacheWithExpiry.prototype, Symbol.toStringTag, {
    get: function () { return `${this.constructor.name}:${this.size}/${this.capacity}`; },
  });
}
Object.defineProperty(LRUCacheWithExpiry.prototype, 'summary', Object.getOwnPropertyDescriptor(LRUCacheWithDelete.prototype, 'summary'));

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUCacheWithExpiry.prototype.set = function(key, value) {
  LRUCacheWithDelete.prototype.set.call(this, key, value);
  var pointer = this.items[key];
  this.ages[pointer] = this.getTime('set', this);
};

/**
 * Method used to set the value for the given key in the cache
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {{evicted: boolean, key: any, value: any}} An object containing the
 * key and value of an item that was overwritten or evicted in the set
 * operation, as well as a boolean indicating whether it was evicted due to
 * limited capacity. Return value is null if nothing was evicted or overwritten
 * during the set operation.
 */
LRUCacheWithExpiry.prototype.setpop = function(key, value) {
  var result = LRUCacheWithDelete.prototype.setpop.call(this, key, value);
  var pointer = this.items[key];
  this.ages[pointer] = this.getTime('set', this);
  return result;
};

/**
 * All items written before curfew time are due for expiry
 */
Object.defineProperty(LRUCacheWithExpiry.prototype, 'curfew', {
  get() { return this.getTime('check', this) - this.ttk; }
});

/**
 * Duration of time since last expiration
 */
Object.defineProperty(LRUCacheWithExpiry.prototype, 'sinceExpiry', {
  get() { return this.getTime('check', this) - this.lastT; }
});

/**
 * Delete all cached items older than this.ttk
 */
LRUCacheWithExpiry.prototype.expire = function() {
  this.getTime('startExpire', this);
  var curfew = this.curfew;
  var ii;
  for (ii = 0; ii < this.capacity; ii++) {
    if (this.ages[ii] <= curfew) {
      this.delete(this.K[ii]);
    }
  }
  this.lastT = this.getTime('doneExpire', this);
};

// /**
//  * Delete all cached items older than this.ttk
//  */
// LRUCacheWithExpiry.prototype.expireUsingLinkedList = function() {
//   var currT = this.getTime('startExpire', this);
//   var curfew = this.curfew
//   // TODO: are there savings from unwinding the delete op into this?
//   var pointer = this.head;
//   while ((pointer !== this.tail) && (this.size > 1)) {
//     if (this.ages[pointer] < curfew) {
//       console.log('del', pointer, this.V[pointer], this.ages[pointer]);
//       this.delete(this.K[pointer]);
//     } else {
//       this.pointer = this.backward[pointer]
//     }
//   }
// };

/**
 *
 * Method used to start an asynchronous monitor that calls #expire()
 * on the given milliseconds interval. Supply an optional didError to
 * receive any errors thrown during expiry. Unless you supply that
 * callback and it returns true, the error will be re-thrown.
 *
 * Repeated calls to monitor will clear any previous timers.
 *
 * @param  {number} interval - milliseconds between expire() calls
 * @param  {object} options - configuration
 * @param  {function} [options.didExpire] - will be invoked as didExpire(this, begT) with the millis timestamp immediately before calling expire. By default logs the duration of expire.
 * @param  {function} [options.didError] - will be invoked as didError(error, this) on any error.
 * @param  {function} [options.logger = console] - used to emit log messages.
 *
 * The return value of this method is unspecified. Use .stopMonitor to
 * remove the monitor.
 */
LRUCacheWithExpiry.prototype.monitor = function(interval, options = {}) {
  var self = this;
  var logger = options.logger || console;
  var name = options.name || this.constructor.name;
  var begT;
  var didError = options.didError || function(err, inst) {
    logger.error(`Error in ${name}.expire: ${err}`, {err, cache: inst.inspect()});
    return false;
  };
  var didExpire = options.didExpire || function(inst, facts) {
    var endT = Date.now();
    logger.debug(`${name}.expire: ${endT - facts.begT} ${facts.begDeletedSize} ${self.deletedSize}`);
  };
  // set up a very paranoid method to run in the background, presumably forever.
  var doExpire = function () {
    try {
      begT = Date.now();
      var {deletedSize: begDeletedSize, lastT: begLastT} = self;
      self.expire();
      didExpire(self, {begT, begDeletedSize, begLastT});
    } catch (err) {
      try {
        var handled = didError(err, self);
        if (handled) { return; }
      } catch (errInHandler) { logger.error(`Double error ${errInHandler} in handler for ${self}`, errInHandler); } // eslint-disable-line no-console
      try {
        self.stopMonitor('error');
      } catch (errStoppingMonitor) { console.error('Cascading error in expiration monitor', errStoppingMonitor); } // eslint-disable-line no-console
      throw err;
    }
  };
  // kill any previous monitors and start the new one running on given interval.
  this.stopMonitor('starting');
  this.timer = setInterval(doExpire, interval);
  return this.timer; // lets tests cancel the timer directly; you should use stopMonitor()
};

/**
 * Provide a reasonably-sized view of the object.
 *
 * @param  {number}   [depth]   - When < 0, only the toString() summary is returned
 * @param  {object}   [options = {}]  - settings for output
 * @param  {boolean}  [options.all = false] - When true, returns the object with all properties, ignoring limits
 * @param  {number}   [options.maxToDump = 20] - When size > maxToDump, lists only the
 *                      youngest `maxToDump - 2`, a placeholder with the number
 *                      omitted, and the single oldest item. The secret variable
 *                      LRUCache.defaultMaxToDump determines the default limit.
 * @return {Map}
 *
 */
LRUCacheWithExpiry.prototype.inspect = function(depth, options = {}) {
  if (arguments.length <= 1) { options = depth || {}; depth = 2; }
  var inspected = LRUCacheWithDelete.prototype.inspect.call(this, depth, options);
  if (options.all) { return inspected; }
  const {ttk, initT, lastT, deletedSize, curfew, sinceExpiry} = this;
  Object.assign(inspected, {ttk, initT, lastT, deletedSize, curfew, sinceExpiry});
  return inspected;
};

if (typeof Symbol !== 'undefined')
  LRUCacheWithExpiry.prototype[Symbol.for('nodejs.util.inspect.custom')] = LRUCacheWithExpiry.prototype.inspect;

/*
 * Helper to convert given number of minutes to milliseconds
 */
LRUCacheWithExpiry.minutes = function(mins) { return 1000 * 60 * mins; };

/**
 *
 * Method used to stop the monitor, if any.
 * NOTE: you must ensure that this method is not stripped of its this:
 *   setTimeout(cache.stopMonitor, 100000)       // WILL THROW
 *   setTimeout(() => cache.stopMonitor, 100000) // WILL WORK
 */
LRUCacheWithExpiry.prototype.stopMonitor = function() {
  if (! (/LRU/.test(this.constructor.name))) {
    throw new Error('cache.stopMonitor called with this-less bindings');
  }
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
};

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {function} Keys     - Array class for storing keys.
 * @param  {function} Values   - Array class for storing values.
 * @param  {number}   capacity - Cache's capacity.
 * @return {LRUCacheWithExpiry}
 */
LRUCacheWithExpiry.from = function(iterable, Keys, Values, capacity, options) {
  if (arguments.length < 2) {
    capacity = iterables.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/lru-cache.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }
  else if (arguments.length === 2) {
    capacity = Keys;
    Keys = null;
    Values = null;
    options = {};
  }

  var cache = new LRUCacheWithExpiry(Keys, Values, capacity, options);

  forEach(iterable, function(value, key) {
    cache.set(key, value);
  });

  return cache;
};

module.exports = LRUCacheWithExpiry;
