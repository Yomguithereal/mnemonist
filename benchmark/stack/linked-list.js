var LinkedList = require('../../linked-list.js');

function LinkedListStack() {
  this.items = new LinkedList();
}

LinkedListStack.prototype.push = function(item) {
  this.items.unshift(item);
};

LinkedListStack.prototype.pop = function() {
  return this.items.shift();
};

module.exports = LinkedListStack;
