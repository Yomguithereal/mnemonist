/**
 * Mnemonist SparseQueueSet
 * =========================
 *
 * JavaScript sparse queue set implemented on top of byte arrays.
 *
 * [Reference]: https://research.swtch.com/sparse
 */
var Iterator = require('obliterator/iterator'),
    getPointerArray = require('./utils/typed-arrays.js').getPointerArray;

/**
 * SparseQueueSet.
 *
 * @constructor
 */
function SparseQueueSet(length) {

  var ByteArray = getPointerArray(length);

  // Properties
  this.start = 0;
  this.size = 0;
  this.length = length;
  this.dense = new ByteArray(length);
  this.sparse = new ByteArray(length);
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SparseQueueSet.prototype.clear = function() {
  this.start = 0;
  this.size = 0;
};

/**
 * Method used to check the existence of a member in the queue.
 *
 * @param  {number} member - Member to test.
 * @return {SparseQueueSet}
 */
SparseQueueSet.prototype.has = function(member) {
  var index = this.sparse[member];

  return (
    index < this.size &&
    this.dense[index] === member
  );
};

/**
 * Method used to add a member to the queue.
 *
 * @param  {number} member - Member to add.
 * @return {SparseQueueSet}
 */
SparseQueueSet.prototype.enqueue = function(member) {
  var index = this.sparse[member];

  if (index < this.size && this.dense[index] === member)
    return this;

  this.dense[this.size] = member;
  this.sparse[member] = this.size;
  this.size++;

  return this;
};

/**
 * Method used to remove a member from the queue.
 *
 * @param  {number} member - Member to delete.
 * @return {boolean}
 */
SparseQueueSet.prototype.delete = function(member) {
  var index = this.sparse[member];

  if (index >= this.size || this.dense[index] !== member)
    return false;

  index = this.dense[this.size - 1];
  this.dense[this.sparse[member]] = index;
  this.sparse[index] = this.sparse[member];
  this.size--;

  return true;
};

/**
 * Method used to iterate over the queue's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
SparseQueueSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var item;

  for (var i = 0; i < this.size; i++) {
    item = this.dense[i];

    callback.call(scope, item, item);
  }
};

/**
 * Method used to create an iterator over a set's values.
 *
 * @return {Iterator}
 */
SparseQueueSet.prototype.values = function() {
  var size = this.size,
      dense = this.dense,
      i = 0;

  return new Iterator(function() {
    if (i < size) {
      var item = dense[i];
      i++;

      return {
        value: item
      };
    }

    return {
      done: true
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  SparseQueueSet.prototype[Symbol.iterator] = SparseQueueSet.prototype.values;

/**
 * Convenience known methods.
 */
SparseQueueSet.prototype.inspect = function() {
  var proxy = new Set();

  for (var i = 0; i < this.size; i++)
    proxy.add(this.dense[i]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: SparseQueueSet,
    enumerable: false
  });

  proxy.length = this.length;

  return proxy;
};

if (typeof Symbol !== 'undefined')
  SparseQueueSet.prototype[Symbol.for('nodejs.util.inspect.custom')] = SparseQueueSet.prototype.inspect;

/**
 * Exporting.
 */
module.exports = SparseQueueSet;
