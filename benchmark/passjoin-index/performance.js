var words = require('../critbit/words.json');
var PassjoinIndex = require('../../passjoin-index.js');
var SymSpell = require('../../symspell');
var BKTree = require('../../bk-tree');
var VPTree = require('../../vp-tree');
var leven = require('leven');
var seedrandom = require('seedrandom');
var createSample = require('pandemonium/dangerous-but-performant-sample').createDangerousButPerformantSample;

var SEED = 'Levenshtein';

var sample = createSample(seedrandom(SEED));

var N = 200;
var W = words.length;

console.log(W + ' words indexed');
console.log();

var SAMPLE = sample(N, words);
var EXPECTED = new Array(N);
var ACTUAL = new Array(N);

function bench(k) {
  console.log('Running bench for k =', k);

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

  //---

  console.time('PassjoinIndex::indexation');

  var index = new PassjoinIndex(leven, k);

  for (j = 0; j < W; j++)
    index.add(words[j]);

  console.timeEnd('PassjoinIndex::indexation');

  console.time('PassjoinIndex::query');
  for (i = 0; i < N; i++) {
    query = SAMPLE[i];
    ACTUAL[i] = index.search(query);
  }
  console.timeEnd('PassjoinIndex::query');

  //---

  console.time('BKTree::indexation');

  var index = BKTree.from(words, leven);

  console.timeEnd('BKTree::indexation');

  console.time('BKTree::query');
  for (i = 0; i < N; i++) {
    query = SAMPLE[i];
    ACTUAL[i] = index.search(k, query);
  }
  console.timeEnd('BKTree::query');

  //---

  console.time('VPTree::indexation');

  var index = VPTree.from(words, leven);

  console.timeEnd('VPTree::indexation');

  console.time('VPTree::query');
  for (i = 0; i < N; i++) {
    query = SAMPLE[i];
    ACTUAL[i] = index.neighbors(k, query);
  }
  console.timeEnd('VPTree::query');

  //---

  if (k > 2) {
    console.log();
    return;
  }

  console.time('SymSpell::indexation');

  var index = new SymSpell({maxDistance: k});

  for (j = 0; j < W; j++)
    index.add(words[j]);

  console.timeEnd('SymSpell::indexation');

  console.time('SymSpell::query');
  for (i = 0; i < N; i++) {
    query = SAMPLE[i];
    ACTUAL[i] = index.search(query);
  }
  console.timeEnd('SymSpell::query');

  console.log();
}

bench(1);
bench(2);
bench(3);
bench(4);
bench(5);
