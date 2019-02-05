var fs = require('fs');
var SemiDynamicTrie = require('../../semi-dynamic-trie');
var CritBit = require('../../experiments/critbit');
var randomString = require('pandemonium/random-string');
var binarySearch = require('../../utils/binary-search').search;
var murmur3 = require('../../utils/murmurhash3');

var words = fs.readFileSync('/usr/share/dict/words', 'utf-8').split('\n');
words.length--;

// const trie = new SemiDynamicTrie();

// words.forEach(word => trie.add(word));

// console.log(trie.has('elephant'), trie.has('efliehoefhehueohfoehfeouh'), trie.has('zxzzyzzzzzzzz'));

// throw new Error('stop');

function exponentialSearch(array, key) {
  var bound = 1,
      l = array.length;

  while (bound < l && array[bound] <= key)
    bound <<= 1;

  var mid = 0;

  if (bound < l) {
    lo = bound >> 1;
    hi = l;
  }
  else {
    lo = bound >> 1;
    hi = bound;
  }

  var current;

  while (lo <= hi) {
    mid = (lo + hi) >>> 1;

    current = array[mid];

    if (current > value) {
      hi = ~-mid;
    }
    else if (current < value) {
      lo = -~mid;
    }
    else {
      return mid;
    }
  }

  return -1;
}

function interpolationSearch(arrayToSearch, valueToSearch){
  var length = arrayToSearch.length;
  var low = 0;
  var high = length-1;
  var position = -1;
  var delta = -1;
  while(low <= high
        && valueToSearch >= arrayToSearch[low]
        && valueToSearch <= arrayToSearch[high]){
    delta = (valueToSearch-arrayToSearch[low])/(arrayToSearch[high]-arrayToSearch[low]);
    position = low + Math.floor((high-low)*delta);
    if (arrayToSearch[position] == valueToSearch){
      return position;
    }
    if (arrayToSearch[position] < valueToSearch){
      low = position + 1;
    } else {
      high = position - 1;
    }
  }

  return -1;
}

function optimized(array, value, lo, hi) {
  var mid = 0;

  lo = 0;
  hi = array.length - 1;

  var current;

  while (lo <= hi) {
    mid = (lo + hi) >>> 1;

    current = array[mid];

    if (current > value) {
      hi = ~-mid;
    }
    else if (current < value) {
      lo = -~mid;
    }
    else {
      return mid;
    }
  }

  return -1;
};

function better(array, key) {
  var mid = -1;
  var hi = array.length - 1;
  var lo = 0;

  var current;

  while (lo <= hi) {
    mid = lo + (Math.max(hi, mid) - lo) / 2;

    current = array[mid];

    if (key < current)
      hi = mid - 1;
    else if (key > current)
      lo = mid + 1;
    else
      return mid
  }

  return -1;
}

function PerfectMap(strings) {
  var hashes = new Uint32Array(strings.length);

  for (var i = 0, l = strings.length; i < l; i++) {
    hashes[i] = fnv32a(strings[i]);
  }

  hashes.sort();

  this.hashes = hashes;
  this.values = new Float64Array(strings.length);
}

PerfectMap.prototype.set = function(key, value) {
  var index = binarySearch(this.hashes, fnv32a(key));
  this.values[index] = value;
}

PerfectMap.prototype.get = function(key, value) {
  var index = binarySearch(this.hashes, fnv32a(key));
  return this.values[index];
};

var critbit = new CritBit();
var perfect = new PerfectMap(words);
var object = {};
var map = new Map();
var sorted = words.slice().sort();

perfect.set('hello', 36);
console.log(perfect.get('hello'))

console.time('Perfect set');
for (var i = 0; i < words.length; i++)
  perfect.set(words[i], Math.random());
console.timeEnd('Perfect set');

console.time('Object set');
for (var i = 0; i < words.length; i++)
  object[words[i]] = Math.random();
console.timeEnd('Object set');

console.time('Map set');
for (var i = 0; i < words.length; i++)
  map.set(words[i], Math.random());
console.timeEnd('Map set');

console.time('Critbit set');
for (var i = 0; i < words.length; i++)
  critbit.add(words[i]);
console.timeEnd('Critbit set');

console.time('Perfect get');
for (var i = 0; i < words.length; i++)
  perfect.get(words[i]);
console.timeEnd('Perfect get');

console.time('Object get');
for (var i = 0; i < words.length; i++)
  object[words[i]];
console.timeEnd('Object get');

console.time('Map get');
for (var i = 0; i < words.length; i++)
  map.get(words[i]);
console.timeEnd('Map get');

console.time('Critbit get');
for (var i = 0; i < words.length; i++)
  critbit.has(words[i]);
console.timeEnd('Critbit get');

console.time('Sorted get');
for (var i = 0; i < words.length; i++)
  binarySearch(sorted, words[i]);
console.timeEnd('Sorted get');

process.exit(0);

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

console.time('InsertPerfect');
var p = new PerfectMap();
for (var w = 0, y = words.length; w < y; w++)
  m.set(words[w], w % 255);
console.timeEnd('InsertPerfect');

// console.time('InsertTrie');
// var t = new SemiDynamicTrie();
// for (var w = 0, y = words.length; w < y; w++)
//   t.add(words[w]);
// console.timeEnd('InsertTrie');

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

// console.time('GetTrie');
// for (var w = 0, y = words.length; w < y; w++)
//   v = t.has(words[w]);
// console.timeEnd('GetTrie');

console.time('MissesObject');
for (var w = 0, y = words.length; w < y; w++)
  v = ob[randomString(4, 10)]
console.timeEnd('MissesObject');

console.time('MissesMap');
for (var w = 0, y = words.length; w < y; w++)
  v = m.get(randomString(4, 10));
console.timeEnd('MissesMap');

// console.time('MissesTrie');
// for (var w = 0, y = words.length; w < y; w++)
//   v = t.has(randomString(4, 10));
// console.timeEnd('MissesTrie');
