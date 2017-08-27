/* eslint no-constant-condition: 0 */
/**
 * Mnemonist StaticDisjointSet
 * ============================
 *
 * JavaScript implementation of a static disjoint set (union-find).
 *
 * Note that to remain performant, this implementation needs to know a size
 * beforehand.
 */
var helpers = require('./utils/typed-arrays.js');

/**
 * StaticDisjointSet.
 *
 * @constructor
 */
function StaticDisjointSet(size) {

  // Optimizing the typed array types
  var ParentsTypedArray = helpers.getPointerArray(size),
      RanksTypedArray = helpers.getPointerArray(Math.log2(size));

  // Properties
  this.size = size;
  this.dimension = size;
  this.parents = new ParentsTypedArray(size);
  this.ranks = new RanksTypedArray(size);
}

/**
 * Method used to find the root of the given item.
 *
 * @param  {number} x - Target item.
 * @return {number}
 */
StaticDisjointSet.prototype.find = function(x) {
  var y = x;

  var c, p;

  while (true) {
    c = this.parents[y];

    if (y === c)
      break;

    y = c;
  }

  // Path compression
  while (true) {
    p = this.parents[x];

    if (x === p)
      break;

    this.parents[x] = y;
    x = p;
  }

  return y;
};

/**
 * Method used to perform the union of two items.
 *
 * @param  {number} x - First item.
 * @param  {number} y - Second item.
 * @return {StaticDisjointSet}
 */
StaticDisjointSet.prototype.union = function(x, y) {
  var xRoot = this.find(x),
      yRoot = this.find(y);

  // x and y are already in the same set
  if (xRoot === yRoot)
    return this;

  this.dimension--;

  // x and y are not in the same set, we merge them
  var xRank = this.ranks[x],
      yRank = this.ranks[y];

  if (xRank < yRank) {
    this.parents[xRoot] = yRoot;
  }
  else if (xRank > yRank) {
    this.parents[yRoot] = xRoot;
  }
  else {
    this.parents[yRoot] = xRoot;
    this.ranks[xRoot]++;
  }

  return this;
};

// TODO: possible to track size of sets

// i = 0;
// map = {};
// result = new Array(this.dimension);
// for set in sets:
//   if not root:
//     continue
//   result[i] = []
//   map[i++] = root

// for set in sets:
//   root = find(set)
//   result[map[root]].push(set)

// return result

// TODO: method returning sets map
// TODO: method to iterate over sets (need to use a linked multimap)
// TODO: method to test connectivity
// TODO: possibility to iterate on sets using a heap (convoluted)

/**
 * Exporting.
 */
module.exports = {
  StaticDisjointSet: StaticDisjointSet
};
