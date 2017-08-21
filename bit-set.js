/**
 * Mnemonist BitSet
 * =================
 *
 * JavaScript implementation of a fixed-size BitSet based upon a Uint8Array.
 */

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
  this.array = new Uint8Array(Math.ceil(this.length / 8));
};

/**
 * Method used to set the given bit's value.
 *
 * @param  {number} index - Target bit index.
 * @param  {number} value - Value to set.
 * @return {BitSet}
 */
BitSet.prototype.set = function(index, value) {
  if (arguments.length < 2)
    value = 1;

  var byteIndex = (index / 8) | 0,
      pos = index % 8,
      oldByte = this.array[byteIndex],
      newByte;

  if (value)
    newByte = this.array[byteIndex] |= (1 << pos);
  else
    newByte = this.array[byteIndex] &= ~(1 << pos);

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
  return this.set(index, false);
};

/**
 * Method used to flip the value of the given bit.
 *
 * @param  {number} index - Target bit index.
 * @return {BitSet}
 */
BitSet.prototype.flip = function(index) {
  var byteIndex = (index / 8) | 0,
      pos = index % 8,
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
  var byteIndex = (index / 8) | 0,
      pos = index % 8;

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

    var b = i === l - 1 ? this.length % 8 : 8;

    for (var j = 0; j < b; j++) {
      bit = (byte >> j) & 1;

      callback.call(scope, bit, i * 8 + j);
    }
  }
};


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
