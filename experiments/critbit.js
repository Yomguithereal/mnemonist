var PADDING = '0'.repeat(8);

function numberToBitstring(number) {
  return (PADDING + number.toString(2)).slice(-8);
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
      var bit = bitstring[critical];

      if (bit === '0') {
        if (!node.right) {
          node.right = new ExternalNode(key);
          return;
        }

        wentRight = true;
        parent = node;
        node = node.right;
      }
      else {
        if (!node.left) {
          node.left = new ExternalNode(key);
          return;
        }

        wentRight = false;
        parent = node;
        node = node.left;
      }
    }
  }
};

CritBitTree.prototype[Symbol.for('nodejs.util.inspect.custom')] = function() {
  return this.root;
};

var tree = new CritBitTree();

tree.add(15);
tree.add(16);
tree.add(17);

console.log(tree);
