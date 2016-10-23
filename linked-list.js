/**
 * Mnemonist Linked List
 * ======================
 *
 * Singly linked list implementation. Uses raw JavaScript objects as nodes
 * as benchmarks proved it was the fastest thing to do.
 */

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
 * Method used to add an item at the end of the list.
 *
 * @param  {any}  item - The item to add.
 * @return {Node}
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

  return node;
};

/**
 * Method used to add an item at the beginning of the list.
 *
 * @param  {any}  item - The item to add.
 * @return {Node}
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

  return node;
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
 * Exporting.
 */
module.exports = LinkedList;
