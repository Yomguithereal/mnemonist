/**
 * Mnemonist PassjoinIndex
 * ========================
 *
 * The PassjoinIndex is an index leveraging the "passjoin" algorithm as a mean
 * to index strings for Levenshtein distance queries. It features a complexity
 * related to the Levenhstein query threshold k rather than the number of
 * strings to test (roughly O(k^3)).
 *
 * [References]:
 * Jiang, Yu, Dong Deng, Jiannan Wang, Guoliang Li, et Jianhua Feng.
 * « Efficient Parallel Partition-Based Algorithms for Similarity Search and Join
 * with Edit Distance Constraints ». In Proceedings of the Joint EDBT/ICDT 2013
 * Workshops on - EDBT ’13, 341. Genoa, Italy: ACM Press, 2013.
 * https://doi.org/10.1145/2457317.2457382.
 *
 * Li, Guoliang, Dong Deng, et Jianhua Feng. « A Partition-Based Method for
 * String Similarity Joins with Edit-Distance Constraints ». ACM Transactions on
 * Database Systems 38, no 2 (1 juin 2013): 1‑33.
 * https://doi.org/10.1145/2487259.2487261.
 *
 * [Urls]:
 * http://people.csail.mit.edu/dongdeng/projects/passjoin/index.html
 */
// var forEach = require('obliterator/foreach');

/**
 * Helpers.
 */

/**
 * Function returning the number of substrings that will be selected by the
 * multi-match-aware selection scheme for theshold `k`, for a string of length
 * `s` to match strings of length `l`.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} s - Length of target strings.
 * @param   {number} l - Length of strings to match.
 * @returns {number}   - The number of selected substrings.
 */
function countSubstringsL(k, s, l) {
  return (((Math.pow(k, 2) - Math.pow(Math.abs(s - l), 2)) / 2) | 0) + k + 1;
}

/**
 * Function returning the minimum number of substrings that will be selected by
 * the multi-match-aware selection scheme for theshold `k`, for a string of
 * length `s` to match any string of relevant length.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} s - Length of target strings.
 * @returns {number}   - The number of selected substrings.
 */
function countKeys(k, s) {
  var c = 0;

  for (var l = 0, m = s + 1; l < m; l++)
    c += countSubstringsL(k, s, l);

  return c;
}

/**
 * Function used to compare two keys in order to sort them first by decreasing
 * length and then alphabetically as per the "4.2 Effective Indexing Strategy"
 * point of the paper.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} s - Length of target strings.
 * @returns {number}   - The number of selected substrings.
 */
function comparator(a, b) {
  if (a.length > b.length)
    return -1;
  if (a.length < b.length)
    return 1;

  if (a < b)
    return -1;
  if (a > b)
    return 1;

  return 0;
}

/**
 * Function partitioning a string into k + 1 uneven segments, the shorter
 * ones, then the longer ones.
 *
 * @param   {number} k - Levenshtein distance threshold.
 * @param   {number} l - Length of the string.
 * @returns {Array}    - The partition tuples (start, length).
 */
function partition(k, l) {
  var m = k + 1,
      a = (l / m) | 0,
      b = a + 1,
      i,
      j;

  var largeSegments = l - a * m,
      smallSegments = m - largeSegments;

  var tuples = new Array(k + 1);

  for (i = 0; i < smallSegments; i++)
    tuples[i] = [i * a, a];

  var offset = (i - 1) * a + a;

  for (j = 0; j < largeSegments; j++)
    tuples[i + j] = [offset + j * b, b];

  return tuples;
}

/**
 * Function yielding a string's k + 1 passjoin segments to index.
 *
 * @param   {number} k      - Levenshtein distance threshold.
 * @param   {string} string - Target string.
 * @returns {Array}         - The string's segments.
 */

// TODO: optimize!
function segments(k, string) {
  var i, l = k + 1;

  var P = partition(k, string.length);

  var S = new Array(l);

  for (i = 0; i < l; i++)
    S[i] = string.slice(P[i][0], P[i][0] + P[i][1]);

  return S;
}

/**
 * Function returning the interval of relevant substrings to lookup using the
 * multi-match-aware substring selection scheme described in the paper.
 *
 * @param   {number} k      - Levenshtein distance threshold.
 * @param   {number} delta  - Signed length difference between both considered strings.
 * @param   {number} i      - k + 1 segment index.
 * @param   {number} s      - String's length.
 * @param   {number} pi     - k + 1 segment position in target string.
 * @param   {number} li     - k + 1 segment length.
 * @returns {Array}         - The interval (start, stop).
 */
function multiMatchAwareInterval(k, delta, i, s, pi, li) {
  var start1 = pi - i,
      end1 = pi + i;

  var o = k - i;

  var start2 = pi + delta - o,
      end2 = pi + delta + o;

  var end3 = s - li;

  return [Math.max(0, start1, start2), Math.min(end1, end2, end3)];
}

/**
 * Function yielding relevant substrings to lookup using the multi-match-aware
 * substring selection scheme described in the paper.
 *
 * @param   {number} k      - Levenshtein distance threshold.
 * @param   {string} string  - Target string.
 * @param   {number} l      - Length of strings to match.
 * @param   {number} i      - k + 1 segment index.
 * @param   {number} pi     - k + 1 segment position in target string.
 * @param   {number} li     - k + 1 segment length.
 * @returns {Array}         - The contiguous substrings.
 */
function multiMatchAwareSubstrings(k, string, l, i, pi, li) {
  var s = string.length;

  // Note that we need to keep the non-absolute delta for this function
  // to work in both directions, up & down
  var delta = s - l;

  var interval = multiMatchAwareInterval(k, delta, i, s, pi, li);

  var start = interval[0],
      stop = interval[1];

  var currentSubstring = '';

  var substrings = [];

  var substring, j, m;

  for (j = start, m = stop + 1; j < m; j++) {
    substring = string.slice(j, j + li);

    // We skip identical consecutive substrings (to avoid repetition in case
    // of contiguous letter duplication)
    if (substring === currentSubstring)
      continue;

    substrings.push(substring);

    currentSubstring = substring;
  }

  return substrings;
}

/**
 * PassjoinIndex.
 *
 * @constructor
 */
function PassjoinIndex() {
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
PassjoinIndex.prototype.clear = function() {

  // Properties
};

/**
 * Convenience known methods.
 */
PassjoinIndex.prototype.inspect = function() {
  return this;
};

if (typeof Symbol !== 'undefined')
  PassjoinIndex.prototype[Symbol.for('nodejs.util.inspect.custom')] = PassjoinIndex.prototype.inspect;

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {PassjoinIndex}
 */
// PassjoinIndex.from = function(iterable) {

// };

/**
 * Exporting.
 */
PassjoinIndex.countKeys = countKeys;
PassjoinIndex.comparator = comparator;
PassjoinIndex.partition = partition;
PassjoinIndex.segments = segments;
PassjoinIndex.multiMatchAwareInterval = multiMatchAwareInterval;
PassjoinIndex.multiMatchAwareSubstrings = multiMatchAwareSubstrings;

module.exports = PassjoinIndex;
