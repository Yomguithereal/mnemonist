var mt = require('microtime'),
    PopStack = require('./pop.js'),
    LinkedListStack = require('./linked-list.js');

var pop = new PopStack(),
    linked = new LinkedListStack(),
    time,
    i;

time = mt.now();
for (i = 0; i < 20000000; i++) {
  linked.push(i);
}
console.log('Linked', mt.now() - time);

time = mt.now();
for (i = 0; i < 20000000; i++) {
  pop.push(i);
}
console.log('Pop', mt.now() - time);

time = mt.now();
for (i = 0; i < 20000000; i++) {
  linked.pop();
}
console.log('Linked', mt.now() - time);

time = mt.now();
for (i = 0; i < 20000000; i++) {
  pop.pop(i);
}
console.log('Pop', mt.now() - time);
