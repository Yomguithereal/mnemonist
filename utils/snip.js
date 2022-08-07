//
function snipToLast(iterator, proxy, {maxToDump = 20, size = Infinity, last = []}) {
  var step;

  var ii = 0;
  while ((step = iterator.next(), !step.done)) {
    if (ii >= maxToDump - 2) {
      if (ii >= size - 1) {
        proxy.set(step.value[0], step.value[1]);
      } else if (ii === size - 2) {
        proxy.set(step.value[0], step.value[1]);
        proxy.set(last[0], last[1]);
      } else {
        proxy.set('_...', size - ii - 1);
        proxy.set(last[0], last[1]);
      }
      break;
    }
    proxy.set(step.value[0], step.value[1]);
    ii += 1;
  }
  return proxy;
}

module.exports.snipToLast = snipToLast;
