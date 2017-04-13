/**
 * Mnemonist Set
 * ==============
 *
 * Useful function related to sets such as union, intersection and so on...
 */

/**
 * Variadic function computing the intersection of multiple sets.
 *
 * @param  {...Set} sets - Sets to intersect.
 * @return {Set}         - The intesection.
 */
exports.intersection = function() {
  if (arguments.length < 2)
    throw new Error('mnemonist/Set.intersection: needs at least two arguments.');

  // First we need to find the smallest set
  var smallestSize = Infinity,
      smallestSet = null;

  var s, i, l = arguments.length;

  for (i = 0; i < l; i++) {
    s = arguments[i];

    if (s.size < smallestSize) {
      smallestSize = s.size;
      smallestSet = s;
    }
  }

  // Now we need to interset this set with the others
  var I = new Set();

  var iterator = smallestSet.values(),
      step,
      item,
      add,
      set;

  while ((step = iterator.next(), !step.done)) {
    item = step.value;
    add = true;

    for (i = 0; i < l; i++) {
      set = arguments[i];

      if (set === smallestSet)
        continue;

      if (!set.has(item)) {
        add = false;
        break;
      }
    }

    if (add)
      I.add(item);
  }

  return I;
};

/**
 * Variadic function computing the union of multiple sets.
 *
 * @param  {...Set} sets - Sets to unite.
 * @return {Set}         - The union.
 */
exports.union = function() {
  if (arguments.length < 2)
    throw new Error('mnemonist/Set.union: needs at least two arguments.');

  var U = new Set();

  var i, l = arguments.length;

  var iterator,
      step;

  for (i = 0; i < l; i++) {
    iterator = arguments[i].values();

    while ((step = iterator.next(), !step.done))
      U.add(step.value);
  }

  return U;
};

/**
 * Function computing the difference between two sets.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {Set}   - The difference.
 */
exports.difference = function(A, B) {
  var D = new Set();

  var iterator = A.values(),
      step;

  while ((step = iterator.next(), !step.done)) {
    if (!B.has(step.value))
      D.add(step.value);
  }

  return D;
};
