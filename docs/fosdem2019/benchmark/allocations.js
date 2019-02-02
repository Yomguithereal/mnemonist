const SIZE = 1000000;

function testNaive(number) {

  const fn = (number % 2 === 0) ?
    ({number: x}) => /4/.test('t' + x) :
    ({number: x}) => /5/.test('t' + x);

  return fn({number: number});
}

const REGEX4 = /4/;
const REGEX5 = /5/;
function testLessNaive(number) {
  if (number % 2 === 0)
    return REGEX4.test('t' + number);
  else
    return REGEX5.test('t' + number);
}

console.time('Naive');
for (i = 0; i < SIZE; i++)
  testNaive(i);
console.timeEnd('Naive');

console.time('Less Naive');
for (i = 0; i < SIZE; i++)
  testLessNaive(i);
console.timeEnd('Less Naive');
