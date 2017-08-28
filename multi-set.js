/**
 * Mnemonist MultiSet
 * ====================
 *
 * JavaScript implementation of a MultiSet.
 */
var Iterator = require('obliterator/iterator'),
    iterateOver = require('./utils/iterate.js');

/**
 * MultiSet.
 *
 * @constructor
 */
function MultiSet() {
  this.items = new Map();

  Object.defineProperty(this.items, 'constructor', {
    value: MultiSet,
    enumerable: false
  });

  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
MultiSet.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;
  this.items.clear();
};

/**
 * Method used to add an item to the set.
 *
 * @param  {any}    item  - Item to add.
 * @param  {number} count - Optional count.
 * @return {MultiSet}
 */
MultiSet.prototype.add = function(item, count) {
  count = count || 1;

  this.size += count;

  if (!this.items.has(item)) {
    this.dimension++;
  }
  else {
    count += this.items.get(item);
  }

  this.items.set(item, count);

  return this;
};

/**
 * Method used to return whether the item exists in the set.
 *
 * @param  {any} item  - Item to check.
 * @return {boolan}
 */
MultiSet.prototype.has = function(item) {
  return this.items.has(item);
};

/**
 * Method used to delete an item from the set.
 *
 * @param  {any} item  - Item to delete.
 * @return {boolan}
 */
MultiSet.prototype.delete = function(item) {
  var count = this.multiplicity(item);

  this.size -= count;
  this.dimension--;
  this.items.delete(item);

  return !!count;
};

/**
 * Method used to remove an item from the set.
 *
 * @param  {any} item  - Item to delete.
 * @param  {number} count - Optional count.
 * @return {undefined}
 */
MultiSet.prototype.remove = function(item, count) {
  count = count || 1;

  var currentCount = this.multiplicity(item),
      newCount = Math.max(0, currentCount - count);

  if (!newCount) {
    this.delete(item);
  }
  else {
    this.items.set(item, newCount);
    this.size -= (currentCount - newCount);
  }

  return;
};

/**
 * Method used to return the multiplicity of the given item.
 *
 * @param  {any} item  - Item to get.
 * @return {number}
 */
MultiSet.prototype.multiplicity = function(item) {
  return this.items.get(item) || 0;
};

/**
 * Method used to iterate over the set's values.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiSet.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var i;

  this.items.forEach(function(multiplicty, value) {

    for (i = 0; i < multiplicty; i++)
      callback.call(scope, value, value);
  });
};

/**
 * Method returning an iterator over the set's values.
 *
 * @return {Iterator}
 */
MultiSet.prototype.values = function() {
  var iterator = this.items.entries(),
      inContainer = false,
      step,
      value,
      multiplicty,
      i;

  return new Iterator(function next() {
    if (!inContainer) {
      step = iterator.next();

      if (step.done)
        return {done: true};

      inContainer = true;
      value = step.value[0];
      multiplicty = step.value[1];
      i = 0;
    }

    if (i >= multiplicty) {
      inContainer = false;
      return next();
    }

    i++;

    return {
      done: false,
      value: value
    };
  });
};

/**
 * Method returning an iterator over the set's multiplicities.
 *
 * @return {Iterator}
 */
MultiSet.prototype.multiplicities = function() {
  return this.items.entries();
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  MultiSet.prototype[Symbol.iterator] = MultiSet.prototype.values;

/**
 * Convenience known methods.
 */
MultiSet.prototype.inspect = function() {
  return this.items;
};
MultiSet.prototype.toJSON = function() {
  return this.items;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {MultiSet}
 */
MultiSet.from = function(iterable) {
  var set = new MultiSet();

  iterateOver(iterable, function(value) {
    set.add(value);
  });

  return set;
};

/**
 * Exporting.
 */
module.exports = MultiSet;
