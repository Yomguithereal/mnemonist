/**
 * Mnemonist Binary Search Helpers
 * ================================
 *
 * Typical binary search functions.
 */

/**
 * Function returning the index of the search value in the array or `-1` if
 * not found.
 *
 * @param  {array} array - Haystack.
 * @param  {any}   value - Needle.
 * @return {number}
 */
exports.search = function(array, value) {
  var mid = 0,
      lo = 0,
      hi = ~-array.length,
      current;

  while (lo <= hi) {
    mid = (lo + hi) >> 1;

    current = array[mid];

    if (current > value) {
      hi = ~-mid;
    }
    else if (current < value) {
      lo = -~mid;
    }
    else {
      return mid;
    }
  }

  return -1;
};

/**
 * Same as above, but can use a custom comparator function.
 *
 * @param  {function} comparator - Custom comparator function.
 * @param  {array}    array      - Haystack.
 * @param  {any}      value      - Needle.
 * @return {number}
 */
exports.searchWithComparator = function(comparator, array, value) {
  var mid = 0,
      lo = 0,
      hi = ~-array.length,
      comparison;

  while (lo <= hi) {
    mid = (lo + hi) >> 1;

    comparison = comparator(array[mid], value);

    if (comparison > 0) {
      hi = ~-mid;
    }
    else if (comparison < 0) {
      lo = -~mid;
    }
    else {
      return mid;
    }
  }

  return -1;
};
