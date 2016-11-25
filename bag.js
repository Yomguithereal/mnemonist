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
 * @param  {number} weight - Optional weight.
 * @return {Bag}
 */
Bag.prototype.add = function(item, weight) {
  if (arguments.length < 2)
    weight = 1;

  var currentWeight = this.items.get(item) || 0,
      newWeight = currentWeight + weight;

  if (!this.items.has(item))
    this.size++;

  this.items.set(item, newWeight);

  this.sum += weight;

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
 * Method used to set the weight of the given item.
 *
 * @param  {any}     item - Item to check.
 * @param  {number}  weight - Weight to set.
 * @return {Bag}
 */
Bag.prototype.set = function(item, weight) {
  if (!this.items.has(item))
    return this.add(item, weight);

  var currentWeight = this.items.get(item),
      delta = weight - currentWeight;

  this.sum += delta;
  this.items.set(item, weight);

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

  var weight = this.count(item);

  this.size--;
  this.sum -= weight;
  this.items.delete(item);
  return true;
};

/**
 * Method used to add an item to the bag.
 *
 * @param  {any}    item   - Item to add.
 * @param  {number} weight - Optional weight.
 * @return {boolean}
 */
Bag.prototype.remove = function(item, weight) {
  if (arguments < 2)
    weight = 1;

  if (!this.items.has(item))
    return false;

  var currentWeight = this.count(item),
      newWeight = currentWeight - weight;

  if (!newWeight)
    this.items.delete(item);
  else
    this.items.set(item, newWeight);

  this.size--;
  this.sum -= weight;

  return true;
};

/**
 * Method used to iterate over the bag.
 *
 * @param  {function}  callback - Iteration callback.
 * @param  {any}       scope    - Optional scope.
 * @return {undefined}
 */
Bag.prototype.forEach = function() {
  return this.items.forEach.apply(this.items, arguments);
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
