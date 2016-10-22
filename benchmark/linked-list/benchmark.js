var Suite = new require('benchmark').Suite,
    ClassicLinkedList = require('./classic.js'),
    ArrayNodeLinkedList = require('./array-node.js'),
    ClassNodeLinkedList = require('./class-node.js'),
    ObjectNullLinkedList = require('./object-null.js');

// TODO: abstract the scheme to just pass the implementations & functions to run

var classic,
    arrayNode,
    classNode,
    objectNull;

var s1 = new Suite()
  .on('start', function() {
    classic = new ClassicLinkedList();
    arrayNode = new ArrayNodeLinkedList();
    classNode = new ClassNodeLinkedList();
    objectNull = new ObjectNullLinkedList();
  })
  .add('Classic#push', function() {
    classic.push(Math.random());

    if (classic.size === 1000000)
      classic = new ClassicLinkedList();
  })
  .add('ArrayNode#push', function() {
    arrayNode.push(Math.random());

    if (arrayNode.size === 1000000)
      arrayNode = new ArrayNodeLinkedList();
  })
  .add('ClassNode#push', function() {
    classNode.push(Math.random());

    if (classNode.size === 1000000)
      classNode = new ClassNodeLinkedList();
  })
  .add('ObjectNull#push', function() {
    objectNull.push(Math.random());

    if (objectNull.size === 1000000)
      objectNull = new ClassNodeLinkedList();
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();

console.log();

var s2 = new Suite()
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
