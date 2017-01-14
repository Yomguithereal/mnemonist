/* eslint-disable */
/**
 * Mnemonist Trie Unit Tests
 * ==========================
 */
var assert = require('assert'),
    Trie = require('../trie.js');

var inspect = require('util').inspect;

if (inspect.defaultOptions)
  inspect.defaultOptions.depth = null;

describe('Trie', function() {

  it('should be possible to add items into a Trie.', function() {
    var trie = new Trie();

    trie.add('rat');
    trie.add('rate');
    trie.add('tar');

    assert.strictEqual(trie.size, 3);

    assert.deepEqual(trie.root, {
      r: {
        a: {
          t: {
            e: {
              '\uE000': true
            },
            '\uE000': true
          }
        }
      },
      t: {
        a: {
          r: {
            '\uE000': true
          }
        }
      }
    });
  });

  it('should be possible to delete items.', function() {
    var trie = new Trie();

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
              '\uE000': true
            }
          }
        }
      },
      t: {
        a: {
          r: {
            '\uE000': true
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
            '\uE000': true
          }
        }
      }
    });

    assert.strictEqual(trie.delete('tar'), true);

    assert.strictEqual(trie.size, 0);

    assert.deepEqual(trie.root, {});
  });

  it('should be possible to check the existence of an item in the Trie.', function() {
    var trie = new Trie();

    trie.add('romanesque');

    assert.strictEqual(trie.has('romanesque'), true);
    assert.strictEqual(trie.has('roman'), false);
    assert.strictEqual(trie.has([]), false);
    assert.strictEqual(trie.has(''), false);
  });

  it('should be possible to retrieve items matching the given prefix.', function() {
    var trie = new Trie();

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
    var trie = new Trie();

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
    var trie = new Trie();

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
                '\uE000': true
              }
            }
          }
        },
        mouse: {
          eats: {
            cheese: {
              '\uE000': true
            }
          }
        }
      },
      hello: {
        world: {
          '\uE000': true
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

    var trie = Trie.from(words);

    assert.strictEqual(trie.size, 2);
    assert.deepEqual(trie.get('ro'), ['roman', 'romanesque']);
  });
});
