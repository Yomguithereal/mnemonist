/* eslint no-constant-condition: 0 */

/* eslint-disable */

/**
 * Mnemonist FixedFixedCritBitTreeMap
 * ==============================
 *
 * TODO...
 *
 * [References]:
 * https://cr.yp.to/critbit.html
 * https://www.imperialviolet.org/binary/critbit.pdf
 */
var bitwise = require('./utils/bitwise.js'),
    typed = require('./utils/typed-arrays.js');

/**
 * Helpers.
 */

/**
 * Helper returning the direction we need to take given a key and an
 * encoded critbit.
 *
 * @param  {string} key     - Target key.
 * @param  {number} critbit - Packed address of byte + mask.
 * @return {number}         - 0, left or 1, right.
 */
function getDirection(key, critbit) {
  var byte = key.charCodeAt(critbit >> 8),
      mask = critbit & 0xff;

  return (1 + (byte | mask)) >> 8;
}

/**
 * Helper returning the packed address of byte + mask or -1 if strings
 * are identical.
 *
 * @param  {string} a      - First key.
 * @param  {string} b      - Second key.
 * @return {number}        - Packed address of byte + mask.
 */
function findCriticalBit(a, b) {
  var i = 0,
      tmp;

  // Swapping so a is the shortest
  if (a.length > b.length) {
    tmp = b;
    b = a;
    a = tmp;
  }

  var l = a.length,
      mask;

  while (i < l) {
    if (a[i] !== b[i]) {
      mask = bitwise.criticalBit8Mask(
        a.charCodeAt(i),
        b.charCodeAt(i)
      );

      return (i << 8) | mask;
    }

    i++;
  }

  // Strings are identical
  if (a.length === b.length)
    return -1;

  mask = bitwise.criticalBit8Mask(b.charCodeAt(i), 0);

  return (i << 8) | mask;
}

/**
 * FixedCritBitTreeMap.
 *
 * @constructor
 */
function FixedCritBitTreeMap(capacity) {

  // Properties
  this.capacity = capacity;
  this.root = 0;
  this.size = 0;

  var PointerArray = new PointerArray(capacity);

  this.keys = new Array(capacity);
  this.values = new Array(capacity);
  this.lefts = new PointerArray(capacity);
  this.rights = new PointerArray(capacity);
  this.critbits = new Int32Array(capacity);

  this.clear();
}

/**
 * Method used to clear the FixedCritBitTreeMap.
 *
 * @return {undefined}
 */
FixedCritBitTreeMap.prototype.clear = function() {

  // Properties
  // TODO...
  this.root = null;
  this.size = 0;
};

/**
 * Method used to set the value of the given key in the trie.
 *
 * @param  {string}         key   - Key to set.
 * @param  {any}            value - Arbitrary value.
 * @return {FixedCritBitTreeMap}
 */
FixedCritBitTreeMap.prototype.set = function(key, value) {
  var pointer;

  // Tree is empty
  if (this.size === 0) {
    pointer = this.size;

    this.root = pointer + 1;
    this.keys[pointer] = key;
    this.values[pointer] = value;

    this.size++;

    return this;
  }

  // Walk state
  var node = this.root,
      ancestors = [],
      path = [],
      ancestor,
      parent,
      child,
      critbit,
      internal,
      left,
      leftPath,
      best,
      dir,
      i,
      l;

  // Walking the tree
  while (true) {

    // Traversing an internal node
    if (node instanceof InternalNode) {
      dir = getDirection(key, node.critbit);

      // Going left & creating key if not yet there
      if (dir === 0) {
        if (!node.left) {
          node.left = new ExternalNode(key, value);
          return this;
        }

        ancestors.push(node);
        path.push(true);

        node = node.left;
      }

      // Going right & creating key if not yet there
      else {
        if (!node.right) {
          node.right = new ExternalNode(key, value);
          return this;
        }

        ancestors.push(node);
        path.push(false);

        node = node.right;
      }
    }

    // Reaching an external node
    else {

      // 1. Creating a new external node
      critbit = findCriticalBit(key, node.key);

      // Key is identical, we just replace the value
      if (critbit === -1) {
        node.value = value;
        return this;
      }

      this.size++;

      internal = new InternalNode(critbit);

      left = getDirection(key, critbit) === 0;

      // TODO: maybe setting opposite pointer is not necessary
      if (left) {
        internal.left = new ExternalNode(key, value);
        internal.right = node;
      }
      else {
        internal.left = node;
        internal.right = new ExternalNode(key, value);
      }

      // 2. Bubbling up
      best = -1;
      l = ancestors.length;

      for (i = l - 1; i >= 0; i--) {
        ancestor = ancestors[i];

        // TODO: this may mess up letter order somehow
        if (ancestor.critbit > critbit)
          continue;

        best = i;
        break;
      }

      // Do we need to attach to the root?
      if (best < 0) {
        this.root = internal;

        // Need to rewire parent as child?
        if (l > 0) {
          parent = ancestors[0];

          if (left)
            internal.right = parent;
          else
            internal.left = parent;
        }
      }

      // Simple case without rotation
      else if (best === l - 1) {
        parent = ancestors[best];
        leftPath = path[best];

        if (leftPath)
          parent.left = internal;
        else
          parent.right = internal;
      }

      // Full rotation
      else {
        parent = ancestors[best];
        leftPath = path[best];
        child = ancestors[best + 1];

        if (leftPath)
          parent.left = internal;
        else
          parent.right = internal;

        if (left)
          internal.right = child;
        else
          internal.left = child;
      }

      return this;
    }
  }
};

