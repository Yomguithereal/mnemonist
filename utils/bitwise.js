/**
 * Mnemonist Bitwise Helpers
 * ==========================
 *
 * Miscellaneous helpers helping with bitwise operations.
 */

/**
 * Takes a max 32bits integer and returns its population count (number of 1 of
 * the binary representation).
 *
 * @param  {number} x - Target number.
 * @return {number}
 */
exports.popcount = function(x) {
  x -= x >> 1 & 0x55555555;
  x = (x & 0x33333333) + (x >> 2 & 0x33333333);
  x = x + (x >> 4) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
};

/**
 * Slightly faster popcount function based on a precomputed table of 8bits
 * words.
 *
 * @param  {number} x - Target number.
 * @return {number}
 */
var TABLE8 = new Uint8Array(Math.pow(2, 8));

for (var i = 0, l = TABLE8.length; i < l; i++)
  TABLE8[i] = exports.popcount(i);

exports.table8Popcount = function(x) {
  return (
    TABLE8[x & 0xff] +
    TABLE8[(x >> 8) & 0xff] +
    TABLE8[(x >> 16) & 0xff] +
    TABLE8[(x >> 24) & 0xff]
  );
};
