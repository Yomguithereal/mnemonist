/**
 * Mnemonist Insertion Sort
 * =========================
 *
 * Insertion sort related functions.
 */
function inplaceInsertionSort(array, i, l) {
  i++;

  var j, k;

  for (; i < l; i++) {
    k = array[i];
    j = i - 1;

    while (j >= 0 && array[j] > k) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = k;
  }
}

exports.inplaceInsertionSort = inplaceInsertionSort;
