/**
 * Mnemonist FiniteStack
 * ======================
 *
 * The finite stack is a stack whose capacity is defined beforehand and that
 * cannot be exceeded. This class is really useful when combined with
 * byte arrays to save up some memory and avoid memory re-allocation, hence
 * speeding up computations.
 *
 * This has however a downside: you need to know the maximum size you stack
 * can have during your iteration (which is not too difficult to compute when
 * performing, say, a DFS on a balanced binary tree).
 */
var Iterator = require('obliterator/iterator'),
    iterate = require('./utils/iterate.js');

/**
 * FiniteStack
 *
 * @constructor
 * @param {function} ArrayClass - Array class to use.
 * @param {number}   capacity   - Desired capacity.
 */
function FiniteStack(ArrayClass, capacity) {

  if (arguments.length < 2)
    throw new Error('mnemonist/finite-stack: expecting an Array class and a capacity.');

  if (typeof capacity !== 'number' || capacity <= 0)
    throw new Error('mnemonist/finite-stack: `capacity` should be a positive number.');

  this.capacity = capacity;
  this.ArrayClass = ArrayClass;
  this.clear();
}

/**
 * Method used to clear the stack.
 *
 * @return {undefined}
 */
FiniteStack.prototype.clear = function() {

  // Properties
  this.items = new this.ArrayClass(this.capacity);
  this.size = 0;
};

/**
 * Method used to add an item to the stack.
 *
 * @param  {any}    item - Item to add.
 * @return {number}
 */
FiniteStack.prototype.push = function(item) {
  if (this.size === this.capacity)
    throw new Error('mnemonist/finite-stack: stack capacity (' + this.capacity + ') exceeded!');

  this.items[this.size++] = item;
  return this.size;
};

/**
 * Method used to retrieve & remove the last item of the stack.
 *
 * @return {any}
 */
FiniteStack.prototype.pop = function() {
  return this.items[--this.size];
};

/**
 * Method used to get the last item of the stack.
 *
 * @return {any}
 */
FiniteStack.prototype.peek = function() {
  return this.items[this.size - 1];
};

/**
 * Method used to iterate over the stack.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
FiniteStack.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  for (var i = 0, l = this.items.length; i < l; i++)
    callback.call(scope, this.items[l - i - 1], i, this);
};

/**
 * Method used to convert the stack to a JavaScript array.
 *
 * @return {array}
 */
FiniteStack.prototype.toArray = function() {
  var array = new this.ArrayClass(this.size),
      l = this.size - 1,
      i = this.size;

  while (i--)
    array[i] = this.items[l - i];

  return array;
};

/**
 * Method used to create an iterator over a stack's values.
 *
 * @return {Iterator}
 */
FiniteStack.prototype.values = function() {
  var items = this.items,
      l = this.size,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[l - i - 1];
    i++;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a stack's entries.
 *
 * @return {Iterator}
 */
FiniteStack.prototype.entries = function() {
  var items = this.items,
      l = this.size,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {
        done: true
      };

    var value = items[l - i - 1];

    return {
      value: [i++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  FiniteStack.prototype[Symbol.iterator] = FiniteStack.prototype.values;


/**
 * Convenience known methods.
 */
FiniteStack.prototype.toString = function() {
  return this.toArray().join(',');
};

FiniteStack.prototype.toJSON = function() {
  return this.toArray();
};

FiniteStack.prototype.inspect = function() {
  var array = this.toArray();

  array.capacity = this.capacity;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: FiniteStack,
    enumerable: false
  });

  return array;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a stack.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} ArrayClass - Array class to use.
 * @param  {number}   capacity   - Desired capacity.
 * @return {FiniteStack}
 */
FiniteStack.from = function(iterable, ArrayClass, capacity) {

  if (arguments.length < 3) {
    capacity = iterate.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/finite-stack.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }

  var stack = new FiniteStack(ArrayClass, capacity);

  iterate(iterable, function(value) {
    stack.push(value);
  });

  return stack;
};

/**
 * Exporting.
 */
module.exports = FiniteStack;
