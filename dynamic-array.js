/**
 * Mnemonist DynamicArray
 * =======================
 *
 * Abstract implementation of a growing array that can be used with JavaScript
 * typed arrays and other array-like structures like the BitSet.
 */
var iterateOver = require('./utils/iterate.js');

/**
 * Constants.
 */
var DEFAULT_GROWING_POLICY = function(currentSize) {
  return currentSize * 1.5;
};

/**
 * DynamicArray.
 *
 * @constructor
 * @param {function}      ArrayClass           - An array constructor.
 * @param {number|object} initialSizeOrOptions - Self-explanatory.
 */
function DynamicArray(ArrayClass, initialSizeOrOptions) {
  this.clear();

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

};

/**
 * Method used to get a value.
 *
 * @param  {number} index - Index to retrieve.
 * @return {any}
 */
DynamicArray.prototype.get = function(index) {

};

/**
 * Method used to push a value into the array.
 *
 * @param  {any}    value - Value to push.
 * @return {number}       - Length of the array.
 */
DynamicArray.prototype.push = function(value) {

};

/**
 * Method used to resize the array.
 *
 * @param  {number}       length - Desired length.
 * @return {DynamicArray}
 */
DynamicArray.prototype.resize = function(length) {

};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {DynamicArray}
 */
DynamicArray.from = function(iterable) {

};

/**
 * Exporting.
 */
module.exports = DynamicArray;
