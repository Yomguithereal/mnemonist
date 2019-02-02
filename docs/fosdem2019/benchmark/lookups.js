const SIZE = 100000;

var map = new Map();
var i;

for (i = 0; i < SIZE; i++)
  map.set('t' + i, i);

function getTwo(m, k) {
  if (!m.has(k))
    return;

  return m.get(k);
}

function getOne(m, k) {
  var d = m.get(k);

  if (typeof d === 'undefined')
    return;

  return d;
}

console.time('Two');
for (i = 0; i < SIZE; i++)
  getTwo(map, 't' + i);
console.timeEnd('Two');

console.time('One');
for (i = 0; i < SIZE; i++)
  getOne(map, 't' + i);
console.timeEnd('One');
