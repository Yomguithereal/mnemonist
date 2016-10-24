/**
 * Mnemonist Heap Comparators
 * ===========================
 *
 * Default comparators & functions dealing with comparators reversing etc.
 */
var DEFAULT_COMPARATOR = function(a, b) {
  if (a < b)
    return -1;
  if (a > b)
    return 1;

  return 0;
};

/**
 * Function used to reverse a comparator.
 */
function reverseComparator(comparator) {
  return function(a, b) {
    return comparator(b, a);
  };
}

var DEFAULT_REVERSED_COMPARATOR = reverseComparator(DEFAULT_COMPARATOR);

/**
 * Exporting.
 */
exports.DEFAULT_COMPARATOR = DEFAULT_COMPARATOR;
exports.DEFAULT_REVERSED_COMPARATOR = DEFAULT_REVERSED_COMPARATOR;
