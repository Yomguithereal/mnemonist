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

    trie = new TrieMap();

    trie.set([], 45);
    assert.strictEqual(trie.size, 1);
    assert.strictEqual(trie.get(''), 45);
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

  it('should be possible to get the longest matching prefix.', function() {
    var trie = new TrieMap();

    trie.set('roman', 1);
    trie.set('romanesque', 2);
    trie.set('romanesques', 3);
    trie.set('greek', 4);

    assert.deepEqual(trie.longestPrefix('romano'), ['roman', 1]);
    assert.deepEqual(trie.longestPrefix('romanesquet'), ['romanesque', 2]);
    assert.strictEqual(trie.longestPrefix(''), null);
    assert.strictEqual(trie.longestPrefix('gloria'), null);
    assert.deepEqual(trie.longestPrefix('greeks'), ['greek', 4]);

    trie.set('', 5);
    assert.deepEqual(trie.longestPrefix('gloria'), ['', 5]);
  });

  // it('should work with custom tokens.', function() {
  //   var trie = new TrieMap();

  //   trie.add(['the', 'cat', 'eats', 'the', 'mouse']);
  //   trie.add(['the', 'mouse', 'eats', 'cheese']);
  //   trie.add(['hello', 'world']);

  //   assert.strictEqual(trie.size, 3);
  //   assert.deepEqual(trie.root, {
  //     the: {
  //       cat: {
  //         eats: {
  //           the: {
  //             mouse: {
  //               [SENTINEL]: true
  //             }
  //           }
  //         }
  //       },
  //       mouse: {
  //         eats: {
  //           cheese: {
  //             [SENTINEL]: true
  //           }
  //         }
  //       }
  //     },
  //     hello: {
  //       world: {
  //         [SENTINEL]: true
  //       }
  //     }
  //   });

  //   assert.strictEqual(trie.has(['the', 'mouse', 'eats', 'cheese']), true);
  //   assert.strictEqual(trie.has(['the', 'mouse', 'eats']), false);

  //   assert.strictEqual(trie.delete(['hello']), false);
  //   assert.strictEqual(trie.delete(['hello', 'world']), true);

  //   assert.strictEqual(trie.size, 2);

  //   assert.deepEqual(trie.get(['the']), [
  //     ['the', 'mouse', 'eats', 'cheese'],
  //     ['the', 'cat', 'eats', 'the', 'mouse']
  //   ]);

  //   assert.deepEqual(trie.longestPrefix(['the', 'cat', 'eats', 'cheese']), ['the', 'cat', 'eats']);
  // });

  // it('should be possible to create a trie from an arbitrary iterable.', function() {
  //   var words = [
  //     'roman',
  //     'romanesque'
  //   ];

  //   var trie = TrieMap.from(words);

  //   assert.strictEqual(trie.size, 2);
  //   assert.deepEqual(trie.get('ro'), ['roman', 'romanesque']);
  // });
});
