/**
 * Mnemonist MultiSet
 * ===================
 *
 * MultiSet implementation.
 */

/**
 * MultiSet.
 *
 * @constructor
 */
function MultiSet() {
  this.clear();
}

/**
 * Method used to clear the bag.
 *
 * @return {undefined}
 */
MultiSet.prototype.clear = function() {

  // Properties
  this.items = new Map();
  this.distinctSize = 0;
  this.size = 0;
};

/**
 * Method used to add an item to the bag.
 *
 * @param  {any}    item   - Item to add.
 * @param  {number} count  - Optional count.
 * @return {MultiSet}
 */
MultiSet.prototype.add = function(item, count) {
  if (arguments.length < 2)
    count = 1;

  var currentCount = this.items.get(item) || 0,
      newCount = currentCount + count;

  if (!this.items.has(item))
    this.distinctSize++;

  this.items.set(item, newCount);

  this.size += count;

  return this;
};

/**
 * Method used to count the occurrences of the given item.
 *
 * @param  {any}    item - Item to count.
 * @return {number}
 */
MultiSet.prototype.count = function(item) {
  return this.items.get(item) || 0;
};

/**
 * Method used to check whether the item can be found in the bag.
 *
 * @param  {any}     item - Item to check.
 * @return {boolean}
 */
MultiSet.prototype.has = function(item) {
  return this.items.has(item);
};

/**
 * Method used to set the count of the given item.
 *
 * @param  {any}     item  - Item to check.
 * @param  {number}  count - Weight to set.
 * @return {MultiSet}
 */
MultiSet.prototype.set = function(item, count) {
  if (!this.items.has(item))
    return this.add(item, count);

  var currentCount = this.items.get(item),
      delta = count - currentCount;

  this.size += delta;
  this.items.set(item, count);

  return this;
};

/**
 * Method used to completely delete an item from the bag.
 *
 * @param  {any}     item - Item to count.
 * @return {boolean}
 */
MultiSet.prototype.delete = function(item) {
  if (!this.items.has(item))
    return false;

  var count = this.count(item);

  this.distinctSize--;
  this.size -= count;
  this.items.delete(item);
  return true;
};

/**
 * Method used to add an item to the bag.
 *
 * @param  {any}    item  - Item to add.
 * @param  {number} count - Optional count.
 * @return {boolean}
 */
MultiSet.prototype.remove = function(item, count) {
  if (arguments.length < 2)
    count = 1;

  if (!this.items.has(item))
    return false;

  var currentCount = this.count(item),
      newCount = Math.max(0, currentCount - count);

  if (!newCount) {
    this.items.delete(item);
    this.distinctSize--;
  }
  else {
    this.items.set(item, newCount);
  }

  this.size -= Math.min(this.size, count);

  return true;
};

/**
 * Convenience known methods.
 */
MultiSet.prototype.inspect = function() {
  var map = this.items;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(map, 'constructor', {
    value: MultiSet,
    enumerable: false
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = MultiSet;
