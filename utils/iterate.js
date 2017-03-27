/**
 * Mnemonist Iterate Function
 * ===========================
 *
 * Harmonized iteration over mixed targets.
 */

/**
 * Function used to iterate in a similar way over JavaScript iterables,
 * plain objects & arrays.
 *
 * @param  {any}      target - Iteration target.
 * @param  {function} callback - Iteration callback.
 */
module.exports = function iterate(target, callback) {
  var iterator, k, i, l, s;

  // The target is an array
  if (Array.isArray(target)) {
    for (i = 0, l = target.length; i < l; i++)
      callback(target[i], i);
    return;
  }

  // The target has a #.forEach method
  if (typeof target.forEach === 'function') {
    target.forEach(callback);
    return;
  }

  // The target is an iterator
  if (typeof target.next === 'function') {
    iterator = target;
    i = 0;

    while ((s = iterator.next(), !s.done)) {
      callback(s.value, i);
      i++;
    }

    return;
  }

  // The target is iterable
  if (typeof Symbol !== 'undefined' && Symbol.iterator in target) {
    iterator = target[Symbol.iterator]();

    while ((s = iterator.next(), !s.done))
      callback(s[0], s[1]);

    return;
  }

  // The target is a plain object
  for (k in target) {
    if (target.hasOwnProperty(k)) {
      callback(target[k], k);
    }
  }

  return;
};
