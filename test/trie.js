/* eslint-disable */
/**
 * Mnemonist Trie Unit Tests
 * ==========================
 */
var assert = require('assert'),
    Trie = require('../trie.js'),
    take = require('obliterator/take');

var SENTINEL = Trie.SENTINEL;

var inspect = require('util').inspect;

if (inspect.defaultOptions)
  inspect.defaultOptions.depth = null;

describe('Trie', function() {

  it('should be possible to add items to a Trie.', function() {
    var trie = new Trie();

    trie.add('rat');
    trie.add('rate');
    trie.add('tar');

    assert.strictEqual(trie.size, 3);

    assert.strictEqual(trie.has('rat'), true);
    assert.strictEqual(trie.has('rate'), true);
    assert.strictEqual(trie.has('tar'), true);
    assert.strictEqual(trie.has('show'), false);
    assert.strictEqual(trie.has('ra'), false);
    assert.strictEqual(trie.has('ratings'), false);

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
    var trie = new Trie();

    trie.add('rat');
    trie.add('rate');
    trie.add('rat');

    assert.strictEqual(trie.size, 2);
    assert.strictEqual(trie.has('rat'), true);
  });

  it('should be possible to set the null sequence.', function() {
    var trie = new Trie();

    trie.add('');
    assert.strictEqual(trie.size, 1);
    assert.strictEqual(trie.has(''), true);

    trie = new Trie(Array);

    trie.add([]);
    assert.strictEqual(trie.size, 1);
    assert.strictEqual(trie.has([]), true);
  });

  it('should be possible to delete items.', function() {
    var trie = new Trie();

    trie.add('rat');
    trie.add('rate');
    trie.add('tar');

    assert.strictEqual(trie.delete(''), false);
    assert.strictEqual(trie.delete('hello'), false);

    assert.strictEqual(trie.delete('rat'), true);
    assert.strictEqual(trie.has('rat'), false);
    assert.strictEqual(trie.has('rate'), true);

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

  it('should be possible to check the existence of a sequence in the Trie.', function() {
    var trie = new Trie();

    trie.add('romanesque');

    assert.strictEqual(trie.has('romanesque'), true);
    assert.strictEqual(trie.has('roman'), false);
    assert.strictEqual(trie.has(''), false);
  });

  it('should be possible to retrieve items matching the given prefix.', function() {
    var trie = new Trie();

    trie.add('roman');
    trie.add('romanesque');
    trie.add('romanesques');
    trie.add('greek');

    assert.deepEqual(trie.find('roman'), ['roman', 'romanesque', 'romanesques']);
    assert.deepEqual(trie.find('rom'), ['roman', 'romanesque', 'romanesques']);
    assert.deepEqual(trie.find('romanesque'), ['romanesque', 'romanesques']);
    assert.deepEqual(trie.find('gr'), ['greek']);
    assert.deepEqual(trie.find('hello'), []);
    assert.deepEqual(trie.find(''), ['greek', 'roman', 'romanesque', 'romanesques']);
  });

  it('should work with custom tokens.', function() {
    var trie = new Trie(Array);

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

    assert.deepEqual(trie.find(['the']), [
      ['the', 'mouse', 'eats', 'cheese'],
      ['the', 'cat', 'eats', 'the', 'mouse']
    ]);
  });

  it('should be possible to iterate over the trie\'s prefixes.', function() {
    var trie = new Trie();

    trie.add('rat');
    trie.add('rate');

    var prefixes = take(trie.prefixes());

    assert.deepEqual(prefixes, ['rat', 'rate']);

    trie.add('rater');
    trie.add('rates');

    prefixes = take(trie.keys('rate'));

    assert.deepEqual(prefixes, ['rate', 'rates', 'rater']);
  });

  it('should be possible to iterate over the trie\'s prefixes using for...of.', function() {
    var trie = new Trie();

    trie.add('rat');
    trie.add('rate');

    var tests = [
      'rat',
      'rate'
    ];

    var i = 0;

    for (var prefix of trie)
      assert.deepEqual(prefix, tests[i++]);
  });

  it('should be possible to create a trie from an arbitrary iterable.', function() {
    var words = ['roman', 'romanesque'];

    var trie = Trie.from(words);

    assert.strictEqual(trie.size, 2);
    assert.deepEqual(trie.has('roman'), true);
  });
});
