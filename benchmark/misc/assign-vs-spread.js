var randomString = require('pandemonium/random-string');
var choice = require('pandemonium/choice');

var N = 10000;
var K = 100;
var S = 50;

var OBJECTS = new Array(N);
var KEYS = new Array(K);

var i, j, o;

for (i = 0; i < K; i++)
  KEYS[i] = randomString(5, 15);

for (i = 0; i < N; i++) {
  o = {};

  for (j = 0; j < S; j++)
    o[choice(KEYS)] = Math.random();

  OBJECTS[i] = o;
}

var o1, o2, o3;

console.time('assign');
for (i = 0; i < N; i++) {
  o1 = choice(OBJECTS);
  o2 = choice(OBJECTS);

  o3 = Object.assign({}, o1, o2);
}
console.timeEnd('assign');

console.time('spread');
for (i = 0; i < N; i++) {
  o1 = choice(OBJECTS);
  o2 = choice(OBJECTS);

  o3 = {
    ...o1,
    ...o2
  };
}
console.timeEnd('spread');
