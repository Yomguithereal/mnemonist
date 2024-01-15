/**
 * Mnemonist Deque
 * ================
 *
 * Implemented with a singly linked list using raw JavaScript objects as nodes
 * as benchmarks proved it was the fastest thing to do.
 */
var Iterator = require('obliterator/iterator'),
    forEach = require('obliterator/foreach');

/**
 * Deque.
 *
 * @constructor
 */
function Deque() {
  this.clear();
}

/**
 * Method used to clear the deque.
 *
 * @return {undefined}
 */
Deque.prototype.clear = function() {

  // Properties
  this.head = null;
  this.tail = null;
  this.size = 0;
};

/**
 * Method used to get the first item of the deque.
 *
 * @return {any}
 */
Deque.prototype.first = function() {
  return this.head ? this.head.item : undefined;
};
Deque.prototype.peek = Deque.prototype.first;
Deque.prototype.peekFirst = Deque.prototype.first;

/**
 * Method used to get the last item of the deque.
 *
 * @return {any}
 */
Deque.prototype.last = function() {
  return this.tail ? this.tail.item : undefined;
};
Deque.prototype.peekLast = Deque.prototype.last;

/**
 * Method used to add an item at the end of the deque.
 *
 * @param  {any}    item - The item to add.
 * @return {number}
 */
Deque.prototype.push = function(item) {
  var node = {item: item, next: null};

  if (!this.head) {
    this.head = node;
    this.tail = node;
  }
  else {
    this.tail.next = node;
    this.tail = node;
  }

  this.size++;

  return this.size;
};

/**
 * Method used to add an item at the beginning of the deque.
 *
 * @param  {any}    item - The item to add.
 * @return {number}
 */
Deque.prototype.unshift = function(item) {
  var node = {item: item, next: null};

  if (!this.head) {
    this.head = node;
    this.tail = node;
  }
  else {
    if (!this.head.next)
      this.tail = this.head;
    node.next = this.head;
    this.head = node;
  }

  this.size++;

  return this.size;
};

/**
 * Method used to retrieve & remove the first item of the deque.
 *
 * @return {any}
 */
Deque.prototype.shift = function() {
  if (!this.size)
    return undefined;

  var node = this.head;

  this.head = node.next;
  this.size--;

  return node.item;
};

/**
 * Method used to iterate over the deque.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
Deque.prototype.forEach = function(callback, scope) {
  if (!this.size)
    return;

  scope = arguments.length > 1 ? scope : this;

  var node = this.head,
      i = 0;

  while (node) {
    callback.call(scope, node.item, i, this);
    node = node.next;
    i++;
  }
};

/**
 * Method used to convert the deque into an array.
 *
 * @return {array}
 */
Deque.prototype.toArray = function() {
  if (!this.size)
    return [];

  var array = new Array(this.size);

  for (var i = 0, l = this.size, node = this.head; i < l; i++) {
    array[i] = node.item;
    node = node.next;
  }

  return array;
};

/**
 * Method used to create an iterator over a deque's values.
 *
 * @return {Iterator}
 */
Deque.prototype.values = function() {
  var node = this.head;

  return new Iterator(function() {
    if (!node)
      return {
        done: true
      };

    var value = node.item;
    node = node.next;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a deque's entries.
 *
 * @return {Iterator}
 */
Deque.prototype.entries = function() {
  var node = this.head,
      i = 0;

  return new Iterator(function() {
    if (!node)
      return {
        done: true
      };

    var value = node.item;
    node = node.next;
    i++;

    return {
      value: [i - 1, value],
      done: false
    };
  });
};

/**
 * Attaching the #.values method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  Deque.prototype[Symbol.iterator] = Deque.prototype.values;

/**
 * Convenience known methods.
 */
Deque.prototype.toString = function() {
  return this.toArray().join(',');
};

Deque.prototype.toJSON = function() {
  return this.toArray();
};

Deque.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: Deque,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  Deque.prototype[Symbol.for('nodejs.util.inspect.custom')] = Deque.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a deque.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {Deque}
 */
Deque.from = function(iterable) {
  var list = new Deque();

  forEach(iterable, function(value) {
    list.push(value);
  });

  return list;
};

/**
 * Exporting.
 */
module.exports = Deque;
