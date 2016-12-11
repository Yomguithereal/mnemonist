/**
 * Mnemonist Suffix Array
 * =======================
 *
 * Linear time implementation of a suffix array using the recursive
 * method by Karkkainen and Sanders.
 *
 * [References]:
 * https://www.cs.helsinki.fi/u/tpkarkka/publications/jacm05-revised.pdf
 * http://people.mpi-inf.mpg.de/~sanders/programs/suffix/
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.184.442&rep=rep1&type=pdf
 *
 * [Article]:
 * "Simple Linear Work Suffix Array Construction", Karkkainen and Sanders.
 *
 * [Note]:
 * A paper by Simon J. Puglisi, William F. Smyth & Andrew Turpin named
 * "The Performance of Linear Time Suffix Sorting Algorithms" seems to
 * prove that supralinear algorithm are in fact better faring for
 * "real" world use cases. It would be nice to check this out in JavaScript
 * because the high level of the language could change a lot to the fact.
 *
 * The current code is largely inspired by the following:
 * https://github.com/tixxit/suffixarray/blob/master/suffixarray.js
 */

// TODO: docs

// TODO: optimize sort not to use key function
function sort(array, key) {
  var l = array.length,
      buckets = [],
      i = l,
      j = -1,
      b,
      d = 0,
      bits;

  while (i--)
    j = Math.max(key(array[i]), j);

  bits = j >> 24 && 32 || j >> 16 && 24 || j >> 8 && 16 || 8;

  for (; d < bits; d += 4) {
    for (i = 16; i--;)
      buckets[i] = [];
    for (i = l; i--;)
      buckets[(key(array[i]) >> d) & 15].push(array[i]);
    for (b = 0; b < 16; b++) {
      for (j = buckets[b].length; j--;)
        array[++i] = buckets[b][j];
    }
  }
}

function compare(string, lookup, m, n) {
  return (
    (string[m] - string[n]) ||
    (m % 3 === 2 ?
      (string[m + 1] - string[n + 1]) || (lookup[m + 2] - lookup[n + 2]) :
      (lookup[m + 1] - lookup[n + 1]))
  );
}

function build(string, l) {
  var a = [],
      b = [],
      al = (2 * l / 3) | 0,
      bl = l - al,
      r = (al + 1) >> 1,
      i = al,
      j = 0,
      k,
      lookup = [],
      result = [];

  if (l === 1)
    return [0];

  while (i--)
    a[i] = ((i * 3) >> 1) + 1;

  for (i = 3; i--;)
    sort(a, function(j) {
      return string[i + j];
    });

  j = b[((a[0] / 3) | 0) + (a[0] % 3 === 1 ? 0 : r)] = 1;

  for (i = 1; i < al; i++) {
    if (string[a[i]] !== string[a[i - 1]] ||
        string[a[i] + 1] !== string[a[i - 1] + 1] ||
        string[a[i] + 2] !== string[a[i - 1] + 2])
      j++;

    b[((a[i] / 3) | 0) + (a[i] % 3 === 1 ? 0 : r)] = j;
  }

  if (j < al) {
    b = build(b, al);

    for (i = al; i--;)
      a[i] = b[i] < r ? b[i] * 3 + 1 : ((b[i] - r) * 3 + 2);
  }

  for (i = al; i--;)
    lookup[a[i]] = i;
  lookup[l] = -1;
  lookup[l + 1] = -2;

  b = l % 3 === 1 ? [l - 1] : [];

  for (i = 0; i < al; i++) {
    if (a[i] % 3 === 1)
      b.push(a[i] - 1);
  }

  sort(b, function(j) {
    return string[j];
  });

  for (i = 0, j = 0, k = 0; i < al && j < bl;)
    result[k++] = (
      compare(string, lookup, a[i], b[j]) < 0 ?
        a[i++] :
        b[j++]
    );

  while (i < al)
    result[k++] = a[i++];

  while (j < bl)
    result[k++] = b[j++];

  return result;
}

// TODO: possibility to pass alphabet
function SuffixArray(string) {

  // Properties
  this.string = string;
  this.length = string.length;

  // Creating the alphabet array
  var paddingOffset = this.length % 3,
      array = new Array(this.length + paddingOffset),
      l,
      i;

  // If we have an arbitrary sequence, we need to transform it
  if (typeof string !== 'string') {
    var uniqueTokens = Object.create(null);

    for (i = 0; i < this.length; i++) {
      if (!uniqueTokens[string[i]])
        uniqueTokens[string[i]] = true;
    }

    var alphabet = Object.create(null),
        sortedUniqueTokens = Object.keys(uniqueTokens).sort();

    for (i = 0, l = sortedUniqueTokens.length; i < l; i++)
      alphabet[sortedUniqueTokens[i]] = i + 1;

    for (i = 0; i < this.length; i++) {
      array[i] = alphabet[string[i]];
    }
  }
  else {
    for (i = 0; i < this.length; i++)
      array[i] = string.charCodeAt(i);
  }

  // Padding the array
  for (; i < paddingOffset; i++)
    array[i] = 0;

  // Building the array
  this.array = build(array, this.length);
}

/**
 * Convenience known methods.
 */
SuffixArray.prototype.inspect = function() {
  var array = new Array(this.length);

  for (var i = 0; i < this.length; i++)
    array[i] = this.string.slice(this.array[i]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: SuffixArray,
    enumerable: false
  });

  return array;
};

module.exports = SuffixArray;
