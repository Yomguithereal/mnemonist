var KDTree = require('../../kd-tree.js');

var N = 100000 * 5;
var KNNS = [1, 5, 10, 20, 100, 1000, 10000];
var KNN_TESTS = 100;

var i;

var AXES = [new Float64Array(N), new Float64Array(N)];

for (i = 0; i < N; i++) {
  AXES[0][i] = Math.random();
  AXES[1][i] = Math.random();
}

console.time('build');
var tree = KDTree.fromAxes(AXES);
console.timeEnd('build');

function benchKnn(knn) {
  console.log();
  console.log('Testing KNN for', knn);

  console.time('knn');
  for (i = 0; i < KNN_TESTS; i++)
    tree.kNearestNeighbors(knn, [Math.random(), Math.random()]);
  console.timeEnd('knn');

  console.time('linear');
  for (i = 0; i < KNN_TESTS; i++)
    tree.linearKNearestNeighbors(knn, [Math.random(), Math.random()]);
  console.timeEnd('linear');
}

KNNS.forEach(benchKnn);
