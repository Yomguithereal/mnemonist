/**
 * Mnemonist Linked List
 * ======================
 *
 * Singly linked list implementation. Uses raw JavaScript objects as nodes
 * as benchmarks proved it was the fastest thing to do.
 */
var Iterator = require('obliterator/iterator'),
    forEach = require('obliterator/foreach');

/**
 * Linked List.
 *
 * @constructor
 */
function LinkedList() {
  this.clear();
}

/**
 * Method used to clear the list.
 *
 * @return {undefined}
 */
LinkedList.prototype.clear = function() {

  // Properties
  this.head = null;
  this.tail = null;
  this.size = 0;
};

/**
 * Method used to get the first item of the list.
 *
 * @return {any}
 */
LinkedList.prototype.first = function() {
  return this.head ? this.head.item : undefined;
};
LinkedList.prototype.peek = LinkedList.prototype.first;

/**
 * Method used to get the last item of the list.
 *
 * @return {any}
 */
LinkedList.prototype.last = function() {
  return this.tail ? this.tail.item : undefined;
};

/**
 * Method used to get the first node that contains the specified item
 *
 * @param  {any}            item - The item to locate.
 * @return {Node|undefined}
 */
LinkedList.prototype.find = function(item) {
  var n = this.head;

  while (n) {
    if (n.item === item) {
      break;
    }

    n = n.next;
  }

  return n || undefined;
};

/**
 * Method used to get the last node that contains the specified item
 *
 * @param  {any}            item - The item to locate.
 * @return {Node|undefined}
 */
LinkedList.prototype.findLast = function(item) {
  var n = this.head,
      last = null;

  while (n) {
    if (n.item === item) {
      last = n;
    }

    n = n.next;
  }

  return last || undefined;
};

/**
 * Method used to add an item at the end of the list.
 *
 * @param  {any}    item - The item to add.
 * @return {number}
 */
LinkedList.prototype.push = function(item) {
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
 * Method used to add an item at the beginning of the list.
 *
 * @param  {any}    item - The item to add.
 * @return {number}
 */
LinkedList.prototype.unshift = function(item) {
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
 * Method used to retrieve & remove the first item of the list.
 *
 * @return {any}
 */
LinkedList.prototype.shift = function() {
  if (!this.size)
    return undefined;

  var node = this.head;

  this.head = node.next;
  this.size--;

  return node.item;
};

/**
 * Method used to add the specified new item after the specified existing item
 *
 * @param  {any}    item    - The item after which to add `newItem`
 * @param  {any}    newItem - The item to be added after `item`
 * @return {number} The size of the list
 */
LinkedList.prototype.addAfter = function(item, newItem) {
  var node = this.find(item),
      newNode,
      tempNode;

  if (node === null) {
    return this.size;
  }

  newNode = {item: newItem, next: null};
  tempNode = node.next;
  node.next = newNode;
  newNode.next = tempNode;

  if (node === this.tail) {
    this.tail = newNode;
  }
  this.size++;

  return this.size;
};

/**
 * Method used to add the specified new item before the specified existing item
 *
 * @param  {any}    item    - The item before which to add `newItem`
 * @param  {any}    newItem - The item to be added before `item`
 * @return {number} The size of the list
 */
LinkedList.prototype.addBefore = function(item, newItem) {
  var parent = this.head,
      newNode = {item: newItem, next: null};

  if (parent.item === item) {
    return this.unshift(newItem);
  }

  while (parent.next) {
    if (parent.next.item === item) {
      newNode.next = parent.next;
      parent.next = newNode;
      this.size++;
      break;
    }

    parent = parent.next;
  }

  return this.size;
};

/**
 * Method used to iterate over the list.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
LinkedList.prototype.forEach = function(callback, scope) {
  if (!this.size)
    return;

  scope = arguments.length > 1 ? scope : this;

  var n = this.head,
      i = 0;

  while (n) {
    callback.call(scope, n.item, i, this);
    n = n.next;
    i++;
  }
};

/**
 * Method used to convert the list into an array.
 *
 * @return {array}
 */
LinkedList.prototype.toArray = function() {
  if (!this.size)
    return [];

  var array = new Array(this.size);

  for (var i = 0, l = this.size, n = this.head; i < l; i++) {
    array[i] = n.item;
    n = n.next;
  }

  return array;
};

/**
 * Method used to create an iterator over a list's values.
 *
 * @return {Iterator}
 */
LinkedList.prototype.values = function() {
  var n = this.head;

  return new Iterator(function() {
    if (!n)
      return {
        done: true
      };

    var value = n.item;
    n = n.next;

    return {
      value: value,
      done: false
    };
  });
};

/**
 * Method used to create an iterator over a list's entries.
 *
 * @return {Iterator}
 */
LinkedList.prototype.entries = function() {
  var n = this.head,
      i = 0;

  return new Iterator(function() {
    if (!n)
      return {
        done: true
      };

    var value = n.item;
    n = n.next;
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
  LinkedList.prototype[Symbol.iterator] = LinkedList.prototype.values;

/**
 * Convenience known methods.
 */
LinkedList.prototype.toString = function() {
  return this.toArray().join(',');
};

LinkedList.prototype.toJSON = function() {
  return this.toArray();
};

LinkedList.prototype.inspect = function() {
  var array = this.toArray();

  // Trick so that node displays the name of the constructor
  Object.defineProperty(array, 'constructor', {
    value: LinkedList,
    enumerable: false
  });

  return array;
};

if (typeof Symbol !== 'undefined')
  LinkedList.prototype[Symbol.for('nodejs.util.inspect.custom')] = LinkedList.prototype.inspect;

/**
 * Static @.from function taking an arbitrary iterable & converting it into
 * a list.
 *
 * @param  {Iterable} iterable   - Target iterable.
 * @return {LinkedList}
 */
LinkedList.from = function(iterable) {
  var list = new LinkedList();

  forEach(iterable, function(value) {
    list.push(value);
  });

  return list;
};

/**
 * Exporting.
 */
module.exports = LinkedList;
