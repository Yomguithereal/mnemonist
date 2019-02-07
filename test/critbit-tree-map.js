/* eslint-disable */
/**
 * Mnemonist Trie Unit Tests
 * ==========================
 */
var assert = require('assert'),
    CritBitTreeMap = require('../critbit-tree-map.js');

// var asciitree = require('asciitree');

// function printTree(tree) {

//   if (tree.root === null)
//     return console.log('{empty}');

//   var string = asciitree(
//     tree.root,
//     function(node) {

//       if ('critbit' in node)
//         return '' + node.critbit;

//       return '(' + node.key + '•' + node.value + ')';
//     },
//     function(node) {
//       if (!('critbit' in node))
//         return null;

//       return [node.left, node.right];
//     }
//   );

//   console.log(string);
// }

describe('CritBitTreeMap', function() {

  it('should be possible to set values.', function() {
    var tree = new CritBitTreeMap();

    tree.set('abc', 1);

    assert.strictEqual(tree.size, 1);
    assert.strictEqual(tree.get('abc'), 1);
    assert.strictEqual(tree.get('whatever'), undefined);

    tree.set('abc', 2);

    assert.strictEqual(tree.size, 1);
    assert.strictEqual(tree.get('abc'), 2);

    tree.set('azb', 2);
    tree.set('zzzzzzz', 3);

    assert.strictEqual(tree.size, 3);
    assert.strictEqual(tree.get('azb'), 2);
    assert.strictEqual(tree.get('zzzzzzz'), 3);
    assert.strictEqual(tree.get('zzzzzzzaaaa'), undefined);

    assert.strictEqual(tree.has('abc'), true);
    assert.strictEqual(tree.has('whatever'), false);
  });

  it('should be possible to delete elements.', function() {
    var tree = new CritBitTreeMap();

    tree.set('abc', 1);
    assert.strictEqual(tree.delete('abc'), true);
    assert.strictEqual(tree.size, 0);
    assert.strictEqual(tree.delete('abc'), false);

    var data = [
      'abc',
      'def',
      'abgd',
      'zza',
      'idzzzudzzduuzduz'
    ];

    data.forEach(function(key, i) {
      tree.set(key, i);
    });

    assert.strictEqual(tree.size, data.length);

    data.reverse().forEach(function(key) {
      tree.delete(key);
    });

    assert.strictEqual(tree.size, 0);

    data.forEach(function(key) {
      assert.strictEqual(tree.delete(key), false);
      assert.strictEqual(tree.has(key), false);
    });
  });
});
