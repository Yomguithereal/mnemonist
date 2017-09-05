/* eslint no-constant-condition: 0 */
/**
 * Mnemonist SemiDynamicTrie
 * ==========================
 *
 * Lowlevel Trie working at character level, storing information in typed
 * array and organizing its children in linked lists.
 */
var DynamicArray = require('./dynamic-array.js');

/**
 * SemiDynamicTrie.
 *
 * @constructor
 */
function SemiDynamicTrie() {

  // Properties
  this.characters = new DynamicArray.DynamicUint8Array(256);
  this.nextPointers = new DynamicArray.DynamicUint32Array(256);
  this.childPointers = new DynamicArray.DynamicUint32Array(256);
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
SemiDynamicTrie.prototype.clear = function() {

  // Properties
};

SemiDynamicTrie.prototype.ensureSibling = function(block, character) {
  var nextCharacter,
      nextBlock;

  // Do we have a root?
  if (this.characters.length === 0) {

    // TODO: fix
    this.nextPointers.push(0);
    this.childPointers.push(0);
    this.characters.push(character);

    return block;
  }

  while (true) {
    nextCharacter = this.characters.get(block);

    if (nextCharacter === character)
      return block;

    nextBlock = this.nextPointers.get(block);

    if (nextBlock === 0)
      break;

    block = nextBlock;
  }

  // We append the characted to the list
  var newBlock = this.characters.length;

  // TODO: fix
  this.nextPointers.push(0);
  this.childPointers.push(0);
  this.nextPointers.set(block, newBlock);
  this.characters.push(character);

  return newBlock;
};

SemiDynamicTrie.prototype.findSibling = function(block, character) {
  var nextCharacter;

  while (true) {
    nextCharacter = this.characters.get(block);

    if (nextCharacter === character)
      return block;

    block = this.nextPointers.get(block);

    if (block === 0)
      return -1;
  }
};

SemiDynamicTrie.prototype.add = function(key) {
  var keyCharacter,
      childBlock,
      block = 0;

  var i = 0, l = key.length;

  // Going as far as possible
  while (i < l) {
    keyCharacter = key.charCodeAt(i);

    // Ensuring a correct sibling exists
    block = this.ensureSibling(block, keyCharacter);

    i++;

    if (i < l) {

      // Descending
      childBlock = this.childPointers.get(block);

      if (childBlock === 0)
        break;

      block = childBlock;
    }
  }

  // Adding as many blocks as necessary
  while (i < l) {

    childBlock = this.characters.length;
    this.characters.push(key.charCodeAt(i));

    // TODO: fix
    this.childPointers.push(0);
    this.nextPointers.push(0);
    this.childPointers.set(block, childBlock);

    block = childBlock;

    i++;
  }
};

SemiDynamicTrie.prototype.has = function(key) {
  var i, l;

  var block = 0,
      siblingBlock;

  for (i = 0, l = key.length; i < l; i++) {
    siblingBlock = this.findSibling(block, key.charCodeAt(i));

    if (siblingBlock === -1)
      return false;

    if (i === l - 1)
      return true;

    block = this.childPointers.get(siblingBlock);

    if (block === 0)
      return false;
  }

  // TODO: fix, should have a leaf pointer somehow
  return true;
};

/**
 * Exporting.
 */
module.exports = SemiDynamicTrie;
