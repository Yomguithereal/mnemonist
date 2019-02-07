/* eslint no-constant-condition: 0 */
/**
 * Mnemonist CritBitTreeMap
 * =========================
 *
 * JavaScript implementation of a crit-bit tree, also called PATRICIA tree.
 * This tree is a basically a bitwise radix tree and is supposedly much more
 * efficient than a standard Trie.
 *
 * [References]:
 * https://cr.yp.to/critbit.html
 * https://www.imperialviolet.org/binary/critbit.pdf
 */
var bitwise = require('./utils/bitwise.js');

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
 * @param  {number} offset - Byte offset.
 * @return {number}        - Packed address of byte + mask.
 */
function findCriticalBit(a, b, offset) {
  var i = offset,
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

  mask = bitwise.criticalBit8Mask(b.charCodeAt(i + 1), 0);

  return (i << 8) | mask;
}

/**
 * Class representing a crit-bit tree's internal node.
 *
 * @constructor
 * @param {number} critbit - Packed address of byte + mask.
 */
function InternalNode(critbit) {
  this.critbit = critbit;
  this.left = null;
  this.right = null;
}

/**
 * Class representing a crit-bit tree's external node.
 * Note that it is possible to replace those nodes by flat arrays.
 *
 * @constructor
 * @param {string} key   - Node's key.
 * @param {any}    value - Arbitrary value.
 */
function ExternalNode(key, value) {
  this.key = key;
  this.value = value;
}

/**
 * CritBitTreeMap.
 *
 * @constructor
 */
function CritBitTreeMap() {

  // Properties
  this.root = null;
  this.size = 0;
  this.keys = [];
  this.values = [];

  this.clear();
}

/**
 * Method used to clear the CritBitTreeMap.
 *
 * @return {undefined}
 */
CritBitTreeMap.prototype.clear = function() {

  // Properties
  this.root = null;
  this.size = 0;
};

/**
 * Method used to set the value of the given key in the trie.
 *
 * @param  {string}         key   - Key to set.
 * @param  {any}            value - Arbitrary value.
 * @return {CritBitTreeMap}
 */
CritBitTreeMap.prototype.set = function(key, value) {

  // Tree is empty
  if (this.size === 0) {
    this.root = new ExternalNode(key, value);
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
      offset = 0,
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
        offset = node.critbit >> 8;

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
        offset = node.critbit >> 8;

        node = node.right;
      }
    }

    // Reaching an external node
    else {

      // 1. Creating a new external node
      critbit = findCriticalBit(key, node.key, offset);

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
        leftPath = ancestor[best];
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
CritBitTreeMap.prototype.get = function(key) {

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
CritBitTreeMap.prototype.has = function(key) {

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
 * Convenience known methods.
 */
CritBitTreeMap.prototype.inspect = function() {
  return this;
};

if (typeof Symbol !== 'undefined')
  CritBitTreeMap.prototype[Symbol.for('nodejs.util.inspect.custom')] = CritBitTreeMap.prototype.inspect;

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a CritBitTreeMap.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {CritBitTreeMap}
 */
// CritBitTreeMap.from = function(iterable) {

// };

/**
 * Exporting.
 */
module.exports = CritBitTreeMap;
