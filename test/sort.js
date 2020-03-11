/**
 * Mnemonist Sort Helpers Unit Tests
 * ==================================
 */
var assert = require('assert');

var insertion = require('../sort/insertion.js');

var DATA = [2, 7, 1, 5, 8, 9, 1, -3, 3, 18, 6];

describe('Sort helpers', function() {
  describe('insertion', function() {

    it('should properly sort inplace.', function() {

      var data = insertion.inplaceInsertionSort(DATA.slice(), 0, DATA.length);

      assert.deepEqual(data, [-3, 1, 1, 2, 3, 5, 6, 7, 8, 9, 18]);
    });

    it('should properly sort only a slice.', function() {
      var data = insertion.inplaceInsertionSort(DATA.slice(), 0, 3);

      assert.deepEqual(data, [1, 2, 7, 5, 8, 9, 1, -3, 3, 18, 6]);

      data = insertion.inplaceInsertionSort(DATA.slice(), 3, 7);

      assert.deepEqual(data, [2, 7, 1, 1, 5, 8, 9, -3, 3, 18, 6]);

      data = insertion.inplaceInsertionSort(DATA.slice(), 5, 11);

      assert.deepEqual(data, [-3, 2, 7, 1, 1, 3, 5, 6, 8, 9, 18]);
    });
  });
});
