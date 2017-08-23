/**
 * Mnemonist DynamicArray
 * =======================
 *
 * Abstract implementation of a growing array that can be used with JavaScript
 * typed arrays and other array-like structures.
 */

/**
 * Constants.
 */
var DEFAULT_GROWING_POLICY = function(currentSize) {
  return Math.ceil(currentSize * 1.5);
};

/**
 * DynamicArray.
 *
 * @constructor
 * @param {function}      ArrayClass           - An array constructor.
 * @param {number|object} initialSizeOrOptions - Self-explanatory.
 */
function DynamicArray(ArrayClass, initialSizeOrOptions) {
  if (arguments.length < 2)
    throw new Error('mnemonist/dynamic-array: expecting at least an array constructor and an initial size or options.');

  var initialSize = initialSizeOrOptions,
      policy = DEFAULT_GROWING_POLICY;

  if (typeof initialSizeOrOptions === 'object') {
    initialSize = initialSizeOrOptions.initialSize;
    policy = initialSizeOrOptions.policy || policy;
  }

  this.ArrayClass = ArrayClass;
  this.length = 0;
  this.allocated = initialSize;
  this.policy = policy;
  this.array = new ArrayClass(initialSize);
}

/**
 * Method used to set a value.
 *
 * @param  {number} index - Index to edit.
 * @param  {any}    value - Value.
 * @return {DynamicArray}
 */
DynamicArray.prototype.set = function(index, value) {
  this.array[index] = value;

  if (index > this.length - 1)
    this.length = index + 1;

  return this;
};

/**
 * Method used to get a value.
 *
 * @param  {number} index - Index to retrieve.
 * @return {any}
 */
DynamicArray.prototype.get = function(index) {
  return this.array[index];
};

/**
 * Method used to grow the array.
 *
 * @return {DynamicArray}
 */
DynamicArray.prototype.grow = function() {
  var allocated = this.allocated;

  this.allocated = this.policy(allocated);

  if (this.allocated <= allocated)
    throw new Error('mnemonist/dynamic-array.grow: policy returned a less or equal length to allocate.');

  var oldArray = this.array;
  this.array = new this.ArrayClass(this.allocated);

  for (var i = 0, l = this.length; i < l; i++)
    this.array[i] = oldArray[i];

  return this;
};

/**
 * Method used to resize the array.
 *
 * @param  {number}       length - Desired length.
 * @return {DynamicArray}
 */
// DynamicArray.prototype.resize = function(length) {

// };

/**
 * Method used to push a value into the array.
 *
 * @param  {any}    value - Value to push.
 * @return {number}       - Length of the array.
 */
DynamicArray.prototype.push = function(value) {
  if (this.length >= this.allocated)
    this.grow();

  this.set(this.length++, value);

  return this.length;
};

/**
 * Convenience known methods.
 */
DynamicArray.prototype.inspect = function() {
  var proxy = new this.ArrayClass(this.length);

  for (var i = 0; i < this.length; i++)
    proxy[i] = this.array[i];

  proxy.type = this.ArrayClass.name;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: DynamicArray,
    enumerable: false
  });

  return proxy;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {DynamicArray}
 */
// DynamicArray.from = function(iterable) {

// };

/**
 * Exporting.
 */
module.exports = DynamicArray;
