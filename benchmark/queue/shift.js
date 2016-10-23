function ShiftQueue() {
  this.items = [];
}

ShiftQueue.prototype.enqueue = function(item) {
  this.items.push(item);
};

ShiftQueue.prototype.dequeue = function() {
  return this.items.shift();
};

module.exports = ShiftQueue;
