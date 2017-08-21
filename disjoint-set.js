/**
 * Mnemonist Disjoint Set
 * =======================
 *
 * JavaScript implementation of a Disjoint Set (Union-Find).
 */
var iterateOver = require('./utils/iterate.js');

// TODO: do we have path compression?
// TODO: path compression means we re-attach to the root each time this is possible
// TODO: use the python version to polish

/**
 * DisjointSet.
 *
 * @constructor
 */
function DisjointSet() {
  this.clear();
}

/**
 * Method used to clear the set.
 *
 * @return {undefined}
 */
DisjointSet.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;
  this.items = new Map();
  this.indexToItems = [];
  this.parents = [];
  this.ranks = [];
};

/**
 * Method used to add an item to the set.
 *
 * @param  {any} item - Item to add.
 * @return {DisjointSet}
 */
function add(set, item) {
  var index = set.items.get(item);

  if (typeof index === 'number')
    return index;

  index = set.parents.length;
  set.indexToItems.push(item);
  set.items.set(item, index);
  set.parents.push(index);
  set.ranks.push(0);

  set.size++;
  set.dimension++;

  return index;
}

DisjointSet.prototype.add = function(item) {
  add(this, item);
  return this;
};

/**
 * Method used to find the set's root for the given item.
 *
 * @param  {any}    i - Item.
 * @return {number}
 */
function find(parents, i) {
  do {
    i = parents[i];
  } while (parents[i] !== i);

  return i;
}

DisjointSet.prototype.find = function(i) {

  // TODO: should probably not add
  return find(this.parents, add(this, i));
};

/**
 * Method used to join two items.
 *
 * @param  {any} i - First item.
 * @param  {any} j - Second item.
 * @return {DisjointSet}
 */
DisjointSet.prototype.union = function(i, j) {
  var iIndex = add(this, i),
      jIndex = add(this, j);

  var iParent = find(this.parents, iIndex),
      jParent = find(this.parents, jIndex);

  // Elements are already in the same set
  if (iParent === jParent)
    return this;

  var iRank = this.ranks[i],
      jRank = this.ranks[j];

  this.dimension--;

  // If i's rank is less than j's
  if (iRank < jRank) {

    // i comes under j
    this.parents[iParent] = jParent;
  }

  // If j's rank is less than i's
  else if (jRank < iRank) {

    // j comes under i
    this.parents[jParent] = iParent;
  }

  // If their ranks are the same
  else {
    this.parents[iParent] = jParent;
    this.ranks[jParent]++;
  }

  return this;
};

/**
 * DisjointSet Iterator class.
 */
function DisjointSetIterator(next) {
  this.next = next;
}

/**
 * Method returning an iterator over the contained sets.
 *
 * @return {DisjointSetIterator}
 */
DisjointSet.prototype.sets = function() {
  return new DisjointSetIterator(function() {

  });
};

/**
 * Convenience known methods.
 */
DisjointSet.prototype.inspect = function() {
  var setsIndex = {},
      sets = [];

  var i, l, s;

  for (i = 0, l = this.parents.length; i < l; i++) {
    s = find(this.parents, i);

    setsIndex[s] = setsIndex[s] || [];
    setsIndex[s].push(this.indexToItems[i]);
  }

  for (s in setsIndex)
    sets.push(setsIndex[s]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(sets, 'constructor', {
    value: DisjointSet,
    enumerable: false
  });

  return sets;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {DisjointSet}
 */
DisjointSet.from = function(iterable) {
  var set = new DisjointSet();

  iterateOver(iterable, function(value) {
    set.add(value);
  });

  return set;
};

/**
 * Exporting.
 */
module.exports = DisjointSet;
