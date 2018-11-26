/* eslint no-constant-condition: 0 */
/**
 * Mnemonist Hashtable Helpers
 * ============================
 *
 * Miscellaneous helpers helper function dealing with hashtables.
 */
function jenkins32bits(a) {

  a = (a + 0x7ed55d16) + (a << 12);
  a = (a ^ 0xc761c23c) ^ (a >> 19);
  a = (a + 0x165667b1) + (a << 5);
  a = (a + 0xd3a2646c) ^ (a << 9);
  a = (a + 0xfd7046c5) + (a << 3);
  a = (a ^ 0xb55a4f09) ^ (a >> 16);

  return a;
}

function linearProbingGet(h, keys, values, key) {
  var n = keys.length,
      j = h(key) & (n - 1),
      i = j;

  var c;

  while (true) {
    c = keys[i];

    if (c === key)
      return values[i];

    else if (c === 0 || typeof c === 'undefined')
      return;

    // Handling wrapping around
    i += 1;
    i %= n;

    // Full turn
    if (i === j)
      return;
  }
}

function linearProbingSet(h, keys, values, key, value) {
  var n = keys.length,
      j = h(key) & (n - 1),
      i = j;

  var c;

  while (true) {
    c = keys[i];

    if (c === 0 || typeof c === 'undefined' || c === key)
      break;

    // Handling wrapping around
    i += 1;
    i %= n;

    // Full turn
    if (i === j)
      throw new Error('mnemonist/utils/hash-tables.linearProbingSet: table is full.');
  }

  keys[i] = key;
  values[i] = value;
}

module.exports = {
  hashes: {
    jenkins32bits: jenkins32bits
  },
  linearProbing: {
    get: linearProbingGet,
    set: linearProbingSet
  }
};
