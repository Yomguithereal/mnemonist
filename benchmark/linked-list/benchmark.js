var Benchmark = new require('benchmark'),
    ClassicLinkedList = require('./classic.js'),
    ArrayNodeLinkedList = require('./array-node.js'),
    ClassNodeLinkedList = require('./class-node.js'),
    ObjectNullLinkedList = require('./object-null.js');

Benchmark.options.delay = 1;
Benchmark.options.initCount = 5;

var Suite = Benchmark.Suite;

var classic,
    arrayNode,
    classNode,
    objectNull;

function doTimes(Class, method) {
  var target = new Class();

  for (var i = 0; i < 10000; i++)
    target[method](Math.random());

  target.clear();
  target = null;
}

new Suite()
  .add('Dummy#push', function() {
    doTimes(ClassicLinkedList, 'push');
  })
  .add('ArrayNode#push', function() {
    doTimes(ArrayNodeLinkedList, 'push');
  })
  .add('Classic#push', function() {
    doTimes(ClassicLinkedList, 'push');
  })
  .add('ClassNode#push', function() {
    doTimes(ClassNodeLinkedList, 'push');
  })
  .add('ObjectNull#push', function() {
    doTimes(ObjectNullLinkedList, 'push');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();

console.log();

new Suite()
  .add('Dummy#unshift', function() {
    doTimes(ClassicLinkedList, 'unshift');
  })
  .add('ArrayNode#unshift', function() {
    doTimes(ArrayNodeLinkedList, 'unshift');
  })
  .add('Classic#unshift', function() {
    doTimes(ClassicLinkedList, 'unshift');
  })
  .add('ClassNode#unshift', function() {
    doTimes(ClassNodeLinkedList, 'unshift');
  })
  .add('ObjectNull#unshift', function() {
    doTimes(ObjectNullLinkedList, 'unshift');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();

console.log();

new Suite()
  .on('start', function() {
    classic = new ClassicLinkedList();
    arrayNode = new ArrayNodeLinkedList();
    classNode = new ClassNodeLinkedList();
    objectNull = new ObjectNullLinkedList();

    for (var i = 0; i < 1000000; i++) {
      classic.push(Math.random());
      arrayNode.push(Math.random());
      classNode.push(Math.random());
      objectNull.push(Math.random());
    }
  })
  .add('Dummy#toArray', function() {
    classic.toArray();
  })
  .add('Classic#toArray', function() {
    classic.toArray();
  })
  .add('ArrayNode#toArray', function() {
    arrayNode.toArray();
  })
  .add('ClassNode#toArray', function() {
    classNode.toArray();
  })
  .add('ObjectNull#toArray', function() {
    objectNull.toArray();
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('error', function(error) {
    console.error(error);
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