/**
 * Method used to get the value attached to the given key in the tree or
 * undefined if not found.
 *
 * @param  {string} key   - Key to get.
 * @return {any}
 */
FixedCritBitTreeMap.prototype.get = function(key) {

  // Walk state
  var node = this.root,
      dir;

  // Walking the tree
  while (true) {

    // Dead end
    if (node === null)
      return;

    // Traversing an internal node
    if (node instanceof InternalNode) {
      dir = getDirection(key, node.critbit);

      node = dir ? node.right : node.left;
    }

    // Reaching an external node
    else {
      if (node.key !== key)
        return;

      return node.value;
    }
  }
};

/**
 * Method used to return whether the given key exists in the tree.
 *
 * @param  {string} key - Key to test.
 * @return {boolean}
 */
FixedCritBitTreeMap.prototype.has = function(key) {

  // Walk state
  var node = this.root,
      dir;

  // Walking the tree
  while (true) {

    // Dead end
    if (node === null)
      return false;

    // Traversing an internal node
    if (node instanceof InternalNode) {
      dir = getDirection(key, node.critbit);

      node = dir ? node.right : node.left;
    }

    // Reaching an external node
    else {
      return node.key === key;
    }
  }
};

/**
 * Method used to delete the given key from the tree and return whether the
 * key did exist or not.
 *
 * @param  {string} key - Key to delete.
 * @return {boolean}
 */
FixedCritBitTreeMap.prototype.delete = function(key) {

  // Walk state
  var node = this.root,
      dir;

  var parent = null,
      grandParent = null,
      wentLeftForParent = false,
      wentLeftForGrandparent = false;

  // Walking the tree
  while (true) {

    // Dead end
    if (node === null)
      return false;

    // Traversing an internal node
    if (node instanceof InternalNode) {
      dir = getDirection(key, node.critbit);

      if (dir === 0) {
        grandParent = parent;
        wentLeftForGrandparent = wentLeftForParent;
        parent = node;
        wentLeftForParent = true;

        node = node.left;
      }
      else {
        grandParent = parent;
        wentLeftForGrandparent = wentLeftForParent;
        parent = node;
        wentLeftForParent = false;

        node = node.right;
      }
    }

    // Reaching an external node
    else {
      if (key !== node.key)
        return false;

      this.size--;

      // Rewiring
      if (parent === null) {
        this.root = null;
      }

      else if (grandParent === null) {
        if (wentLeftForParent)
          this.root = parent.right;
        else
          this.root = parent.left;
      }

      else {
        if (wentLeftForGrandparent) {
          if (wentLeftForParent) {
            grandParent.left = parent.right;
          }
          else {
            grandParent.left = parent.left;
          }
        }
        else {
          if (wentLeftForParent) {
            grandParent.right = parent.right;
          }
          else {
            grandParent.right = parent.left;
          }
        }
      }

      return true;
    }
  }
};

/**
 * Method used to iterate over the tree in key order.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
FixedCritBitTreeMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  // Inorder traversal of the tree
  var current = this.root,
      stack = [];

  while (true) {

    if (current !== null) {
      stack.push(current);

      current = current instanceof InternalNode ? current.left : null;
    }

    else {
      if (stack.length > 0) {
        current = stack.pop();

        if (current instanceof ExternalNode)
          callback.call(scope, current.value, current.key);

        current = current instanceof InternalNode ? current.right : null;
      }
      else {
        break;
      }
    }
  }
};

/**
 * Convenience known methods.
 */
FixedCritBitTreeMap.prototype.inspect = function() {
  return this;
};

if (typeof Symbol !== 'undefined')
  FixedCritBitTreeMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = FixedCritBitTreeMap.prototype.inspect;

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a FixedCritBitTreeMap.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {FixedCritBitTreeMap}
 */
// FixedCritBitTreeMap.from = function(iterable) {

// };

/**
 * Exporting.
 */
module.exports = FixedCritBitTreeMap;
