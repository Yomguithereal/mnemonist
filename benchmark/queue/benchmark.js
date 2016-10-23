var mt = require('microtime'),
    ShiftQueue = require('./shift.js'),
    LinkedListQueue = require('./linked-list.js');

var shift = new ShiftQueue(),
    linked = new LinkedListQueue(),
    time,
    i;

time = mt.now();
for (i = 0; i < 10000000; i++) {
  linked.enqueue(i);
}
console.log('Linked', mt.now() - time);

time = mt.now();
for (i = 0; i < 10000000; i++) {
  shift.enqueue(i);
}
console.log('Unshift', mt.now() - time);

time = mt.now();
for (i = 0; i < 10000000; i++) {
  linked.dequeue();
}
console.log('Linked', mt.now() - time);

time = mt.now();
for (i = 0; i < 10000000; i++) {
  shift.dequeue(i);
}
console.log('Unshift', mt.now() - time);
