var fs = require('fs');

var words = fs.readFileSync('/usr/share/dict/words', 'utf-8').split('\n');
words.length--;

var w, l = words.length;

var CritBitTreeMap = require('../../critbit-tree-map');

var critbit = new CritBitTreeMap();

console.time('Critbit Set');
for (w = 0; w < l; w++)
  critbit.set(words[w], w);
console.timeEnd('Critbit Set');

console.log(critbit.size, l);
