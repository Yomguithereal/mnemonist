function ArrayNodeLinkedList() {
  this.head = null;
  this.tail = null;
  this.size = 0;
}

ArrayNodeLinkedList.prototype.clear = function() {
  this.head = null;
  this.tail = null;
  this.size = 0;
};

ArrayNodeLinkedList.prototype.push = function(item) {
  var node = [item, null];

  if (!this.head) {
    this.head = node;
  }
  if (!this.tail) {
    this.tail = node;
  }
  else {
    this.tail[1] = node;
    this.tail = node;
  }

  this.size++;

  return node;
};

ArrayNodeLinkedList.prototype.unshift = function(item) {
  var node = [item, null];

  if (!this.head) {
    this.head = node;
  }
  if (!this.tail) {
    this.tail = node;
  }
  else {
    if (!this.head[1])
      this.tail = this.head;
    node[1] = this.head;
    this.head = node;
  }

  this.size++;

  return node;
};

ArrayNodeLinkedList.prototype.toArray = function() {
  if (!this.size)
    return [];

  var array = new Array(this.size);

  for (var i = 0, l = this.size, n = this.head; i < l; i++) {
    array[i] = n[0];
    n = n[1];
  }

  return array;
};

module.exports = ArrayNodeLinkedList;
