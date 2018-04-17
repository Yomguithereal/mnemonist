var range = require('lodash/range');

function push(A, B) {
  A.push.apply(A, B);

  return A;
}

function loop(A, B) {
  for (var i = 0, l = B.length; i < l; i++) {
    A.push(B[i]);
  }

  return A;
}

function length(A, B) {
  var o = A.length;
  A.length += B.length;

  for (var i = 0, l = B.length; i < l; i++) {
    A[o + i] = B[i];
  }

  return A;
}

function concat(A, B) {
  return A.concat(B);
}

var S = 100;

function test(name, fn, a, b) {
  console.time(name);
  A = range(a);
  B = range(b);

  for (var i = 0; i < S; i++) {
    A = fn(A, B);
  }
  console.timeEnd(name);
}

test('push   - small', push, 10, 10);
test('loop   - small', loop, 10, 10);
test('length - small', length, 10, 10);
test('concat - small', concat, 10, 10);

console.log();

test('push   - medium', push, 1000, 1000);
test('loop   - medium', loop, 1000, 1000);
test('length - medium', length, 1000, 1000);
test('concat - medium', concat, 1000, 1000);

console.log();

test('push   - large', push, 100000, 100000);
test('loop   - large', loop, 100000, 100000);
test('length - large', length, 100000, 100000);
test('concat - large', concat, 100000, 100000);
