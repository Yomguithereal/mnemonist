function ObjectNullLinkedList() {
  this.head = null;
  this.tail = null;
  this.size = 0;
}

ObjectNullLinkedList.prototype.clear = function() {
  this.head = null;
  this.tail = null;
  this.size = 0;
};

ObjectNullLinkedList.prototype.push = function(item) {
  var node = Object.create(null);
  node.item = item;
  node.next = null;

  if (!this.head) {
    this.head = node;
  }
  if (!this.tail) {
    this.tail = node;
  }
  else {
    this.tail.next = node;
    this.tail = node;
  }

  this.size++;

  return node;
};

ObjectNullLinkedList.prototype.unshift = function(item) {
  var node = Object.create(null);
  node.item = item;
  node.next = null;

  if (!this.head) {
    this.head = node;
  }
  if (!this.tail) {
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

ObjectNullLinkedList.prototype.toArray = function() {
  if (!this.size)
    return [];

  var array = new Array(this.size);

  for (var i = 0, l = this.size, n = this.head; i < l; i++) {
    array[i] = n.item;
    n = n.next;
  }

  return array;
};

module.exports = ObjectNullLinkedList;
