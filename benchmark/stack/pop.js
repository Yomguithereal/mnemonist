function PopStack() {
  this.items = [];
}

PopStack.prototype.push = function(item) {
  this.items.push(item);
};

PopStack.prototype.pop = function() {
  return this.items.pop();
};

module.exports = PopStack;
