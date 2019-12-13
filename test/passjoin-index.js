/**
 * Mnemonist MultiMap Unit Tests
 * ==============================
 */
var assert = require('assert'),
    PassjoinIndex = require('../passjoin-index.js');

var EXPECTED_INTERVALS = [
  [[1, 0, 0, 2], [0, 0]],
  [[1, 1, 2, 2], [1, 3]],
  [[1, 2, 4, 3], [4, 6]],
  [[1, 3, 6, 3], [7, 7]]
];

// var MULTI_MATCH_AWARE_TESTS = [
//   [
//     [0, 7, ['a']],
//     [1, 7, ['at']],
//     [2, 7, ['re']],
//     [3, 7, ['ha']]
//   ],

//   [
//     [0, 8, ['av']],
//     [1, 8, ['at', 'ta']],
//     [2, 8, ['re', 'es']],
//     [3, 8, ['ha']]
//   ],

//   [
//     [0, 9, ['av']],
//     [1, 9, ['va', 'at', 'ta']],
//     [2, 9, ['ar', 're', 'es']],
//     [3, 9, ['sha']]
//   ],

//   [
//     [0, 10, ['av']],
//     [1, 10, ['va', 'at', 'ta']],
//     [2, 10, ['tar', 'are', 'res']],
//     [3, 10, ['sha']]
//   ],

//   [
//     [0, 11, ['av']],
//     [1, 11, ['vat', 'ata', 'tar']],
//     [2, 11, ['tar', 'are', 'res']],
//     [3, 11, ['sha']]
//   ],

//   [
//     [0, 12, ['ava']],
//     [1, 12, ['ata', 'tar']],
//     [2, 12, ['are', 'res']],
//     [3, 12, ['sha']]
//   ],

//   [
//     [0, 13, ['ava']],
//     [1, 13, ['ata']],
//     [2, 13, ['are']],
//     [3, 13, ['esha']]
//   ]
// ];

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

  // it('should be possible to extract the multi-match aware substrings.', function() {
  //   MULTI_MATCH_AWARE_TESTS.forEach(function(group) {
  //     var P = PassjoinIndex.partition(3, group[0][1]);

  //     group.forEach(function(params, j) {
  //       var i = params[0],
  //           l = params[1],
  //           substrings = params[2];

  //       var pi = P[j][0],
  //           li = P[j][1];

  //       assert.deepEqual(
  //         PassjoinIndex.multiMatchAwareSubstrings(3, 'avaterasha', l, i, pi, li),
  //         substrings
  //       );
  //     });
  //   });
  // });
});
