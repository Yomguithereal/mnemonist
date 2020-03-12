/**
 * Mnemonist Sort Helpers Unit Tests
 * ==================================
 */
var assert = require('assert');

var typed = require('../utils/typed-arrays.js');
var insertion = require('../sort/insertion.js');
var quick = require('../sort/quick.js');

var DATA = [2, 7, 1, 5, 8, 9, 1, -3, 3, 18, 6];

function isIncreasing(array) {
  return array.every(function(e, i) {
    if (!i)
      return true;

    return e > array[i - 1];
  });
}

function isIncreasingIndices(array, indices) {
  return indices.every(function(e, i) {
    if (!i)
      return true;

    return array[e] > array[indices[i - 1]];
  });
}

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

    it('sanity test.', function() {
      var data = Array.from(new Array(1000), function() {
        return Math.random();
      });

      insertion.inplaceInsertionSort(data, 0, data.length);

      assert(isIncreasing(data), 'Array should be in increasing order');
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

    it('indices sanity test.', function() {
      var data = Array.from(new Array(1000), function() {
        return Math.random();
      });

      var indices = insertion.inplaceInsertionSortIndices(data, typed.indices(data.length), 0, data.length);

      assert(isIncreasingIndices(data, indices), 'Array should be in increasing order');
    });
  });

  describe('quick', function() {
    it('should properly sort inplace.', function() {

      var data = quick.inplaceQuickSort(DATA.slice(), 0, DATA.length);

      assert.deepEqual(data, [-3, 1, 1, 2, 3, 5, 6, 7, 8, 9, 18]);
    });

    it('should properly sort only a slice.', function() {
      var data = quick.inplaceQuickSort(DATA.slice(), 0, 3);

      assert.deepEqual(data, [1, 2, 7, 5, 8, 9, 1, -3, 3, 18, 6]);

      data = quick.inplaceQuickSort(DATA.slice(), 3, 7);

      assert.deepEqual(data, [2, 7, 1, 1, 5, 8, 9, -3, 3, 18, 6]);

      data = quick.inplaceQuickSort(DATA.slice(), 5, 11);

      assert.deepEqual(data, [2, 7, 1, 5, 8, -3, 1, 3, 6, 9, 18]);
    });

    it('sanity test.', function() {
      var data = Array.from(new Array(1000), function() {
        return Math.random();
      });

      quick.inplaceQuickSort(data, 0, data.length);

      assert(isIncreasing(data), 'Array should be in increasing order');
    });

    it('should properly sort indices inplace.', function() {

      var indices = quick.inplaceQuickSortIndices(DATA.slice(), typed.indices(DATA.length), 0, DATA.length);

      assert.deepEqual(Array.from(indices), [7, 6, 2, 0, 8, 3, 10, 1, 4, 5, 9]);
    });

    it('should properly sort only a slice of indices.', function() {
      var indices = quick.inplaceQuickSortIndices(DATA.slice(), typed.indices(DATA.length), 0, 3);

      assert.deepEqual(Array.from(indices), [2, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10]);

      indices = quick.inplaceQuickSortIndices(DATA.slice(), typed.indices(DATA.length), 3, 7);

      assert.deepEqual(Array.from(indices), [0, 1, 2, 6, 3, 4, 5, 7, 8, 9, 10]);

      indices = quick.inplaceQuickSortIndices(DATA.slice(), typed.indices(DATA.length), 5, 11);

      assert.deepEqual(Array.from(indices), [0, 1, 2, 3, 4, 7, 6, 8, 10, 5, 9]);
    });

    it('indices sanity test.', function() {
      var data = Array.from(new Array(1000), function() {
        return Math.random();
      });

      var indices = quick.inplaceQuickSortIndices(data, typed.indices(data.length), 0, data.length);

      assert(isIncreasingIndices(data, indices), 'Array should be in increasing order');
    });
  });
});
