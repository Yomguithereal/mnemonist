var asciitree = require('asciitree');
var bitwise = require('../utils/bitwise');

var PADDING = '0'.repeat(8);

function numberToBitstring(number) {
  return (PADDING + number.toString(2)).slice(-8);
}

function unmask(x) {
  return 8 - Math.log2((~x >>> 0) & 0xff) - 1;
}

// NOTE: max number of internal nodes = n - 1 so max full size = 2n - 1
// NOTE: deleting = compressing above node into grandparent
// --> parent.opposite becomes granparent.path

// NOTE: use negative numbers to distinguish node types in static version
// --> internal nodes should use positive numbers because they are used more
// and this will save up some time

// DAFSA transducer etc.
// todo: only compare last part of string

// NOTE: packing critical bit (left number must be the largest one)
// (0b1010 << 4) | 0b1001 => 0b10101001
// https://stackoverflow.com/questions/29177035/working-with-binary-in-python-splitting-numbers

// http://benlynn.blogspot.com/2013/11/crit-bit-tree-micro-optimizations_3.html
// https://github.com/blynn/blt/blob/master/blt.c
// https://dotat.at/prog/qp/blog-2015-10-04.html

function packCritical(byte, mask) {
  return (byte << 8) | mask;
}

function unpackByte(x) {
  return x >> 8;
}

function unpackMask(x) {
  return x & 0xff;
}

// TODO: variant starting at i byte
function findCriticalBit(a, b) {
  var i = 0;

  var min = Math.min(a.length, b.length);

  while (i < min) {
    if (a[i] !== b[i]) {
      return packCritical(i, bitwise.criticalBit8Mask(a.charCodeAt(i), b.charCodeAt(i)));
    }

    i++;
  }

  return a.length === b.length ? null : packCritical(i, bitwise.criticalBit8Mask(b.charCodeAt(0), 0));
}

function get(key, critical) {
  return bitwise.testCriticalBit8(key.charCodeAt(unpackByte(critical)), unpackMask(critical));
}

// NOTE: maybe it is possible to avoid conditions with bitwise magic
function criticalGt(a, b) {
  if (a > b)
    return true;

  if (a < b)
    return false;

  // TODO: issue here because of the mask?
  // if (a[1] > b[1])
  //   return true;

  return false;
}

function InternalNode(critical) {
  this.critical = critical
  this.left = null;
  this.right = null;
}

function ExternalNode(key) {
  this.key = key;
}

function CritBitTree() {
  this.root = null;
}

CritBitTree.prototype.has = function(key) {
  if (this.root === null) {
    return false;
  }

  var node = this.root;

  while (true) {
    if (node instanceof ExternalNode) {

      return node.key === key;
    }

    else {
      var bit = get(key, node.critical);

      if (bit === 0) {
        if (!node.left) {
          return false;
        }

        node = node.left;
      }
      else {
        if (!node.right) {
          return false;
        }

        node = node.right;
      }
    }
  }
};

// TODO: case when the item is already in the tree
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

      // Bubbling up
      var best = -1;

      for (var i = ancestors.length - 1; i >= 0; i--) {
        var [a] = ancestors[i];

        if (criticalGt(a.critical, critical))
          continue;

        best = i;
        break;
      }

      // Need to attach to root
      if (best < 0) {

        this.root = internal;

        // Rewire parent as child?
        if (ancestors.length > 0) {
          var [parent] = ancestors[0];

          if (left)
            internal.right = parent;
          else
            internal.left = parent;
        }
      }

      // No need for rotation
      else if (best === ancestors.length - 1) {

        var [parent, wentRight] = ancestors[best];

        if (wentRight)
          parent.right = internal;
        else
          parent.left = internal;
      }

      // Rotation
      else {
        var [parent, wentRight] = ancestors[best];
        var [child] = ancestors[best + 1];

        if (wentRight) {
          parent.right = internal;
        }
        else {
          parent.left = internal;
        }

        if (left)
          internal.right = child;
        else
          internal.left = child;
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

// --> parent.opposite becomes granparent.path
CritBitTree.prototype.delete = function(key) {
  if (this.root === null) {
    return;
  }

  var node = this.root,
      parent = null,
      wentRightForParent = false
      grandparent = null,
      wentRightForGranparent = false;

  while (true) {
    if (node instanceof ExternalNode) {

      if (node.key === key) {

        if (parent === null) {
          this.root = null;
        }

        else if (grandparent === null) {
          if (wentRightForParent)
            this.root = parent.left;
          else
            this.root = parent.right;
        }

        else if (wentRightForGranparent) {
          if (wentRightForParent)
            grandparent.right = parent.left;
          else
            grandparent.right = parent.right;
        }
        else {
          if (wentRightForParent)
            grandparent.left = parent.left;
          else
            grandparent.left = parent.right;
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

        grandparent = parent;
        parent = node;
        wentRightForGranparent = wentRightForParent;
        wentRightForParent = false;
        node = node.left;
      }
      else {
        if (!node.right) {
          node.right = new ExternalNode(key);
          return;
        }

        grandparent = parent;
        parent = node;
        wentRightForGranparent = wentRightForParent;
        wentRightForParent = true;
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
    return '(' + unpackByte(node.critical) + ',' + unmask(unpackMask(node.critical)) + ')';

  return node.key + '•' + Array.from(node.key, k => k.charCodeAt(0)).map(numberToBitstring);
}

function log(tree) {

  const title = printNode;

  const children = node => (node instanceof ExternalNode ? null : [node.left , node.right]);

  console.log(asciitree(tree.root, title, children));
}

module.exports = CritBitTree;

if (require.main === module) {
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

  tree.add('abcde');
  tree.add('bcd');
  // tree.add('abb');
  // tree.add('abc');
  tree.add('abd');
  tree.add('abdg');
  tree.add('abe');
  tree.add('aba');
  tree.add('abz');

  // tree.delete('bcd');
  // tree.delete('abd');
  // tree.delete('abcde');
  // tree.delete('aba');
  // tree.delete('abdg');
  // tree.delete('abz');
  // tree.delete('abe');

  // tree.add(String.fromCharCode(13));
  // tree.add(String.fromCharCode(10));
  // tree.add(String.fromCharCode(8));
  // tree.add(String.fromCharCode(12));
  // tree.add(String.fromCharCode(1));
  // tree.add(String.fromCharCode(145));
  // tree.add(String.fromCharCode(14));
  // tree.add(String.fromCharCode(9));
  // tree.add(String.fromCharCode(11));
  // tree.add(String.fromCharCode(255));

  // console.log(tree);
  log(tree);

  var a = packCritical(45, 154);
  console.log('Address', 45, 154, a);
  console.log('Byte', unpackByte(a));
  console.log('Mask', unpackMask(a));
}
