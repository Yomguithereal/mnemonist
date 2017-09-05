var fs = require('fs');
var SemiDynamicTrie = require('../../semi-dynamic-trie');
var randomString = require('pandemonium/random-string');

var words = fs.readFileSync('/usr/share/dict/words', 'utf-8').split('\n');
words.length--;

// const trie = new SemiDynamicTrie();

// words.forEach(word => trie.add(word));

// console.log(trie.has('elephant'), trie.has('efliehoefhehueohfoehfeouh'), trie.has('zxzzyzzzzzzzz'));

// throw new Error('stop');

function HashMap(size) {
  this.items = new Uint8Array(size);
  this.size = size;
}

function hash(str) {
  'use asm';

  var h = 5381,
      i    = str.length;

  while(i) {
    h *= 33;
    h ^= str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return h >>> 0;
}

function altHash(str) {
  var h = 0,
      i = str.length;

  while (i)
    h = str.charCodeAt(--i) + (h << 6) + (h << 16) - h;

  return h;
}

function fnv32a( str )
{
  var hval = 0x811c9dc5;
  for ( var i = 0; i < str.length; ++i )
  {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return hval >>> 0;
}

HashMap.prototype.set = function(key, value) {
  this.items[fnv32a(key) % this.size] = value;
};

HashMap.prototype.get = function(key) {
  return this.items[fnv32a(key) % this.size];
};

console.time('Insert');
var map = new HashMap(words.length);
for (var w = 0, y = words.length; w < y; w++)
  map.set(words[w], w % 255);
console.timeEnd('Insert');

console.time('InsertObject');
var ob = {};
for (var w = 0, y = words.length; w < y; w++)
  ob[words[w]] = w % 255;
console.timeEnd('InsertObject');

console.time('InsertMap');
var m = new Map();
for (var w = 0, y = words.length; w < y; w++)
  m.set(words[w], w % 255);
console.timeEnd('InsertMap');

console.time('InsertTrie');
var t = new SemiDynamicTrie();
for (var w = 0, y = words.length; w < y; w++)
  t.add(words[w]);
console.timeEnd('InsertTrie');

var v;

console.time('Get');
for (var w = 0, y = words.length; w < y; w++)
  v = map.get(words[w]);
console.timeEnd('Get');

console.time('GetObject');
for (var w = 0, y = words.length; w < y; w++)
  v = ob[words[w]]
console.timeEnd('GetObject');

console.time('GetMap');
for (var w = 0, y = words.length; w < y; w++)
  v = m.get(words[w]);
console.timeEnd('GetMap');

console.time('GetTrie');
for (var w = 0, y = words.length; w < y; w++)
  v = t.has(words[w]);
console.timeEnd('GetTrie');

console.time('MissesObject');
for (var w = 0, y = words.length; w < y; w++)
  v = ob[randomString(4, 10)]
console.timeEnd('MissesObject');

console.time('MissesMap');
for (var w = 0, y = words.length; w < y; w++)
  v = m.get(randomString(4, 10));
console.timeEnd('MissesMap');

console.time('MissesTrie');
for (var w = 0, y = words.length; w < y; w++)
  v = t.has(randomString(4, 10));
console.timeEnd('MissesTrie');
