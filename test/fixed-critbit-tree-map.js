/* eslint-disable */
/**
 * Mnemonist FixedCritBitTreeMap Unit Tests
 * =========================================
 */
var assert = require('assert'),
    FixedCritBitTreeMap = require('../fixed-critbit-tree-map.js');
    // sortBy = require('lodash/sortBy');

var asciitree = require('asciitree');

function printTree(tree) {

  if (tree.size === 0)
    return console.log('{empty}');

  var string = asciitree(
    tree.root,
    function(node) {

      if (node > 0)
        return '' + tree.critbits[node - 1];

      node = -node;
      node -= 1;

      return '(' + tree.keys[node]  + '•' + tree.values[node] + ')';
    },
    function(node) {
      if (node <= 0)
        return null;

      node -= 1;

      var left = tree.lefts[node],
          right = tree.rights[node];

      return [left ? left : null, right ? right : null];
    }
  );

  console.log(string);
}

describe('FixedCritBitTreeMap', function() {

  it('should throw if given bad arguments.', function() {
    assert.throws(function() {
      new FixedCritBitTreeMap();
    }, /capacity/);
  });

  it('should be possible to set values.', function() {
    var tree = new FixedCritBitTreeMap(3);

    tree.set('abc', 1);
    assert.strictEqual(tree.size, 1);

    assert.strictEqual(tree.get('abc'), 1);
    assert.strictEqual(tree.get('whatever'), undefined);

    tree.set('abc', 2);

    assert.strictEqual(tree.size, 1);
    assert.strictEqual(tree.get('abc'), 2);

    // tree.set('azb', 2);
    // tree.set('zzzzzzz', 3);

    // assert.strictEqual(tree.size, 3);
    // assert.strictEqual(tree.get('azb'), 2);
    // assert.strictEqual(tree.get('zzzzzzz'), 3);
    // assert.strictEqual(tree.get('zzzzzzzaaaa'), undefined);

    // assert.strictEqual(tree.has('abc'), true);
    // assert.strictEqual(tree.has('whatever'), false);
  });

  // it('should be possible to delete elements.', function() {
  //   var tree = new FixedCritBitTreeMap();

  //   tree.set('abc', 1);
  //   assert.strictEqual(tree.delete('abc'), true);
  //   assert.strictEqual(tree.size, 0);
  //   assert.strictEqual(tree.delete('abc'), false);

  //   var data = [
  //     'abc',
  //     'def',
  //     'abgd',
  //     'zza',
  //     'idzzzudzzduuzduz'
  //   ];

  //   data.forEach(function(key, i) {
  //     tree.set(key, i);
  //   });

  //   assert.strictEqual(tree.size, data.length);

  //   data.reverse().forEach(function(key) {
  //     tree.delete(key);
  //   });

  //   assert.strictEqual(tree.size, 0);

  //   data.forEach(function(key) {
  //     assert.strictEqual(tree.delete(key), false);
  //     assert.strictEqual(tree.has(key), false);
  //   });
  // });

  // it('differences in string\'s lengths should not cause issues.', function() {
  //   var tree = new FixedCritBitTreeMap();

  //   tree.set('abc', 0);
  //   tree.set('zzz', 0);
  //   tree.set('metastasis', 1);
  //   tree.set('metastases', 2);
  //   tree.set('meta', 4);

  //   assert.strictEqual(tree.size, 5);
  //   assert.strictEqual(tree.has('metastases'), true);
  //   assert.strictEqual(tree.get('abc'), 0);
  // });

  // it('should be possible to iterate over the tree.', function() {
  //   var tree = new FixedCritBitTreeMap();

  //   var data = [
  //     ['abc', 1],
  //     ['xyz', 2],
  //     ['Abc', 3],
  //     ['abcde', 4],
  //     ['bd', 5]
  //   ];

  //   var s = function(item) {
  //     return item[0];
  //   };

  //   data.forEach(function(item) {
  //     tree.set(item[0], item[1]);
  //   });

  //   var result = [];

  //   tree.forEach(function(value, key) {
  //     result.push([key, value]);
  //   });

  //   assert.deepEqual(result, sortBy(data, s));
  // });
});
