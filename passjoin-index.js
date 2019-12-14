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
 * Function returning a fraction of the Levenshtein distance between two strings
 * with heuristics leveraging the fact that we know their lengths and which of
 * their selected substrings matched.
 *
 * @note Ported from: https://github.com/lispc/EditDistanceClusterer/blob/master/src/edu/tsinghua/dbgroup/EditDistanceJoiner.java
 *
 * @param   {string} s1        - First string.
 * @param   {number} start1    - Start in first string.
 * @param   {number} l1        - Length of first string segment.
 * @param   {string} s2        - Secong string.
 * @param   {number} start2    - Start in second string.
 * @param   {number} l2        - Length of second string segment.
 * @param   {number} threshold - Distance threshold.
 * @param   {Array}  buffer    - Distance computations buffer.
 * @returns {number}
 */
function levenshteinWithThreshold(s1, start1, l1, s2, start2, l2, threshold, buffer) {
  if (threshold < 0)
    return 0;

  var sub1, sub2;

  if (threshold === 0) {
    sub1 = s1.slice(start1, start1 + l1);
    sub2 = s2.slice(start2, start2 + l2);

    return sub1 === sub2 ? 0 : 1;
  }

  if (l1 === 0)
    return l2;

  if (l2 === 0)
    return l1;

  var i, j, t;

  var start,
      end;

  var earlyTermination = true;

  for (j = 1; j <= l1; j++) {
    start = Math.max(j - threshold, 1);
    end = Math.min(l2, j + threshold);

    t = j - threshold - 1;

    if (t >= 1)
      buffer[t][j] = threshold + 1;

    for (i = start; i <= end; i++) {
      if (s1[start1 + j - 1] === s2[start2 + i - 1]) {
        buffer[i][j] = buffer[i - 1][j - 1];
      }
      else {
        buffer[i][j] = Math.min(
          buffer[i - 1][j - 1],
          buffer[i - 1][j],
          buffer[i][j - 1]
        ) + 1;
      }
    }

    if (end < l2)
      buffer[end + 1][j] = threshold + 1;

    earlyTermination = true;
    for (i = start; i <= end; i++) {
      if (buffer[i][j] <= threshold) {
        earlyTermination = false;
        break;
      }
    }

    if (earlyTermination)
      return threshold + 1;
  }

  return buffer[l2][l1];
}

/**
 * Function returning the Levenshtein distance between two strings using
 * heuristics leveraging the fact that we know their lengths and which of
 * their selected substrings matched. Will return -1 if the strings cannot
 * match because their distance is over a threshold `k`.
 *
 * @note Ported from: https://github.com/lispc/EditDistanceClusterer/blob/master/src/edu/tsinghua/dbgroup/EditDistanceJoiner.java
 *
 * @param   {number} k      - Edit distance threshold.
 * @param   {string} s1     - First string.
 * @param   {string} s2     - Second string.
 * @param   {number} pi1    - Position of match in first string.
 * @param   {number} pi2    - Position of match in second string.
 * @param   {number} li     - Length of matched segment.
 * @param   {Array}  buffer - Distance computations buffer.
 * @returns {number}
 */
function levenshteinDistanceForCandidate(k, i, s1, s2, pi1, pi2, li, buffer) {
  var l1 = s1.length - pi1 - li,
      l2 = s2.length - pi2 - li;

  var leftThreshold = Math.min(k - Math.abs(l1 - l2), i);

  var leftDistance = levenshteinWithThreshold(
    s1, 0, pi1,
    s2, 0, pi2,
    leftThreshold,
    buffer
  );

  if (leftDistance > leftThreshold)
    return -1;

  var rightThreshold = Math.min(k - leftDistance, k + 1 - (i - 1));

  if (rightThreshold < 0)
    return leftDistance;

  var rightDistance = levenshteinWithThreshold(
    s1, pi1 + li, l1,
    s2, pi2 + li, l2,
    rightThreshold,
    buffer
  );

  if (rightDistance > rightThreshold)
    return -1;

  return leftDistance + rightDistance;
}

/**
 * PassjoinIndex.
 *
 * @constructor
 */
function PassjoinIndex(k) {
  if (typeof k !== 'number' || k < 1)
    throw new Error('mnemonist/passjoin-index: `k` should be a number > 0');

  this.k = k;

  var max = 1000;
  this.buffer = new Array(max);

  for (var i = 0; i < max; i++)
    this.buffer[i] = new Float64Array(max);

  for (var i = 0; i < max; i++) {
    this.buffer[0][i] = i;
    this.buffer[i][0] = i;
  }

  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
PassjoinIndex.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.strings = [];
  this.invertedIndices = {};
};

/**
 * Method used to add a new value to the index.
 *
 * @param  {string|Array} value - Value to add.
 * @return {PassjoinIndex}
 */
PassjoinIndex.prototype.add = function(value) {
  var l = value.length;

  var stringIndex = this.size;

  this.strings.push(value);
  this.size++;

  var S = segments(this.k, value);

  var Ll = this.invertedIndices[l];

  if (typeof Ll === 'undefined') {
    Ll = {};
    this.invertedIndices[l] = Ll;
  }

  var segment,
      matches,
      key,
      i,
      m;

  for (i = 0, m = S.length; i < m; i++) {
    segment = S[i];
    key = segment + i;
    matches = Ll[key];

    if (typeof matches === 'undefined') {
      matches = [stringIndex];
      Ll[key] = matches;
    }
    else {
      matches.push(stringIndex);
    }
  }

  return this;
};

/**
 * Method used to search for string matching the given query.
 *
 * @param  {string|Array} query - Query string.
 * @return {Array}
 */
PassjoinIndex.prototype.search = function(query) {
  var s = query.length,
      k = this.k;

  var M = new Set();

  var candidates,
      candidate,
      key,
      S,
      P,
      l,
      m,
      i,
      pi2,
      n1,
      j,
      n2,
      y,
      n3;

  // TODO: factorize P[i][0]
  for (l = Math.max(0, s - k), m = s + k + 1; l < m; l++) {
    var Ll = this.invertedIndices[l];

    if (typeof Ll === 'undefined')
      continue;

    P = partition(k, l);

    for (i = 0, n1 = P.length; i < n1; i++) {
      S = multiMatchAwareSubstrings(k, query, l, i, P[i][0], P[i][1]);

      // Empty string edge case
      if (!S.length)
        S = [''];

      pi2 = 0;
      for (j = 0, n2 = S.length; j < n2; j++) {
        key = S[j] + i;
        candidates = Ll[key];

        if (typeof candidates === 'undefined')
          continue;

        for (y = 0, n3 = candidates.length; y < n3; y++) {
          candidate = this.strings[candidates[y]];

          // NOTE: first condition is here not to compute Levenshtein
          // distance for tiny strings
          if (
            s <= k && l <= k ||
            (
              !M.has(candidate) &&
              (
                query === candidate ||
                levenshteinDistanceForCandidate(
                  this.k,
                  i,
                  query,
                  candidate,
                  P[i][0],
                  pi2,
                  P[i][1],
                  this.buffer
                ) !== -1
              )
            )
          )
            M.add(candidate);
        }

        pi2 += S[j].length;
      }
    }
  }

  return M;
};

/**
 * Convenience known methods.
 */
PassjoinIndex.prototype.inspect = function() {
  var array = this.strings.slice();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: PassjoinIndex,
    enumerable: false
  });

  return array;
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
PassjoinIndex.levenshteinDistanceForCandidate = levenshteinDistanceForCandidate;

module.exports = PassjoinIndex;
