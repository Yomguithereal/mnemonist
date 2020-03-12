/**
 * Mnemonist Sort Helpers Unit Tests
 * ==================================
 */
var assert = require('assert');

var typed = require('../utils/typed-arrays.js');
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

      assert.deepEqual(data, [2, 7, 1, 5, 8, -3, 1, 3, 6, 9, 18]);
    });

    it('should properly sort indices inplace.', function() {

      var indices = insertion.inplaceInsertionSortIndices(DATA.slice(), typed.indices(DATA.length), 0, DATA.length);

      assert.deepEqual(Array.from(indices), [7, 2, 6, 0, 8, 3, 10, 1, 4, 5, 9]);
    });

    it('should properly sort only a slice of indices.', function() {
      var indices = insertion.inplaceInsertionSortIndices(DATA.slice(), typed.indices(DATA.length), 0, 3);

      assert.deepEqual(Array.from(indices), [2, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10]);

      indices = insertion.inplaceInsertionSortIndices(DATA.slice(), typed.indices(DATA.length), 3, 7);

      assert.deepEqual(Array.from(indices), [0, 1, 2, 6, 3, 4, 5, 7, 8, 9, 10]);

      indices = insertion.inplaceInsertionSortIndices(DATA.slice(), typed.indices(DATA.length), 5, 11);

      assert.deepEqual(Array.from(indices), [0, 1, 2, 3, 4, 7, 6, 8, 10, 5, 9]);
    });
  });
});
