var KDTree = require('../../kd-tree.js');
var createStaticKDTree = require('static-kdtree');

var N = 100000 * 5;
var KNNS = [1, 5, 10, 20, 100, 1000, 10000, N - 100];
var KNN_TESTS = 100;

var i;

var AXES = [new Float64Array(N), new Float64Array(N)];
var POINTS = new Array(N);

for (i = 0; i < N; i++) {
  AXES[0][i] = Math.random();
  AXES[1][i] = Math.random();
  POINTS[i] = [AXES[0][i], AXES[1][i]];
}

console.time('build');
var tree = KDTree.fromAxes(AXES);
console.timeEnd('build');

console.time('build static-kdtree');
var staticTree = createStaticKDTree(POINTS);
console.timeEnd('build static-kdtree');

function benchKnn(knn) {
  console.log();
  console.log('Testing KNN for', knn);

  console.time('knn');
  for (i = 0; i < KNN_TESTS; i++)
    tree.kNearestNeighbors(knn, [Math.random(), Math.random()]);
  console.timeEnd('knn');

  console.time('knn static-kdtree');
  for (i = 0; i < KNN_TESTS; i++)
    staticTree.knn([Math.random(), Math.random()], knn);
  console.timeEnd('knn static-kdtree');

  console.time('linear');
  for (i = 0; i < KNN_TESTS; i++)
    tree.linearKNearestNeighbors(knn, [Math.random(), Math.random()]);
  console.timeEnd('linear');
}

KNNS.forEach(benchKnn);
