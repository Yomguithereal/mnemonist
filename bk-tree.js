/**
 * Mnemonist BK Tree
 * ==================
 *
 * Implementation of a Burkhard-Keller tree, allowing fast lookups of words
 * that lie within a specified distance of the query word.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/BK-tree
 *
 * [Article]:
 * W. Burkhard and R. Keller. Some approaches to best-match file searching,
 * CACM, 1973
 */
// var iterateOver = require('./utils/iterate.js');

/**
 * BK Tree.
 *
 * @constructor
 * @param {function} distance - Distance function to use.
 */
function BKTree(distance) {

  if (typeof distance !== 'function')
    throw new Error('mnemonist/BKTree.constructor: given `distance` should be a function.');

  this.clear();
}

/**
 * Method used to clear the tree.
 *
 * @return {undefined}
 */
BKTree.prototype.clear = function() {

  // Properties
  this.size = 0;
};

/**
 * Exporting.
 */
module.exports = BKTree;
