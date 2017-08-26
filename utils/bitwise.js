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
