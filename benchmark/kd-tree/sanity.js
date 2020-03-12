var KDTree = require('../../kd-tree.js');
var assert = require('assert');

var N = 100000;

var i;

var AXES = [new Float64Array(N), new Float64Array(N)];

for (i = 0; i < N; i++) {
  AXES[0][i] = Math.random();
  AXES[1][i] = Math.random();
}

var tree = KDTree.fromAxes(AXES);

for (i = 0; i < N; i++)
  assert.strictEqual(tree.nearestNeighbor([AXES[0][i], AXES[1][i]]), i);

var KNN = 10;
var KNN_TESTS = 1000;
var P;

for (i = 0; i < KNN_TESTS; i++) {
  P = [Math.random(), Math.random()];
  assert.deepEqual(new Set(tree.kNearestNeighbors(KNN, P)), new Set(tree.linearKNearestNeighbors(KNN, P)));
}

var totalVisited = 0;

for (i = 0; i < N; i++) {
  tree.nearestNeighbor([AXES[0][i], AXES[1][i]]);
  totalVisited += tree.visited;
}

console.log('For nn:');
console.log('Visited nodes avg.', totalVisited / N);
console.log('log2', Math.log2(N));
console.log();

totalVisited = 0;

for (i = 0; i < KNN_TESTS; i++) {
  tree.kNearestNeighbors(KNN, [AXES[0][i], AXES[1][i]]);
  totalVisited += tree.visited;
}

console.log('For knn:');
console.log('Visited nodes avg.', totalVisited / KNN_TESTS);
console.log('log2', Math.log2(N));
