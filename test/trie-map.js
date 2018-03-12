/* eslint-disable */
/**
 * Mnemonist TrieMap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    TrieMap = require('../trie-map.js'),
    consume = require('obliterator/consume');

var SENTINEL = TrieMap.SENTINEL;

var inspect = require('util').inspect;

if (inspect.defaultOptions)
  inspect.defaultOptions.depth = null;

describe('TrieMap', function() {

  it('should be possible to set items into a TrieMap.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);
    trie.set('tar', 3);

    assert.strictEqual(trie.size, 3);

    assert.strictEqual(trie.get('rat'), 1);
    assert.strictEqual(trie.get('rate'), 2);
    assert.strictEqual(trie.get('tar'), 3);
    assert.strictEqual(trie.get('show'), undefined);
    assert.strictEqual(trie.get('ra'), undefined);
    assert.strictEqual(trie.get('ratings'), undefined);

    assert.deepEqual(trie.root, {
      r: {
        a: {
          t: {
            e: {
              [SENTINEL]: 2
            },
            [SENTINEL]: 1
          }
        }
      },
      t: {
        a: {
          r: {
            [SENTINEL]: 3
          }
        }
      }
    });
  });

  it('adding the same item several times should not increase size.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);
    trie.set('rat', 3);

    assert.strictEqual(trie.size, 2);
    assert.strictEqual(trie.get('rat'), 3);
  });

  it('should be possible to set the null sequence.', function() {
    var trie = new TrieMap();

    trie.set('', 45);
    assert.strictEqual(trie.size, 1);
    assert.strictEqual(trie.get(''), 45);

    trie = new TrieMap(Array);

    trie.set([], 45);
    assert.strictEqual(trie.size, 1);
    assert.strictEqual(trie.get([]), 45);
  });

  it('should be possible to delete items.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);
    trie.set('tar', 3);

    assert.strictEqual(trie.delete(''), false);
    assert.strictEqual(trie.delete('hello'), false);

    assert.strictEqual(trie.delete('rat'), true);
    assert.strictEqual(trie.get('rat'), undefined);
    assert.strictEqual(trie.get('rate'), 2);

    assert.strictEqual(trie.size, 2);

    assert.deepEqual(trie.root, {
      r: {
        a: {
          t: {
            e: {
              [SENTINEL]: 2
            }
          }
        }
      },
      t: {
        a: {
          r: {
            [SENTINEL]: 3
          }
        }
      }
    });

    assert.strictEqual(trie.delete('rate'), true);

    assert.strictEqual(trie.size, 1);

    assert.deepEqual(trie.root, {
      t: {
        a: {
          r: {
            [SENTINEL]: 3
          }
        }
      }
    });

    assert.strictEqual(trie.delete('tar'), true);

    assert.strictEqual(trie.size, 0);

    assert.deepEqual(trie.root, {});
  });

  it('should be possible to check the existence of a sequence in the TrieMap.', function() {
    var trie = new TrieMap();

    trie.set('romanesque', 1);

    assert.strictEqual(trie.has('romanesque'), true);
    assert.strictEqual(trie.has('roman'), false);
    assert.strictEqual(trie.has([]), false);
    assert.strictEqual(trie.has(''), false);
  });

  it('should be possible to retrieve items matching the given prefix.', function() {
    var trie = new TrieMap();

    trie.set('roman', 1);
    trie.set('romanesque', 2);
    trie.set('romanesques', 3);
    trie.set('greek', 4);

    assert.deepEqual(trie.find('roman'), [['roman', 1], ['romanesque', 2], ['romanesques', 3]]);
    assert.deepEqual(trie.find('rom'), [['roman', 1], ['romanesque', 2], ['romanesques', 3]]);
    assert.deepEqual(trie.find('romanesque'), [['romanesque', 2], ['romanesques', 3]]);
    assert.deepEqual(trie.find('gr'), [['greek', 4]]);
    assert.deepEqual(trie.find('hello'), []);
    assert.deepEqual(trie.find(''), [['greek', 4], ['roman', 1], ['romanesque', 2], ['romanesques', 3]]);
  });

  it('should work with custom tokens.', function() {
    var trie = new TrieMap(Array);

    trie.set(['the', 'cat', 'eats', 'the', 'mouse'], 1);
    trie.set(['the', 'mouse', 'eats', 'cheese'], 2);
    trie.set(['hello', 'world'], 3);

    assert.strictEqual(trie.size, 3);
    assert.deepEqual(trie.root, {
      the: {
        cat: {
          eats: {
            the: {
              mouse: {
                [SENTINEL]: 1
              }
            }
          }
        },
        mouse: {
          eats: {
            cheese: {
              [SENTINEL]: 2
            }
          }
        }
      },
      hello: {
        world: {
          [SENTINEL]: 3
        }
      }
    });

    assert.strictEqual(trie.has(['the', 'mouse', 'eats', 'cheese']), true);
    assert.strictEqual(trie.has(['the', 'mouse', 'eats']), false);

    assert.strictEqual(trie.delete(['hello']), false);
    assert.strictEqual(trie.delete(['hello', 'world']), true);

    assert.strictEqual(trie.size, 2);

    assert.deepEqual(trie.find(['the']), [
      [['the', 'mouse', 'eats', 'cheese'], 2],
      [['the', 'cat', 'eats', 'the', 'mouse'], 1]
    ]);
  });

  it('should be possible to iterate over the trie\'s values.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);

    var values = consume(trie.values());

    assert.deepEqual(values, [1, 2]);

    trie.set('rater', 3);
    trie.set('rates', 4);

    values = consume(trie.values('rate'));

    assert.deepEqual(values, [2, 4, 3]);
  });

  it('should be possible to iterate over the trie\'s prefixes.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);

    var prefixes = consume(trie.prefixes());

    assert.deepEqual(prefixes, ['rat', 'rate']);

    trie.set('rater', 3);
    trie.set('rates', 4);

    prefixes = consume(trie.keys('rate'));

    assert.deepEqual(prefixes, ['rate', 'rates', 'rater']);
  });

  it('should be possible to iterate over the trie\'s entries.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);

    var entries = consume(trie.entries());

    assert.deepEqual(entries, [['rat', 1], ['rate', 2]]);

    trie.set('rater', 3);
    trie.set('rates', 4);

    entries = consume(trie.entries('rate'));

    assert.deepEqual(entries, [['rate', 2], ['rates', 4], ['rater', 3]]);
  });

  it('should be possible to iterate over the trie\'s entries using for...of.', function() {
    var trie = new TrieMap();

    trie.set('rat', 1);
    trie.set('rate', 2);

    var tests = [
      ['rat', 1],
      ['rate', 2]
    ];

    var i = 0;

    for (var entry of trie)
      assert.deepEqual(entry, tests[i++]);
  });

  it('should be possible to create a trie from an arbitrary iterable.', function() {
    var words = {
      roman: 1,
      romanesque: 2
    };

    var trie = TrieMap.from(words);

    assert.strictEqual(trie.size, 2);
    assert.deepEqual(trie.get('roman'), 1);
  });
});
