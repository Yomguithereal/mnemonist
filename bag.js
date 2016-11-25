/**
 * Mnemonist Bag
 * ==============
 *
 * Bag implementation.
 */

/**
 * Bag.
 *
 * @constructor
 */
function Bag() {
  this.clear();
}

/**
 * Method used to clear the bag.
 *
 * @return {undefined}
 */
Bag.prototype.clear = function() {

  // Properties
  this.items = new Map();
  this.size = 0;
  this.sum = 0;
};

/**
 * Method used to add an item to the bag.
 *
 * @param  {any}    item   - Item to add.
 * @param  {number} count  - Optional count.
 * @return {Bag}
 */
Bag.prototype.add = function(item, count) {
  if (arguments.length < 2)
    count = 1;

  var currentCount = this.items.get(item) || 0,
      newCount = currentCount + count;

  if (!this.items.has(item))
    this.size++;

  this.items.set(item, newCount);

  this.sum += count;

  return this;
};

/**
 * Method used to count the occurrences of the given item.
 *
 * @param  {any}    item - Item to count.
 * @return {number}
 */
Bag.prototype.count = function(item) {
  return this.items.get(item) || 0;
};

/**
 * Method used to check whether the item can be found in the bag.
 *
 * @param  {any}     item - Item to check.
 * @return {boolean}
 */
Bag.prototype.has = function(item) {
  return this.items.has(item);
};

/**
 * Method used to set the count of the given item.
 *
 * @param  {any}     item  - Item to check.
 * @param  {number}  count - Weight to set.
 * @return {Bag}
 */
Bag.prototype.set = function(item, count) {
  if (!this.items.has(item))
    return this.add(item, count);

  var currentCount = this.items.get(item),
      delta = count - currentCount;

  this.sum += delta;
  this.items.set(item, count);

  return this;
};

/**
 * Method used to completely delete an item from the bag.
 *
 * @param  {any}     item - Item to count.
 * @return {boolean}
 */
Bag.prototype.delete = function(item) {
  if (!this.items.has(item))
    return false;

  var count = this.count(item);

  this.size--;
  this.sum -= count;
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
Bag.prototype.remove = function(item, count) {
  if (arguments.length < 2)
    count = 1;

  if (!this.items.has(item))
    return false;

  var currentCount = this.count(item),
      newCount = Math.max(0, currentCount - count);

  if (!newCount) {
    this.items.delete(item);
    this.size--;
  }
  else {
    this.items.set(item, newCount);
  }

  this.sum -= Math.min(this.sum, count);

  return true;
};

/**
 * Method used to iterate over the bag.
 *
 * @param  {function}  callback - Iteration callback.
 * @param  {any}       scope    - Optional scope.
 * @return {undefined}
 */
Bag.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  return this.items.forEach.call(this.items, callback, scope);
};

/**
 * Convenience known methods.
 */
Bag.prototype.inspect = function() {
  var map = this.items;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(map, 'constructor', {
    value: Bag,
    enumerable: false
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = Bag;
