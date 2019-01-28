var asciitree = require('asciitree');

var PADDING = '0'.repeat(4);

function numberToBitstring(number) {
  return (PADDING + number.toString(2)).slice(-4);
}

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
      wentRight = false,
      parent;

  while (true) {
    if (node instanceof ExternalNode) {
      var critical = findCriticalBit(bitstring, numberToBitstring(node.key));

      var internal = new InternalNode(critical);

      if (bitstring[critical] === '0') {
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
        if (wentRight)
          parent.right = internal;
        else
          parent.left = internal;
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

        wentRight = false;
        parent = node;
        node = node.left;
      }
      else {
        if (!node.right) {
          node.right = new ExternalNode(key);
          return;
        }

        wentRight = true;
        parent = node;
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
tree.add(10);
tree.add(11);
tree.add(12);
tree.add(13);
tree.add(14);
tree.add(15);

// console.log(tree);
log(tree);
