/* eslint-disable */
/**
 * Mnemonist TrieMap Unit Tests
 * ==========================
 */
var assert = require('assert'),
    TrieMap = require('../trie-map.js');

var SENTINEL = TrieMap.SENTINEL;

var inspect = require('util').inspect;

if (inspect.defaultOptions)
  inspect.defaultOptions.depth = null;

describe('TrieMap', function() {

  it('should be possible to add items into a TrieMap.', function() {
    var trie = new TrieMap();

    trie.add('rat');
    trie.add('rate');
    trie.add('tar');

    assert.strictEqual(trie.size, 3);

    assert.deepEqual(trie.root, {
      r: {
        a: {
          t: {
            e: {
              [SENTINEL]: true
            },
            [SENTINEL]: true
          }
        }
      },
      t: {
        a: {
          r: {
            [SENTINEL]: true
          }
        }
      }
    });
  });

  it('adding the same item several times should not increase size.', function() {
    var trie = new TrieMap();

    trie.add('rat');
    trie.add('rate');
    trie.add('rat');

    assert.strictEqual(trie.size, 2);
  });

  it('should be possible to delete items.', function() {
    var trie = new TrieMap();

    trie.add('rat');
    trie.add('rate');
    trie.add('tar');

    assert.strictEqual(trie.delete(''), false);
    assert.strictEqual(trie.delete('hello'), false);

    assert.strictEqual(trie.delete('rat'), true);

    assert.strictEqual(trie.size, 2);

    assert.deepEqual(trie.root, {
      r: {
        a: {
          t: {
            e: {
              [SENTINEL]: true
            }
          }
        }
      },
      t: {
        a: {
          r: {
            [SENTINEL]: true
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
            [SENTINEL]: true
          }
        }
      }
    });

    assert.strictEqual(trie.delete('tar'), true);

    assert.strictEqual(trie.size, 0);

    assert.deepEqual(trie.root, {});
  });

  it('should be possible to check the existence of an item in the TrieMap.', function() {
    var trie = new TrieMap();

    trie.add('romanesque');

    assert.strictEqual(trie.has('romanesque'), true);
    assert.strictEqual(trie.has('roman'), false);
    assert.strictEqual(trie.has([]), false);
    assert.strictEqual(trie.has(''), false);
  });

  it('should be possible to retrieve items matching the given prefix.', function() {
    var trie = new TrieMap();

    trie.add('roman');
    trie.add('romanesque');
    trie.add('romanesques');
    trie.add('greek');

    assert.deepEqual(trie.get('roman'), ['roman', 'romanesque', 'romanesques']);
    assert.deepEqual(trie.get('rom'), ['roman', 'romanesque', 'romanesques']);
    assert.deepEqual(trie.get('romanesque'), ['romanesque', 'romanesques']);
    assert.deepEqual(trie.get('gr'), ['greek']);
    assert.deepEqual(trie.get('hello'), []);
    assert.deepEqual(trie.get(''), []);
  });

  it('should be possible to get the longest matching prefix.', function() {
    var trie = new TrieMap();

    trie.add('roman');
    trie.add('romanesque');
    trie.add('romanesques');
    trie.add('greek');

    assert.strictEqual(trie.longestPrefix('romano'), 'roman');
    assert.strictEqual(trie.longestPrefix('romanesquet'), 'romanesque');
    assert.strictEqual(trie.longestPrefix(''), '');
    assert.strictEqual(trie.longestPrefix('greeks'), 'greek');
  });

  it('should work with custom tokens.', function() {
    var trie = new TrieMap();

    trie.add(['the', 'cat', 'eats', 'the', 'mouse']);
    trie.add(['the', 'mouse', 'eats', 'cheese']);
    trie.add(['hello', 'world']);

    assert.strictEqual(trie.size, 3);
    assert.deepEqual(trie.root, {
      the: {
        cat: {
          eats: {
            the: {
              mouse: {
                [SENTINEL]: true
              }
            }
          }
        },
        mouse: {
          eats: {
            cheese: {
              [SENTINEL]: true
            }
          }
        }
      },
      hello: {
        world: {
          [SENTINEL]: true
        }
      }
    });

    assert.strictEqual(trie.has(['the', 'mouse', 'eats', 'cheese']), true);
    assert.strictEqual(trie.has(['the', 'mouse', 'eats']), false);

    assert.strictEqual(trie.delete(['hello']), false);
    assert.strictEqual(trie.delete(['hello', 'world']), true);

    assert.strictEqual(trie.size, 2);

    assert.deepEqual(trie.get(['the']), [
      ['the', 'mouse', 'eats', 'cheese'],
      ['the', 'cat', 'eats', 'the', 'mouse']
    ]);

    assert.deepEqual(trie.longestPrefix(['the', 'cat', 'eats', 'cheese']), ['the', 'cat', 'eats']);
  });

  it('should be possible to create a trie from an arbitrary iterable.', function() {
    var words = [
      'roman',
      'romanesque'
    ];

    var trie = TrieMap.from(words);

    assert.strictEqual(trie.size, 2);
    assert.deepEqual(trie.get('ro'), ['roman', 'romanesque']);
  });
});
