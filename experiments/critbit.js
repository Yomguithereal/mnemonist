var asciitree = require('asciitree');

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
function findCriticalBit(a, b) {
  var i = 0;

  while (i < 8) {
    if (a[i] !== b[i])
      return i;

    i++;
  }

  return -1;
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
  var bitstring = numberToBitstring(key);

  if (this.root === null) {
    this.root = new ExternalNode(key);
    return;
  }

  var node = this.root,
      ancestors = [];

  while (true) {
    if (node instanceof ExternalNode) {
      var critical = findCriticalBit(bitstring, numberToBitstring(node.key));

      var internal = new InternalNode(critical);

      var left = bitstring[critical] === '0';

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

          if (a.critical > critical)
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
      var bit = bitstring[node.critical];

      if (bit === '0') {
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
    return '(' + node.critical + ')';

  return node.key + '•' + numberToBitstring(node.key);
}

function log(tree) {

  const title = printNode;

  const children = node => (node instanceof ExternalNode ? null : [node.left , node.right]);

  console.log(asciitree(tree.root, title, children));
}

var tree = new CritBitTree();

tree.add(0);
tree.add(1);
tree.add(2);
tree.add(3);
tree.add(4);
tree.add(5);
tree.add(6);
tree.add(7);
tree.add(8);
tree.add(9);
tree.add(10);
tree.add(11);
tree.add(12);
tree.add(13);
tree.add(14);
tree.add(15);

// console.log(tree);
log(tree);
