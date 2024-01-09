/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/**
 * Mnemonist CommonJS Default Require Testing
 * ===========================================
 */
const BiMap = require('mnemonist/bi-map');
const BitSet = require('mnemonist/bit-set');
const BitVector = require('mnemonist/bit-vector');
const BKTree = require('mnemonist/bk-tree');
const BloomFilter = require('mnemonist/bloom-filter');
const CircularBuffer = require('mnemonist/circular-buffer');
const DefaultMap = require('mnemonist/default-map');
const FibonacciHeap = require('mnemonist/fibonacci-heap');
const {MinFibonacciHeap} = require('mnemonist/fibonacci-heap');
const FixedReverseHeap = require('mnemonist/fixed-reverse-heap');
const FixedStack = require('mnemonist/fixed-stack');
const FuzzyMap = require('mnemonist/fuzzy-map');
const FuzzyMultiMap = require('mnemonist/fuzzy-multi-map');
const HashedArrayTree = require('mnemonist/hashed-array-tree');
const Heap = require('mnemonist/heap');
const {MaxHeap} = require('mnemonist/heap');
const InvertedIndex = require('mnemonist/inverted-index');
const LinkedList = require('mnemonist/linked-list');
const LRUCache = require('mnemonist/lru-cache');
const LRUCacheWithDelete = require('mnemonist/lru-cache-with-delete');
const LRUMap = require('mnemonist/lru-map');
const LRUMapWithDelete = require('mnemonist/lru-map-with-delete');
const MultiMap = require('mnemonist/multi-map');
const MultiSet = require('mnemonist/multi-set');
const PassjoinIndex = require('mnemonist/passjoin-index');
const Queue = require('mnemonist/queue');
const set = require('mnemonist/set');
const SparseSet = require('mnemonist/sparse-set');
const Stack = require('mnemonist/stack');
const StaticDisjointSet = require('mnemonist/static-disjoint-set');
const StaticIntervalTree = require('mnemonist/static-interval-tree');
const {GeneralizedSuffixArray} = require('mnemonist/suffix-array');
const SymSpell = require('mnemonist/symspell');
const Trie = require('mnemonist/trie');
const TrieMap = require('mnemonist/trie-map');
const Vector = require('mnemonist/vector');
const {Uint16Vector} = require('mnemonist/vector');
const VPTree = require('mnemonist/vp-tree');

/**
 * BiMap.
 */
let bimap = new BiMap();
bimap.set('one', 1);
let inversemap = bimap.inverse;
inversemap.get(1);

/**
 * BitSet.
 */
let bitset = new BitSet(4);
bitset.set(3);

/**
 * BitVector.
 */
let bitvector = new BitVector({initialCapacity: 34});
bitvector.set(3);

/**
 * BKTree.
 */
let bktree = BKTree.from(['one', 'two'], (a, b) => 4.0);
bktree.search(2, 'three');

/**
 * BloomFilter.
 */
let bloomfilter = new BloomFilter(45);
bloomfilter.add('hello');

/**
 * CircularBuffer.
 */
let circularbuffer = new CircularBuffer(Array, 4);
circularbuffer.push('test');

/**
 * DefaultMap.
 */
let defaultMap = new DefaultMap(() => []);
defaultMap.get('one').push(1);

/**
 * FibonacciHeap.
 */
let fibonacciHeap = new FibonacciHeap();
fibonacciHeap.push('hello');
fibonacciHeap.pop();
let minFibonacciHeap = new MinFibonacciHeap();
minFibonacciHeap.push('hello');
minFibonacciHeap.pop();

/**
 * FixedReverseHeap.
 */
let fixedReverseHeap = new FixedReverseHeap(Uint16Array, 3);
fixedReverseHeap.push(34);

/**
 * FixedStack.
 */
let fixedStack = new FixedStack(Uint8Array, 4);
fixedStack.push(4);
fixedStack.pop();

/**
 * FuzzyMap.
 */
let fuzzymap = new FuzzyMap(o => o.title);
fuzzymap.set({title: 'Hello'}, 45);
let fuzzymapadd = new FuzzyMap(o => o.n);
fuzzymapadd.add({title: 'Hello', n: 45});

/**
 * FuzzyMultiMap.
 */
let fuzzymultimap = new FuzzyMultiMap(o => o.title);
fuzzymultimap.set({title: 'Hello'}, 45);
let fuzzymultimapadd = new FuzzyMultiMap(o => o.n);
fuzzymultimapadd.add({title: 'Hello', n: 45});

/**
 * HashedArrayTree.
 */
let hashedArrayTree = new HashedArrayTree(Int8Array, 34);
hashedArrayTree.push(1);
hashedArrayTree.set(0, 4);

/**
 * Heap.
 */
