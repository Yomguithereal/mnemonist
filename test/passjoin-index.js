/**
 * Mnemonist MultiMap Unit Tests
 * ==============================
 */
var assert = require('assert'),
    leven = require('leven'),
    PassjoinIndex = require('../passjoin-index.js');

var EXPECTED_INTERVALS = [
  [[1, 0, 0, 2], [0, 0]],
  [[1, 1, 2, 2], [1, 3]],
  [[1, 2, 4, 3], [4, 6]],
  [[1, 3, 6, 3], [7, 7]]
];

var MULTI_MATCH_AWARE_TESTS = [
  [
    [0, 7, ['a']],
    [1, 7, ['at']],
    [2, 7, ['ra']],
    [3, 7, ['ha']]
  ],

  [
    [0, 8, ['av']],
    [1, 8, ['at', 'te']],
    [2, 8, ['ra', 'as']],
    [3, 8, ['ha']]
  ],

  [
    [0, 9, ['av']],
    [1, 9, ['va', 'at', 'te']],
    [2, 9, ['er', 'ra', 'as']],
    [3, 9, ['sha']]
  ],

  [
    [0, 10, ['av']],
    [1, 10, ['va', 'at', 'te']],
    [2, 10, ['ter', 'era', 'ras']],
    [3, 10, ['sha']]
  ],

  [
    [0, 11, ['av']],
    [1, 11, ['vat', 'ate', 'ter']],
    [2, 11, ['ter', 'era', 'ras']],
    [3, 11, ['sha']]
  ],

  [
    [0, 12, ['ava']],
    [1, 12, ['ate', 'ter']],
    [2, 12, ['era', 'ras']],
    [3, 12, ['sha']]
  ],

  [
    [0, 13, ['ava']],
    [1, 13, ['ate']],
    [2, 13, ['era']],
    [3, 13, ['asha']]
  ]
];

var STRINGS = [
  'benjamin',
  'paule',
  'paul',
  'pa',
  'benja',
  'benjomon',
  'ab',
  'a',
  'b',
  ''
];

var CUSTOM_LEVENSHTEIN_TESTS = [
  [['tabernacle', 0, 10, 'tabernaclo', 0, 10], 5, 1],
  [['tabernacle', 2, 7, 'tabernaclo', 2, 7], 1, 0],
  [['baratte', 2, 3, 'rat', 0, 3], 1, 0],
  [['baratte', 0, 4, 'rat', 0, 3], 3, 3],
  [['baratte', 2, 2, 'rat', 0, 2], 3, 0],
  [['romain', 0, 4, 'gala', 0, 1], 1, Infinity],
  [['ul', 0, 2, 'eul', 0, 3], 1, 1],
  [['ul', 0, 2, 'ule', 0, 3], 1, 1],
  [['a', 0, 1, 'pa', 0, 1], 1, 1],
  [['paul', 2, 2, 'paule', 2, 3], 1, 1]
];

describe('PassjoinIndex', function() {

  it('should be possible to sort strings according to the 4.2 point of the paper.', function() {
    var strings = [
      'abc',
      'abcde',
      'a',
      'aba'
    ];

    var sorted = strings.slice().sort(PassjoinIndex.comparator);

    assert.deepEqual(sorted, ['abcde', 'aba', 'abc', 'a']);
  });

  it('should be possible to split strings into segments for indexation.', function() {
    assert.deepEqual(PassjoinIndex.segments(3, 'vankatesh'), ['va', 'nk', 'at', 'esh']);
    assert.deepEqual(PassjoinIndex.segments(3, 'avaterasha'), ['av', 'at', 'era', 'sha']);
  });

  it('should be possible to retrieve a segment\'s position.', function() {
    assert.strictEqual(PassjoinIndex.segmentPos(3, 0, 'candidate'), 0);
    assert.strictEqual(PassjoinIndex.segmentPos(3, 1, 'candidate'), 2);
    assert.strictEqual(PassjoinIndex.segmentPos(3, 2, 'candidate'), 4);
    assert.strictEqual(PassjoinIndex.segmentPos(3, 3, 'candidate'), 6);

    assert.strictEqual(PassjoinIndex.segmentPos(3, 0, 'candidater'), 0);
    assert.strictEqual(PassjoinIndex.segmentPos(3, 1, 'candidater'), 2);
    assert.strictEqual(PassjoinIndex.segmentPos(3, 2, 'candidater'), 4);
    assert.strictEqual(PassjoinIndex.segmentPos(3, 3, 'candidater'), 7);
  });

  it('should be possible to compute the multi-match aware interval.', function() {
    EXPECTED_INTERVALS.forEach(function(test) {
      var params = test[0],
          interval = test[1];

      var delta = params[0],
          i = params[1],
          pi = params[2],
          li = params[3];

      assert.deepEqual(
        PassjoinIndex.multiMatchAwareInterval(3, delta, i, 10, pi, li),
        interval
      );
    });
  });

  it('should be possible to extract the multi-match aware substrings.', function() {
    MULTI_MATCH_AWARE_TESTS.forEach(function(group) {
      var P = PassjoinIndex.partition(3, group[0][1]);

      group.forEach(function(params, j) {
        var i = params[0],
            l = params[1],
            substrings = params[2];

        var pi = P[j][0],
            li = P[j][1];

        assert.deepEqual(
          PassjoinIndex.multiMatchAwareSubstrings(3, 'avaterasha', l, i, pi, li),
          substrings
        );
      });
    });

    // Duplicate letters
    var substringsWithoutDuplicates = PassjoinIndex.multiMatchAwareSubstrings(3, 'avatssssha', 11, 2, 5, 3);

    assert.deepEqual(substringsWithoutDuplicates, ['tss', 'sss']);
  });

  it('should throw if given wrong arguments.', function() {
    assert.throws(function() {
      new PassjoinIndex();
    }, /Levenshtein/);

    assert.throws(function() {
      new PassjoinIndex(Function.prototype, -45);
    }, /number > 0/);
  });

  it('should be possible to add & search values using the index.', function() {
    var k1 = new PassjoinIndex(leven, 1),
        k2 = new PassjoinIndex(leven, 2),
        k3 = new PassjoinIndex(leven, 3);

    STRINGS.forEach(function(string) {
      k1.add(string);
      k2.add(string);
      k3.add(string);
    });

    assert.strictEqual(k1.size, STRINGS.length);
    assert.strict(k1.k, 1);

    assert.deepEqual(k1.search('paul'), new Set(['paul', 'paule']));
    assert.deepEqual(k1.search('paulet'), new Set(['paule']));
    assert.deepEqual(k1.search('a'), new Set(['', 'a', 'b', 'pa', 'ab']));

    assert.deepEqual(k2.search('benjiman'), new Set(['benjamin', 'benjomon']));

    assert.deepEqual(k3.search('benja'), new Set(['benjamin', 'benja']));
    assert.deepEqual(k3.search('pa'), new Set(['', 'a', 'b', 'pa', 'ab', 'paul', 'paule']));
  });

  it('should be possible to apply custom segmented limited Levenshtein distance.', function() {
    CUSTOM_LEVENSHTEIN_TESTS.forEach(function(test) {
      const args = test[0],
            max = test[1],
            distance = test[2];

      assert.strictEqual(
        PassjoinIndex.segmentedLimitedLevenshtein.apply(null, [max].concat(args)),
        distance
      );
    });
  });
});

// TODO: test with arbitrary sequences
// TODO: iteration functions
// TODO: use multiarray
// TODO: function returning tuple with distance
