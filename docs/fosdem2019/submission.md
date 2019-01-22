# FOSDEM 2019 Submission

## Developing data structures for JavaScript

*Why and how to implement efficient data structures to use with node.js or in the browser*

20 min + questions

### Abstract

There is a tenacious misconception nowadays that people working with JavaScript do not need to know much about data structures because developing for the web is still often deemed to be, and this cannot be more false, an easier task than "real" programming. Web applications have become complex beasts and node.js allows to build programs that used to be other backend languages' turf. JavaScript developers now need to develop, as with any other programming language, custom data structures to solve particular problems when arrays and objects are simply not enough. The intention of this presentation is therefore to compile series of tips, tricks and use cases regarding the implementation of data structures in JavaScript and the challenges it poses. It is indeed tricky to ensure consistent performance in a high-level language with JIT and where engines like v8 apply a lot of optimization magic. One has to be able to evolve around those constraints. Examples will be taken from libraries such as [graphology](https://github.com/graphology/graphology), [sigma.js](https://github.com/jacomyal/sigma.js)' newest version and finally [mnemonist](https://yomguithereal.github.io/mnemonist/) to demonstrate that 1. performant data structures can be designed for JavaScript using the language's capabilities and that 2. everyone can use them to solve problems more efficiently.
