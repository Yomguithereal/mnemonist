/**
 * Mnemonist HashedArrayTree
 * ==========================
 *
 * Abstract implementation of a hashed array tree representing arrays growing
 * dynamically.
 */

/**
 * Defaults.
 */
var DEFAULT_BLOCK_SIZE = 1024;

/**
 * Helpers.
 */
function powerOfTwo(x) {
  return (x & (x - 1)) === 0;
}

/**
 * HashedArrayTree.
 *
 * @constructor
 * @param {function}      ArrayClass           - An array constructor.
 * @param {number|object} initialSizeOrOptions - Self-explanatory.
 */
function HashedArrayTree(ArrayClass, initialSizeOrOptions) {

  /* eslint no-unused-vars: 0 */
  var initialSize = initialSizeOrOptions || 0,
      blockSize = DEFAULT_BLOCK_SIZE;

  if (typeof initialSizeOrOptions === 'object') {
    initialSize = initialSizeOrOptions.initialSize || 0;
    blockSize = initialSizeOrOptions.blockSize || DEFAULT_BLOCK_SIZE;
  }

  if (!blockSize || !powerOfTwo(blockSize))
    throw new Error('mnemonist/hashed-array-tree: block size should be a power of two.');

  this.ArrayClass = ArrayClass;
  this.length = 0;
  this.capacity = 0;
  this.blockSize = blockSize;
  this.blockLg2 = Math.log2(blockSize);
  this.blocks = new Array();
}

/**
 * Method used to set a value.
 *
 * @param  {number} index - Index to edit.
 * @param  {any}    value - Value.
 * @return {HashedArrayTree}
 */
HashedArrayTree.prototype.set = function(index, value) {
  var block = index >> this.blockLg2,
      i = index & (this.blockSize - 1);

  this.blocks[block][i] = value;

  return this;
};

/**
 * Method used to get a value.
 *
 * @param  {number} index - Index to retrieve.
 * @return {any}
 */
HashedArrayTree.prototype.get = function(index) {
  if (this.length < index)
    return;

  var block = index >> this.blockLg2,
      i = index & (this.blockSize - 1);

  return this.blocks[block][i];
};

/**
 * Method used to grow the array.
 *
 * @return {HashedArrayTree}
 */
HashedArrayTree.prototype.grow = function() {
  this.blocks.push(new this.ArrayClass(this.blockSize));
  this.capacity += this.blockSize;

  return this;
};

/**
 * Method used to push a value into the array.
 *
 * @param  {any}    value - Value to push.
 * @return {number}       - Length of the array.
 */
HashedArrayTree.prototype.push = function(value) {
  if (this.length >= this.capacity)
    this.grow();

  var index = this.length;

  var block = index >> this.blockLg2,
      i = index & (this.blockSize - 1);

  this.blocks[block][i] = value;

  return ++this.length;
};

/**
 * Method used to pop the last value of the array.
 *
 * @return {number} - The popped value.
 */
HashedArrayTree.prototype.pop = function() {
  var lastBlock = this.blocks[this.blocks.length - 1];

  var i = (--this.length) & (this.blockSize - 1);

  return lastBlock[i];
};

/**
 * Convenience known methods.
 */
HashedArrayTree.prototype.inspect = function() {
  return this;
  // var proxy = this.array.slice(0, this.length);

  // proxy.type = this.ArrayClass.name;

  // // Trick so that node displays the name of the constructor
  // Object.defineProperty(proxy, 'constructor', {
  //   value: HashedArrayTree,
  //   enumerable: false
  // });

  // return proxy;
};

/**
 * Exporting.
 */
module.exports = HashedArrayTree;
