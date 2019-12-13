/**
 * Mnemonist MultiMap Unit Tests
 * ==============================
 */
var assert = require('assert'),
    PassjoinIndex = require('../passjoin-index.js');

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
  });
});


// assert list(segments(3, 'vankatesh')) == [(0, 'va'), (1, 'nk'), (2, 'at'), (3, 'esh')]
// assert list(segments(3, 'avaterasha')) == [(0, 'av'), (1, 'at'), (2, 'era'), (3, 'sha')]
