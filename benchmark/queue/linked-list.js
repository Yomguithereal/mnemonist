var LinkedList = require('../../linked-list.js');

function LinkedListQueue() {
  this.items = new LinkedList();
}

LinkedListQueue.prototype.enqueue = function(item) {
  this.items.push(item);
};

LinkedListQueue.prototype.dequeue = function() {
  return this.items.shift();
};

module.exports = LinkedListQueue;
