/* eslint no-unused-vars: 0 */
/**
 * Mnemonist Disjoint Set
 * =======================
 *
 * JavaScript implementation of a Disjoint Set (Union-Find).
 */
var iterateOver = require('./utils/iterate.js');

function incrementalId() {
  var i = 0;

  return function() {
    return i++;
  };
}

function find(parents, i) {

  do {
    i = parents[i];
  } while (parents[i] !== i);

  return i;
}

function union(parents, i, j) {
  var ip = find(parents, i),
      jp = find(parents, j);

  parents[ip] = jp;
}

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
  this.id = incrementalId();
  this.size = 0;
  this.items = new Map();
  this.parents = [];
};

/**
 * Method used to add an item to the set.
 *
 * @param  {any} item - Item to add.
 * @return {undefined}
 */
DisjointSet.prototype.add = function() {

};

/**
 * Method used to join two items.
 *
 * @param  {any} A - First item.
 * @param  {any} B - Second item.
 * @return {undefined}
 */
DisjointSet.prototype.union = function() {

};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {DisjointSet}
 */
DisjointSet.from = function(iterable) {

};

/**
 * Exporting.
 */
module.exports = DisjointSet;
