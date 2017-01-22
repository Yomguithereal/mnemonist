/**
 * Mnemonist MultiMap
 * ===================
 *
 * Implementation of a MultiMap with custom container.
 */
var iterateOver = require('./utils/iterate.js');

/**
 * MultiMap.
 *
 * @constructor
 */
function MultiMap(Container) {

  this.Container = Container || Array;
  this.items = new Map();
  this.clear();

  Object.defineProperty(this.items, 'constructor', {
    value: MultiMap,
    enumerable: false
  });
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
MultiMap.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.dimension = 0;
  this.items.clear();
};

/**
 * Method used to set a value.
 *
 * @param  {any}      key   - Key.
 * @param  {any}      value - Value to add.
 * @return {MultiMap}
 */
MultiMap.prototype.set = function(key, value) {
  var container = this.items.get(key),
      sizeIncrease = 0;

  if (!container) {
    this.dimension++;
    container = new this.Container();
    this.items.set(key, container);
  }

  if (this.Container === Set) {
    sizeIncrease = +!container.has(value);
    container.add(value);
  }
  else {
    sizeIncrease = 1;
    container.push(value);
  }

  this.size += sizeIncrease;

  return this;
};

/**
 * Method used to delete the given key.
 *
 * @param  {any}     key - Key to delete.
 * @return {boolean}
 */
MultiMap.prototype.delete = function(key) {
  var container = this.items.get(key);

  if (container) {
    this.size -= (this.Container === Set ? container.size : container.length);
    this.dimension--;
  }

  this.items.delete(key);

  return !!container;
};

/**
 * Method used to return whether the given keys exists in the map.
 *
 * @param  {any}     key - Key to check.
 * @return {boolean}
 */
MultiMap.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to return the container stored at the given key or `undefined`.
 *
 * @param  {any}     key - Key to get.
 * @return {boolean}
 */
MultiMap.prototype.get = function(key) {
  return this.items.get(key);
};

/**
 * Method used to iterate over each of the key/value pairs.
 *
 * @param  {function}  callback - Function to call for each item.
 * @param  {object}    scope    - Optional scope.
 * @return {undefined}
 */
MultiMap.prototype.forEach = function(callback, scope) {
  scope = arguments.length > 1 ? scope : this;

  this.items.forEach(function(container, key) {
    container.forEach(function(value) {
      callback.call(scope, value, key);
    });
  });
};

/**
 * MultiMap Iterator class.
 */
function MultiMapIterator(next) {
  this.next = next;
}

/**
 * Method returning an iterator over the map's keys.
 *
 * @return {MultiMapIterator}
 */
MultiMap.prototype.keys = function() {
  var iterator = this.items.keys();

  Object.defineProperty(iterator, 'constructor', {
    value: MultiMapIterator,
    enumerable: false
  });

  return iterator;
};

/**
 * Method returning an iterator over the map's keys.
 *
 * @return {MultiMapIterator}
 */
MultiMap.prototype.values = function() {
  var iterator = this.items.values(),
      inContainer = false,
      countainer,
      step,
      i,
      l;

  if (this.Container === Set)
    return new MultiMapIterator(function next() {
      if (!inContainer) {
        step = iterator.next();

        if (step.done)
          return {done: true};

        inContainer = true;
        countainer = step.value.values();
      }

      step = countainer.next();

      if (step.done) {
        inContainer = false;
        return next();
      }

      return {
        done: false,
        value: step.value
      };
    });

  return new MultiMapIterator(function next() {
    if (!inContainer) {
      step = iterator.next();

      if (step.done)
        return {done: true};

      inContainer = true;
      countainer = step.value;
      i = 0;
      l = countainer.length;
    }

    if (i >= l) {
      inContainer = false;
      return next();
    }

    return {
      done: false,
      value: countainer[i++]
    };
  });
};

/**
 * Method returning an iterator over the map's entries.
 *
 * @return {MultiMapIterator}
 */
MultiMap.prototype.entries = function() {
  var iterator = this.items.entries(),
      inContainer = false,
      countainer,
      step,
      key,
      i,
      l;

  if (this.Container === Set)
    return new MultiMapIterator(function next() {
      if (!inContainer) {
        step = iterator.next();

        if (step.done)
          return {done: true};

        inContainer = true;
        key = step.value[0];
        countainer = step.value[1].values();
      }

      step = countainer.next();

      if (step.done) {
        inContainer = false;
        return next();
      }

      return {
        done: false,
        value: [key, step.value]
      };
    });

  return new MultiMapIterator(function next() {
    if (!inContainer) {
      step = iterator.next();

      if (step.done)
        return {done: true};

      inContainer = true;
      key = step.value[0];
      countainer = step.value[1];
      i = 0;
      l = countainer.length;
    }

    if (i >= l) {
      inContainer = false;
      return next();
    }

    return {
      done: false,
      value: [key, countainer[i++]]
    };
  });
};

/**
 * Method returning an iterator over the map's containers.
 *
 * @return {MultiMapIterator}
 */
MultiMap.prototype.containers = function() {
  var iterator = this.items.values();

  Object.defineProperty(iterator, 'constructor', {
    value: MultiMapIterator,
    enumerable: false
  });

  return iterator;
};

/**
 * Method returning an iterator over the map's associations.
 *
 * @return {MultiMapIterator}
 */
MultiMap.prototype.associations = function() {
  var iterator = this.items.entries();

  Object.defineProperty(iterator, 'constructor', {
    value: MultiMapIterator,
    enumerable: false
  });

  return iterator;
};

/**
 * Attaching the #.entries method to Symbol.iterator if possible.
 */
if (typeof Symbol !== 'undefined')
  MultiMap.prototype[Symbol.iterator] = MultiMap.prototype.entries;

/**
 * Convenience known methods.
 */
MultiMap.prototype.inspect = function() {
  return this.items;
};
MultiMap.prototype.toJSON = function() {
  return this.items;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable  - Target iterable.
 * @param  {Class}    Container - Container.
 * @return {MultiMap}
 */
MultiMap.from = function(iterable, Container) {
  var map = new MultiMap(Container);

  iterateOver(iterable, function(value, key) {
    map.set(key, value);
  });

  return map;
};

/**
 * Exporting.
 */
module.exports = MultiMap;