let heap = new Heap((a, b) => +a - +b);
heap.push('hello');
heap.pop();

let maxHeap = new MaxHeap();
maxHeap.push(45);

/**
 * InvertedIndex.
 */
let invertedIndex = new InvertedIndex(n => ['one', 'two']);
invertedIndex.add(45);

/**
 * LinkedList.
 */
let linkedlist = new LinkedList();
linkedlist.push(true);
let linkedlistItem = linkedlist.shift();

/**
 * LRUCache.
 */
let lrucache = new LRUCache(10);
lrucache.set('one', 34);
let lrucacheItem = lrucache.get('one');

/**
 * LRUCacheWithDelete
 */
let lrucwd = new LRUCacheWithDelete(10);
lrucwd.set('one', 'uno');
let lrucwdItem = lrucwd.get('one');
lrucwdItem = lrucwd.remove('one');
let lrucwdDead = lrucwd.remove('one', null);
let lrucwdWasRemoved = lrucwd.delete('one');

/**
 * LRUMap.
 */
let lrumap = new LRUMap(10);
lrumap.set('one', 34);
let lrumapItem = lrumap.get('one');

/**
 * LRUMapWithDelete
 */
let lrumwd = new LRUMapWithDelete(10);
lrumwd.set('one', 'uno');
let lrumwdItem = lrumwd.get('one');
lrumwdItem = lrumwd.remove('one');
let lrumwdDead = lrumwd.remove('one', null);
let lrumwdWasRemoved = lrumwd.delete('one');

/**
 * MultiSet.
 */
let multiset = new MultiSet();
multiset.add(45);
multiset = MultiSet.from([1, 2, 3]);
multiset = MultiSet.from({one: 1});

/**
 * MultiMap.
 */
let multimap = new MultiMap(Set);
multimap.set(45, 'test');
multimap.get(45).has('test');
let stringMultimap = MultiMap.from({one: 1});
stringMultimap.get('one').indexOf(1);
for (const _ of multimap) { }
for (const _ of multimap.keys()) { }
for (const _ of multimap.values()) { }
for (const _ of multimap.entries()) { }
for (const _ of multimap.containers()) { }
for (const _ of multimap.associations()) { }

/**
 * PassjoinIndex.
 */
const passjoinIndex = new PassjoinIndex((a, b) => 0, 1);

let passjoinResults = passjoinIndex.search('hello');

/**
 * Queue.
 */
let queue = new Queue();

queue.enqueue(45);
let queueitem = queue.dequeue();

queue.enqueue(45);
queue.enqueue(34);

queue = Queue.from([1, 2, 3]);
queue = Queue.from({0: 1});

let queueIterator = queue.values();

/**
 * set.
 */
let setA = new Set([1, 2, 3]);
let setB = new Set([3, 4, 5]);
let unionOfSets = set.union(setA, setB);

/**
 * SparseSet.
 */
let sparseSet = new SparseSet(45);
sparseSet.add(3);

/**
 * Stack.
 */
let stack = new Stack();

stack.push(45);
let stackitem = stack.pop();

stack.push(45);
stack.push(34);

stack = Stack.from([1, 2, 3]);
stack = Stack.from({0: 1});

let stackIterator = stack.values();

/**
 * StaticDisjointSet.
 */
let disjointSet = new StaticDisjointSet(45);
disjointSet.union(3, 5);

/**
 * StaticIntervalTree.
 */
let intervalTree = StaticIntervalTree.from([[0, 1], [3, 4]]);

/**
 * SuffixArray.
 */
let generalizedSuffixArray = new GeneralizedSuffixArray(['test', 'hello']);
let suffixArrayLCS = generalizedSuffixArray.longestCommonSubsequence();

/**
 * SymSpell.
 */
let symspell = SymSpell.from(['one', 'two'], {verbosity: 2});
let symspellMatches = symspell.search('three');

/**
 * Trie.
 */
let trie = new Trie();
trie.add('roman');

let trieMatches = trie.find('rom');

/**
 * TrieMap.
 */
let trieMap = new TrieMap();
trieMap.set('roman', 45);

let trieMapMatches = trieMap.find('rom');

trieMap = TrieMap.from(new Map([['roman', 45]]));
trieMap = TrieMap.from({roman: 45});

let arrayTrieMap = new TrieMap(Array);
arrayTrieMap.set(['the', 'cat', 'eats', 'the', 'mouse'], 45);

/**
 * Vector.
 */
let vector = new Vector(Uint32Array, 10);
vector.push(1);
vector.set(0, 2);

let uint16vector = Uint16Vector.from([1, 2, 3]);
uint16vector.pop();

/**
 * VPTree.
 */
let vptree = VPTree.from(['hello'], (a, b) => 1);
