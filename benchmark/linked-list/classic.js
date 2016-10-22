function ClassicLinkedList() {
  this.head = null;
  this.tail = null;
  this.size = 0;
}

ClassicLinkedList.prototype.push = function(item) {
  var node = {item: item};

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

ClassicLinkedList.prototype.toArray = function() {
  if (!this.size)
    return [];

  var array = new Array(this.size);

  for (var i = 0, l = this.size, n = this.head; i < l; i++) {
    array[i] = n.item;
    n = n.next;
  }

  return array;
};

module.exports = ClassicLinkedList;
