var words = require('../critbit/words.json');
var PassjoinIndex = require('../../passjoin-index.js');
var leven = require('leven');
var sample = require('pandemonium/dangerous-but-performant-sample');
var assert = require('assert');

var N = 200;
var W = words.length;

var SAMPLE = sample(N, words);
var EXPECTED = new Array(N);
var ACTUAL = new Array(N);

function sanityTest(k) {
  console.log('Running sanity test for k =', k);

  var M, i, j, query, candidate;

  console.time('linear');

  for (i = 0; i < N; i++) {
    M = new Set();
    query = SAMPLE[i];

    for (j = 0; j < W; j++) {
      candidate = words[j];

      if (leven(candidate, query) <= k)
        M.add(candidate);
    }

    EXPECTED[i] = M;
  }

  console.timeEnd('linear');

  console.time('indexation');

  var index = new PassjoinIndex(leven, k);

  for (j = 0; j < W; j++)
    index.add(words[j]);

  console.timeEnd('indexation');

  console.time('query');
  for (i = 0; i < N; i++) {
    query = SAMPLE[i];
    ACTUAL[i] = index.search(query);
  }
  console.timeEnd('query');

  // Sanity
  ACTUAL.forEach(function(_, i) {
    assert.deepStrictEqual(ACTUAL[i], EXPECTED[i]);
  });

  console.log();
}

sanityTest(1);
sanityTest(2);
sanityTest(3);
sanityTest(4);
sanityTest(5);
