/**
 * Mnemonist Iterable Function
 * ============================
 *
 * Harmonized iteration helpers over mixed iterable targets.
 */
var forEach = require('obliterator/foreach');

var isTypedArray = require('./typed-arrays.js').isTypedArray;

/**
 * Function used to determine whether the given object supports array-like
 * random access.
 *
 * @param  {any} target - Target object.
 * @return {boolean}
 */
function isArrayLike(target) {
  return Array.isArray(target) || isTypedArray(target);
}

/**
 * Function used to guess the length of the structure over which we are going
 * to iterate.
 *
 * @param  {any} target - Target object.
 * @return {number|undefined}
 */
function guessLength(target) {
  if (typeof target.length === 'number')
    return target.length;

  if (typeof target.size === 'number')
    return target.size;

  return;
}

/**
 * Function used to convert an iterable to an array.
 *
 * @param  {any}   target - Iteration target.
 * @return {array}
 */
function toArray(target) {
  var l = guessLength(target);

  var array = typeof l === 'number' ? new Array(l) : [];

  var i = 0;

  forEach(target, function(value) {
    array[i++] = value;
  });

  return array;
}

/**
 * Exporting.
 */
exports.isArrayLike = isArrayLike;
exports.guessLength = guessLength;
exports.toArray = toArray;
