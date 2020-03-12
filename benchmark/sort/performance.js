var typed = require('../../utils/typed-arrays.js');
var inplaceQuickSortIndices = require('../../sort/quick.js').inplaceQuickSortIndices;

function cmp(indices) {
  return function(a, b) {
    a = indices[a];
    b = indices[b];

    if (a < b)
      return -1;

    if (a > b)
      return 1;

    return 0;
  };
}

var N = 1000000;
var DATA = new Float64Array(N);

var i, copy;

for (i = 0; i < N; i++)
  DATA[i] = Math.random();

var INDICES = typed.indices(N);

var copy = INDICES.slice();

console.time('sort');
copy.sort(cmp);
console.timeEnd('sort');

console.time('quick');
inplaceQuickSortIndices(DATA, INDICES, 0, DATA.length);
console.timeEnd('quick');
