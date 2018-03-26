# Add Todo List

This is a basic Todo list of things when adding a new structure:

* [ ] Documentation
* [ ] Code the structure
* [ ] Add convenience methods (`#.inspect`, `#.toString`, `#.toJSON` etc.)
* [ ] Add proper iterators
* [ ] Add a static `#.from` function
* [ ] Add unit tests
* [ ] Add proper types
* [ ] Add the structure to the endpoint
* [ ] Add a changelog entry
* [ ] Add keywords

```js
/**
 * Mnemonist Structure
 * ====================
 *
 * Docs...
 */
var iterate = require('./utils/iterables.js').iterate;

/**
 * Structure.
 *
 * @constructor
 */
function Structure() {
  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
Structure.prototype.clear = function() {

  // Properties
};

/**
 * Convenience known methods.
 */
Structure.prototype.inspect = function() {
  return this;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {Structure}
 */
Structure.from = function(iterable) {

};

/**
 * Exporting.
 */
module.exports = Structure;
```
