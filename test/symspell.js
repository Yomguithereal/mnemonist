/* eslint no-new: 0 */
/**
 * Mnemonist SymSpell Unit Tests
 * ==============================
 */
var assert = require('assert'),
    SymSpell = require('../symspell.js');

var DATA = [
  'Hello',
  'Mello',
  'John',
  'Book',
  'Back',
  'World',
  'Hello',
  'Jello',
  'Hell',
  'Trello'
];

describe('SymSpell', function() {

  it('should throw when given invalid options.', function() {

    assert.throws(function() {
      new SymSpell({maxDistance: -23});
    }, /maxDistance/);

    assert.throws(function() {
      new SymSpell({verbosity: 45});
    }, /verbosity/);
  });

  it('should correctly index & perform basic search queries.', function() {
    var index = new SymSpell();
    DATA.forEach(word => index.add(word));

    assert.strictEqual(index.size, 10);

    assert.deepEqual(
      index.search('shawarma'),
      []
    );

    assert.deepEqual(
      index.search('ello'),
      [
        {term: 'Hello', distance: 1, count: 2},
        {term: 'Mello', distance: 1, count: 1},
        {term: 'Jello', distance: 1, count: 1},
        {term: 'Trello', distance: 2, count: 1},
        {term: 'Hell', distance: 2, count: 1}
      ]
    );

    // index.search('ello').every(suggestion => {
    //   assert.strictEqual(
    //     suggestion.distance,
    //     damerauLevenshtein(suggestion.term, 'ello').steps
    //   );
    // });
  });

  it('should be possible to increase the maximum edit distance.', function() {
    var index = new SymSpell({maxDistance: 4});
    DATA.forEach(word => index.add(word));

    assert.deepEqual(
      index.search('ello'),
      [
        {term: 'Hello', distance: 1, count: 2},
        {term: 'Mello', distance: 1, count: 1},
        {term: 'Jello', distance: 1, count: 1},
        {term: 'Trello', distance: 2, count: 1},
        {term: 'Hell', distance: 2, count: 1},
        {term: 'John', distance: 4, count: 1},
        {term: 'Book', distance: 4, count: 1},
        {term: 'World', distance: 4, count: 1}
      ]
    );
  });

  it('should possible to use different verbosity settings.', function() {
    var lazyIndex = new SymSpell({verbosity: 0}),
        lessLazyIndex = new SymSpell({verbosity: 1});

    DATA.forEach(word => {
      lazyIndex.add(word);
      lessLazyIndex.add(word);
    });

    assert.deepEqual(
      lazyIndex.search('ello'),
      [{term: 'Hello', distance: 1, count: 2}]
    );

    assert.deepEqual(
      lessLazyIndex.search('ello'),
      [
        {term: 'Hello', distance: 1, count: 2},
        {term: 'Mello', distance: 1, count: 1},
        {term: 'Jello', distance: 1, count: 1}
      ]
    );
  });

  it('should be possible to clear the index.', function() {
    var index = SymSpell.from(DATA);

    index.clear();

    assert.strictEqual(index.size, 0);
  });

  it('should be possible to create an index from arbitrary iterables.', function() {
    var index = SymSpell.from(DATA);

    assert.deepEqual(
      index.search('ello'),
      [
        {term: 'Hello', distance: 1, count: 2},
        {term: 'Mello', distance: 1, count: 1},
        {term: 'Jello', distance: 1, count: 1},
        {term: 'Trello', distance: 2, count: 1},
        {term: 'Hell', distance: 2, count: 1}
      ]
    );
  });
});
