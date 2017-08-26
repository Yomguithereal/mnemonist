/**
 * Mnemonist BitSet
 * =================
 *
 * JavaScript implementation of a fixed-size BitSet based upon a Uint32Array.
 *
 * Notes:
 *   - (i >> 5) is the same as ((i / 32) | 0)
 *   - (i & 0x0000001f) is the sames as (i % 32)
 */
var bitwise = require('./utils/bitwise.js');

/**
 * BitSet.
 *
 * @constructor
 */
function BitSet(length) {

  // Properties
  this.length = length;
  this.clear();
}

/**
 * Method used to clear the bit set.
 *
 * @return {undefined}
 */
BitSet.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.array = new Uint32Array(Math.ceil(this.length / 32));
};

/**
 * Method used to set the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @param  {number} value - Value to set.
 * @return {BitSet}
 */
BitSet.prototype.set = function(index, value) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldByte = this.array[byteIndex],
      newByte;

  if (value === 0)
    newByte = this.array[byteIndex] &= ~(1 << pos);
  else
    newByte = this.array[byteIndex] |= (1 << pos);

  // Updating size
  if (newByte > oldByte)
    this.size++;
  else if (newByte < oldByte)
    this.size--;

  return this;
};

/**
* Method used to reset the given bit's value.
*
* @param  {number} index - Target bit index.
* @return {BitSet}
*/
BitSet.prototype.reset = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldByte = this.array[byteIndex],
      newByte;

  newByte = this.array[byteIndex] &= ~(1 << pos);

  // Updating size
  if (newByte > oldByte)
    this.size++;
  else if (newByte < oldByte)
    this.size--;

  return this;
};

/**
 * Method used to flip the value of the given bit.
 *
 * @param  {number} index - Target bit index.
 * @return {BitSet}
 */
BitSet.prototype.flip = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f,
      oldByte = this.array[byteIndex];

  var newByte = this.array[byteIndex] ^= (1 << pos);

  // Updating size
  if (newByte > oldByte)
    this.size++;
  else if (newByte < oldByte)
    this.size--;

  return this;
};

/**
 * Method used to get the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @return {number}
 */
BitSet.prototype.get = function(index) {
  var byteIndex = index >> 5,
      pos = index & 0x0000001f;

  return (this.array[byteIndex] >> pos) & 1;
};

/**
 * Method used to test the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @return {BitSet}
 */
BitSet.prototype.test = function(index) {
  return Boolean(this.get(index));
};

/**
 * Method used to return the number of 1 from the beginning of the set up to
 * the ith index.
 *
 * @param  {number} i - Ith index.
 * @return {number}
 */
BitSet.prototype.rank = function(i) {
  var byteIndex = i >> 5,
      pos = i & 0x0000001f,
      r = 0;

  // Accessing the bytes before the last one
  for (var j = 0; j < byteIndex; j++)
    r += bitwise.popcount(this.array[j]);

  // Handling masked last byte
  var maskedByte = this.array[byteIndex] & ((1 << pos) - 1);

  r += bitwise.popcount(maskedByte);

  return r;
};

/**
 * Method used to iterate over the bit set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
BitSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var byte,
      bit;

  for (var i = 0, l = this.array.length; i < l; i++) {
    byte = this.array[i];

    var b = i === l - 1 ? this.length % 32 : 32;

    for (var j = 0; j < b; j++) {
      bit = (byte >> j) & 1;

      callback.call(scope, bit, i * 32 + j);
    }
  }
};

/**
 * Bit Set Iterator class.
 */
function BitSetIterator(next) {
  this.next = next;
}

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
BitSet.prototype.values = function() {
  var length = this.length,
      inner = false,
      byte,
      bit,
      array = this.array,
      l = array.length,
      i = 0,
      j = -1,
      b;

  return new BitSetIterator(function next() {
    if (!inner) {

      if (i >= l)
        return {
          done: true
        };

      b = i === l - 1 ? length % 32 : 32;
      byte = array[i++];
      inner = true;
      j = -1;
    }

    j++;

    if (j >= b) {
      inner = false;
      return next();
    }

    bit = (byte >> j) & 1;

    return {
      value: bit
    };
  });
};

/**
 * Method used to create an iterator over a set's entries.
 *
 * @return {Iterator}
 */
BitSet.prototype.entries = function() {
  var length = this.length,
      inner = false,
      byte,
      bit,
      array = this.array,
      index,
      l = array.length,
      i = 0,
      j = -1,
      b;

  return new BitSetIterator(function next() {
    if (!inner) {

      if (i >= l)
        return {
          done: true
        };

      b = i === l - 1 ? length % 32 : 32;
      byte = array[i++];
      inner = true;
      j = -1;
    }

    j++;
    index = (~-i) * 32 + j;

    if (j >= b) {
      inner = false;
      return next();
    }

    bit = (byte >> j) & 1;

    return {
      value: [index, bit]
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  BitSet.prototype[Symbol.iterator] = BitSet.prototype.values;

/**
 * Convenience known methods.
 */
BitSet.prototype.inspect = function() {
  var proxy = new Uint8Array(this.length);

  this.forEach(function(bit, i) {
    proxy[i] = bit;
  });

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: BitSet,
    enumerable: false
  });

  return proxy;
};

BitSet.prototype.toJSON = function() {
  return this.array;
};

/**
 * Exporting.
 */
module.exports = BitSet;
