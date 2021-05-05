/* eslint no-new: 0 */
/**
 * Mnemonist BKTree Unit Tests
 * ============================
 */
var assert = require('assert'),
    BKTree = require('../bk-tree.js'),
    levenshtein = require('leven');

describe('BKTree', function() {

  it('should throw if given distance is not a function.', function() {

    assert.throws(function() {
      new BKTree(null);
    }, /distance/);
  });

  it('should be possible to add items to the tree.', function() {
    var tree = new BKTree(levenshtein);

    tree.add('hello');
    tree.add('roman');
    tree.add('yellow');

    assert.strictEqual(tree.size, 3);
  });

  it('should be possible to clear the tree.', function() {
    var tree = new BKTree(levenshtein);

    tree.add('hello');
    tree.add('roman');
    tree.add('yellow');

    tree.clear();

    assert.strictEqual(tree.size, 0);
  });

  it('should be possible to query the tree.', function() {
    var tree = new BKTree(levenshtein);

    tree.add('hello');
    tree.add('roman');
    tree.add('yellow');

    assert.deepStrictEqual(tree.search(1, 'mello'), [
      {item: 'hello', distance: 1}
    ]);

    assert.deepStrictEqual(tree.search(2, 'mello'), [
      {item: 'hello', distance: 1},
      {item: 'yellow', distance: 2}
    ]);
  });

  it('should also work with arbitrary objects.', function() {
    var tree = new BKTree(function(a, b) {
      return levenshtein(a.value || a, b.value || b);
    });

    tree.add({value: 'hello'});
    tree.add({value: 'roman'});
    tree.add({value: 'yellow'});

    assert.deepStrictEqual(tree.search(1, 'mello'), [
      {item: {value: 'hello'}, distance: 1}
    ]);

    assert.deepStrictEqual(tree.search(2, 'mello'), [
      {item: {value: 'hello'}, distance: 1},
      {item: {value: 'yellow'}, distance: 2}
    ]);
  });

  it('should be possible to create a tree from an arbitrary iterable.', function() {
    var tree = BKTree.from(['hello', 'yellow'], levenshtein);

    assert.strictEqual(tree.size, 2);
  });
});
