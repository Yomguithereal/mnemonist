var mt = require('microtime'),
    ShiftQueue = require('./shift.js'),
    LinkedListQueue = require('./linked-list.js'),
    ObjectQueue = require('./object.js'),
    Queue = require('./queue.js');

var shift = new ShiftQueue(),
    linked = new LinkedListQueue(),
    queue = new Queue(),
    object = new ObjectQueue(),
    time,
    i;

time = mt.now();
for (i = 0; i < 10000000; i++) {
  linked.enqueue(i);
}
console.log('Linked', mt.now() - time);

time = mt.now();
for (i = 0; i < 10000000; i++) {
  queue.enqueue(i);
}
console.log('Queue.js', mt.now() - time);

// time = mt.now();
// for (i = 0; i < 10000000; i++) {
//   shift.enqueue(i);
// }
// console.log('Unshift', mt.now() - time);

// time = mt.now();
// for (i = 0; i < 10000000; i++) {
//   object.enqueue(i);
// }
// console.log('Object', mt.now() - time);

time = mt.now();
for (i = 0; i < 10000000; i++) {
  linked.dequeue();
}
console.log('Linked', mt.now() - time);

time = mt.now();
for (i = 0; i < 10000000; i++) {
  queue.dequeue();
}
console.log('Queue.js', mt.now() - time);

// time = mt.now();
// for (i = 0; i < 10000000; i++) {
//   shift.dequeue();
// }
// console.log('Unshift', mt.now() - time);

// time = mt.now();
// for (i = 0; i < 10000000; i++) {
//   object.dequeue();
// }
// console.log('Object', mt.now() - time);
