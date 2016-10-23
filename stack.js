/**
 * Mnemonist Stack
 * ================
 *
 * Stack implementation relying on JavaScript arrays, which are fast enough &
 * correctly optimized for this kind of work.
 */

/**
 * Stack
 *
 * @constructor
 */
function Stack() {
  this.clear();
}

/**
 * Method used to clear the stack.
 *
 * @return {undefined}
 */
Stack.prototype.clear = function() {

  // Properties
  this.items = [];
  this.size = 0;
};

/**
 * Method used to add an item to the stack.
 *
 * @param  {any}    item - Item to add.
 * @return {number}
 */
Stack.prototype.push = function(item) {
  this.items.push(item);
  return ++this.size;
};

/**
 * Method used to retrieve & remove the last item of the stack.
 *
 * @return {any}
 */
Stack.prototype.pop = function() {
  this.size--;
  return this.items.pop();
};

/**
 * Method used to get the last item of the stack.
 *
 * @return {any}
 */
Stack.prototype.peek = function() {
  return this.items[this.items.length - 1];
};

/**
 * Method used to iterate over the stack.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
Stack.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.items.length; i < l; i++)
    callback.call(scope, this.items[l - i - 1], i, this);
};

/**
 * Method used to convert the stack to a JavaScript array.
 *
 * @return {array}
 */
Stack.prototype.toArray = function() {
  return this.items.slice(0).reverse();
};

/**
 * Convenience known methods.
 */
Stack.prototype.toString = function() {
  return this.toArray().join(',');
};

Stack.prototype.toJSON = function() {
  return this.toArray();
};

Stack.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: Stack,
    enumerable: false
  });

  return array;
};

/**
 * Exporting.
 */
module.exports = Stack;
