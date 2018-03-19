/**
 * Mnemonist CircularBuffer
 * =========================
 *
 * Circular buffer implementation fit to use as a finite deque.
 */
var iterate = require('./utils/iterate.js'),
    Iterator = require('obliterator/iterator');

/**
 * CircularBuffer.
 *
 * @constructor
 */
function CircularBuffer(ArrayClass, capacity) {

  if (arguments.length < 2)
    throw new Error('mnemonist/circular-buffer: expecting an Array class and a capacity.');

  if (typeof capacity !== 'number' || capacity <= 0)
    throw new Error('mnemonist/circular-buffer: `capacity` should be a positive number.');

  this.ArrayClass = ArrayClass;
  this.capacity = capacity;
  this.items = new ArrayClass(this.capacity);
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
CircularBuffer.prototype.clear = function() {

  // Properties
  this.start = 0;
  this.size = 0;
};

/**
 * Method used to append a value to the buffer.
 *
 * @param  {any}    item - Item to append.
 * @return {number}      - Returns the new size of the buffer.
 */
CircularBuffer.prototype.push = function(item) {
  if (this.size === this.capacity)
    throw new Error('mnemonist/circular-buffer: buffer capacity (' + this.capacity + ') exceeded!');

  var index = (this.start + this.size) % this.capacity;

  this.items[index] = item;

  return ++this.size;
};

/**
 * Method used to pop the buffer.
 *
 * @return {any} - Returns the popped item.
 */
CircularBuffer.prototype.pop = function() {
  if (this.size === 0)
    return;

  return this.items[--this.size];
};

/**
 * Method used to shift the buffer.
 *
 * @return {any} - Returns the shifted item.
 */
CircularBuffer.prototype.shift = function() {
  if (this.size === 0)
    return;

  var index = this.start;

  this.size--;
  this.start++;

  if (this.start === this.capacity)
    this.start = 0;

  return this.items[index];
};

/**
 * Method used to peek the first value of the buffer.
 *
 * @return {any}
 */
CircularBuffer.prototype.peekFirst = function() {
  if (this.size === 0)
    return;

  return this.items[this.start];
};

/**
 * Method used to peek the last value of the buffer.
 *
 * @return {any}
 */
CircularBuffer.prototype.peekLast = function() {
  if (this.size === 0)
    return;

  var index = this.start + this.size - 1;

  if (index > this.capacity)
    index -= this.capacity;

  return this.items[index];
};

/**
 * Method used to get the desired value of the buffer.
 *
 * @param  {number} index
 * @return {any}
 */
CircularBuffer.prototype.get = function(index) {
  if (this.size === 0)
    return;

  index = this.start + index;

  if (index > this.capacity)
    index -= this.capacity;

  return this.items[index];
};

/**
 * Method used to iterate over the buffer.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
CircularBuffer.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  var c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  while (j < l) {
    callback.call(scope, this.items[i], j, this);
    i++;
    j++;

    if (i === c)
      i = 0;
  }
};

/**
 * Method used to convert the buffer to a JavaScript array.
 *
 * @return {array}
 */
// TODO: optional array class as argument?
CircularBuffer.prototype.toArray = function() {
  var array = new this.ArrayClass(this.size),
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  while (j < l) {
    array[j] = this.items[i];
    i++;
    j++;

    if (i === c)
      i = 0;
  }

  return array;
};

/**
 * Method used to create an iterator over the buffer's values.
 *
 * @return {Iterator}
 */
CircularBuffer.prototype.values = function() {
  var items = this.items,
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  return new Iterator(function() {
    if (j >= l)
      return {
        done: true
      };

    var value = items[i];

    i++;
    j++;

    if (i === c)
      i = 0;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over the buffer's entries.
 *
 * @return {Iterator}
 */
CircularBuffer.prototype.entries = function() {
  var items = this.items,
      c = this.capacity,
      l = this.size,
      i = this.start,
      j = 0;

  return new Iterator(function() {
    if (j >= l)
      return {
        done: true
      };

    var value = items[i];

    i++;

    if (i === c)
      i = 0;

    return {
      value: [j++, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  CircularBuffer.prototype[Symbol.iterator] = CircularBuffer.prototype.values;


/**
 * Convenience known methods.
 */
CircularBuffer.prototype.inspect = function() {
  var array = this.toArray();

  array.type = this.ArrayClass.name;
  array.capacity = this.capacity;

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: CircularBuffer,
    enumerable: false
  });

  return array;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a circular buffer.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @param  {function} ArrayClass - Array class to use.
 * @param  {number}   capacity   - Desired capacity.
 * @return {FiniteStack}
 */
CircularBuffer.from = function(iterable, ArrayClass, capacity) {

  if (arguments.length < 3) {
    capacity = iterate.guessLength(iterable);

    if (typeof capacity !== 'number')
      throw new Error('mnemonist/circular-buffer.from: could not guess iterable length. Please provide desired capacity as last argument.');
  }

  var buffer = new CircularBuffer(ArrayClass, capacity);

  if (iterate.isArrayLike(iterable)) {
    var i, l;

    for (i = 0, l = iterable.length; i < l; i++)
      buffer.items[i] = iterable[i];

    buffer.size = l;

    return buffer;
  }

  iterate(iterable, function(value) {
    buffer.push(value);
  });

  return buffer;
};

/**
 * Exporting.
 */
module.exports = CircularBuffer;
