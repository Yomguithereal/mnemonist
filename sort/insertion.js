/**
 * Mnemonist Insertion Sort
 * =========================
 *
 * Insertion sort related functions.
 */
function inplaceInsertionSort(array, lo, hi) {
  i = lo + 1;

  var j, k;

  for (; i < hi; i++) {
    k = array[i];
    j = i - 1;

    while (j >= 0 && array[j] > k) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = k;
  }

  return array;
}

exports.inplaceInsertionSort = inplaceInsertionSort;

function inplaceInsertionSortIndices(array, indices, lo, hi) {
  i = lo + 1;

  var j, k;

  for (; i < hi; i++) {
    k = array[indices[i]];
    j = i - 1;

    while (j >= 0 && array[indices[j]] > k) {
      indices[j + 1] = indices[j];
      j--;
    }

    indices[j + 1] = i;
  }

  return indices;
}

exports.inplaceInsertionSortIndices = inplaceInsertionSortIndices;
