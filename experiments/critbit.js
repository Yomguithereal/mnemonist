var asciitree = require('asciitree');
var bitwise = require('../utils/bitwise');

var PADDING = '0'.repeat(4);

function numberToBitstring(number) {
  return (PADDING + number.toString(2)).slice(-4);
}

// DAFSA transducer etc. todo: splay get value on top if not ordered
// todo: only compare last part of string
// http://benlynn.blogspot.com/2013/11/crit-bit-tree-micro-optimizations_3.html
// http://benlynn.blogspot.com/2013/11/crit-bit-tree-micro-optimizations_3.html
// https://github.com/blynn/blt/blob/master/blt.c
// https://dotat.at/prog/qp/blog-2015-10-04.html
// TODO: tiny sparse array
// TODO: encode direction as reverted mask | x (probably useless in JS but may avoid one condition)
function findCriticalBit(a, b) {
  var i = 0;

  var min = Math.min(a.length, b.length);

  while (i < min) {
    if (a[i] !== b[i]) {
      return [i, bitwise.criticalBit8Mask(a.charCodeAt(i), b.charCodeAt(i))];
    }

    i++;
  }

  return a.length === b.length ? null : [i, 0];
}

function get(key, address) {
  return bitwise.testCriticalBit8(key.charCodeAt(address[0]), address[1]);
}

function criticalGt(a, b) {
  if (a[0] > b[0])
    return true;

  if (a[0] < b[0])
    return false;

  if (a[1] > b[1])
    return true;

  return false;
}

function InternalNode(critical) {
  this.critical = critical;
  this.left = null;
  this.right = null;
}

function ExternalNode(key) {
  this.key = key;
}

function CritBitTree() {
  this.root = null;
}

CritBitTree.prototype.add = function(key) {
  if (this.root === null) {
    this.root = new ExternalNode(key);
    return;
  }

  var node = this.root,
      ancestors = [];

  while (true) {
    if (node instanceof ExternalNode) {
      var critical = findCriticalBit(key, node.key);

      var internal = new InternalNode(critical);

      var left = get(key, critical) === 0;

      if (left) {
        internal.left = new ExternalNode(key);
        internal.right = node;
      }
      else {
        internal.left = node;
        internal.right = new ExternalNode(key);
      }

      if (this.root === node) {
        this.root = internal;
      }
      else {

        // Bubbling up
        var best = null;

        for (var i = ancestors.length - 1; i >= 0; i--) {
          var [a] = ancestors[i];

          if (criticalGt(a.critical, critical))
            continue;

          best = i;
          break;
        }

        if (best !== null) {
          var [parent, wentRight] = ancestors[best];

          if (left) {
            internal.right = parent.left;
          }
          else {
            internal.left = parent.right;
          }

          if (wentRight) {
            parent.right = internal;
          }
          else {
            parent.left = internal;
          }
        }
        else {
          var [parent, wentRight] = ancestors[0];

          this.root = internal;

          if (left)
            internal.right = parent;
          else
            internal.left = parent;
        }
      }

      return;
    }

    else {
      var bit = get(key, node.critical);

      if (bit === 0) {
        if (!node.left) {
          node.left = new ExternalNode(key);
          return;
        }

        ancestors.push([node, false]);
        node = node.left;
      }
      else {
        if (!node.right) {
          node.right = new ExternalNode(key);
          return;
        }

        ancestors.push([node, true]);
        node = node.right;
      }
    }
  }
};

CritBitTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = function() {
  return this.root;
};

function printNode(node) {
  if (!node)
    return '';

  if (node instanceof InternalNode)
    return '(' + node.critical[0] + ',' + ((~node.critical[1] >>> 0) & 0xff) + ')';

  return node.key;
}

function log(tree) {

  const title = printNode;

  const children = node => (node instanceof ExternalNode ? null : [node.left , node.right]);

  console.log(asciitree(tree.root, title, children));
}

var tree = new CritBitTree();

// tree.add(0);
// tree.add(1);
// tree.add(2);
// tree.add(3);
// tree.add(4);
// tree.add(5);
// tree.add(6);
// tree.add(7);
// tree.add(8);
// tree.add(9);
// tree.add(10);
// tree.add(11);
// tree.add(12);
// tree.add(13);
// tree.add(14);
// tree.add(15);

// THOSE DO NOT WORK
// tree.add('abcdef');
// tree.add('bcd');
tree.add('abb');
tree.add('abc');
tree.add('abd');
tree.add('abe');
tree.add('aba');
tree.add('abz');

// console.log(tree);
log(tree);
