/**
 * Mnemonist Bloom Filter
 * =======================
 *
 * Bloom Filter implementation relying on MurmurHash3.
 */
var murmurhash3 = require('./utils/murmurhash3.js');

/**
 * Constants.
 */
var LN2 = Math.log(2),
    LN2SQUARED = Math.pow(LN2, 2),
    MAX_CAPACITY = 36000;

/**
 * Defaults.
 */
var DEFAULTS = {
  errorRate: .001,
  seed: 0
};

/**
 * Bloom Filter.
 *
 * @constructor
 */
function BloomFilter(capacityOrOptions) {
  var options = capacityOrOptions;

  if (typeof options !== 'object') {
    options = {capacity: options};
  }

  this.capacity = options.capacity;
  this.errorRate = options.errorRate || DEFAULTS.errorRate;
  this.seed = options.seed || DEFAULTS.seed;

  if (this.capacity > MAX_SIZE)

  // Finding best settings
  var idealSize = -1 / LN2SQUARED * this.capacity * Math.log(this.errorRate),
      filterSize = (idealSize / 8) | 0;

  this.clear();
}

/**
 * Method used to clear the list.
 *
 * @return {undefined}
 */
BloomFilter.prototype.clear = function() {

  // Properties
  this.size = 0;
};

/**
 * Exporting.
 */
module.exports = BloomFilter;
