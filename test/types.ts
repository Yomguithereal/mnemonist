/**
 * Mnemonist Types Testing
 * ========================
 */
import {
  BiMap, InverseMap,
  BitSet,
  BitVector,
  BKTree,
  BloomFilter,
  CircularBuffer,
  DefaultMap,
  FibonacciHeap, MinFibonacciHeap, MaxFibonacciHeap,
  FixedReverseHeap,
  FixedStack,
  FuzzyMap,
  FuzzyMultiMap,
  HashedArrayTree,
  Heap, MaxHeap,
  InvertedIndex,
  LinkedList,
  LRUCache,
  LRUCacheWithDelete,
  LRUMap,
  LRUMapWithDelete,
  MultiSet,
  MultiMap,
  PassjoinIndex,
  Queue,
  set,
  SparseSet,
  Stack,
  StaticDisjointSet,
  StaticIntervalTree,
  SuffixArray, GeneralizedSuffixArray,
  SymSpell,
  Trie,
  TrieMap,
  Vector, Uint16Vector,
  VPTree
} from '../index';

/**
 * BiMap.
 */
let bimap = new BiMap<string, number>();
bimap.set('one', 1);
let inversemap: InverseMap<number, string> = bimap.inverse;

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
let bktree: BKTree<string> = BKTree.from(['one', 'two'], (a, b) => 4.0);
bktree.search(2, 'three');

/**
 * BloomFilter.
 */
let bloomfilter: BloomFilter = new BloomFilter(45);
bloomfilter.add('hello');

/**
 * CircularBuffer.
 */
let circularbuffer: CircularBuffer<string> = new CircularBuffer(Array, 4);
circularbuffer.push('test');

/**
 * DefaultMap.
 */
let defaultMap: DefaultMap<string, Array<number>> = new DefaultMap(() => []);
defaultMap.get('one').push(1);

/**
 * FibonacciHeap.
 */
let fibonacciHeap: FibonacciHeap<string> = new FibonacciHeap();
fibonacciHeap.push('hello');
fibonacciHeap.pop();

/**
 * FixedReverseHeap.
 */
let fixedReverseHeap: FixedReverseHeap<number> = new FixedReverseHeap(Uint16Array, 3);
fixedReverseHeap.push(34);

/**
 * FixedStack.
 */
let fixedStack: FixedStack<number> = new FixedStack(Uint8Array, 4);
fixedStack.push(4);
fixedStack.pop();

/**
 * FuzzyMap.
 */
let fuzzymap: FuzzyMap<{title: string}, number> = new FuzzyMap(o => o.title);
fuzzymap.set({title: 'Hello'}, 45);
let fuzzymapadd: FuzzyMap<number, {title: string; n: number}> = new FuzzyMap(o => o.n);
fuzzymapadd.add({title: 'Hello', n: 45});

/**
 * FuzzyMultiMap.
 */
let fuzzymultimap: FuzzyMultiMap<{title: string}, number> = new FuzzyMultiMap(o => o.title);
fuzzymultimap.set({title: 'Hello'}, 45);
let fuzzymultimapadd: FuzzyMultiMap<number, {title: string; n: number}> = new FuzzyMultiMap(o => o.n);
fuzzymultimapadd.add({title: 'Hello', n: 45});

/**
 * HashedArrayTree.
 */
let hashedArrayTree: HashedArrayTree<number> = new HashedArrayTree(Int8Array, 34);
hashedArrayTree.set(3, 4);

/**
 * Heap.
 */
let heap: Heap<string> = new Heap((a: string, b: string) => +a - +b);
heap.push('hello');
heap.pop();

let maxHeap: MaxHeap<number> = new Heap();
maxHeap.push(45);

/**
 * InvertedIndex.
 */
let invertedIndex: InvertedIndex<number> = new InvertedIndex(n => ['one', 'two']);
invertedIndex.add(45);

/**
 * LinkedList.
 */
let linkedlist: LinkedList<boolean> = new LinkedList();
linkedlist.push(true);
let linkedlistItem: boolean = linkedlist.shift();

/**
 * LRUCache.
 */
let lrucache: LRUCache<string, number> = new LRUCache(10);
lrucache.set('one', 34);
let lrucacheItem: number = lrucache.get('one');

/**
 * LRUCacheWithDelete
 */
let lrucwd: LRUCacheWithDelete<string, string> = new LRUCacheWithDelete(10);
lrucwd.set('one', 'uno');
let lrucwdItem: string = lrucwd.get('one');
lrucwdItem = lrucwd.remove('one');
let lrucwdDead: string | null = lrucwd.remove('one', null);
let lrucwdWasRemoved: boolean = lrucwd.delete('one');

/**
 * LRUMap.
 */
let lrumap: LRUMap<string, number> = new LRUMap(10);
lrumap.set('one', 34);
let lrumapItem: number = lrumap.get('one');

/**
 * LRUMapWithDelete
 */
let lrumwd: LRUMapWithDelete<string, string> = new LRUMapWithDelete(10);
lrumwd.set('one', 'uno');
let lrumwdItem: string = lrumwd.get('one');
lrumwdItem = lrumwd.remove('one');
let lrumwdDead: string | null = lrumwd.remove('one', null);
let lrumwdWasRemoved: boolean = lrumwd.delete('one');

/**
 * MultiSet.
 */
let multiset: MultiSet<number> = new MultiSet();
multiset.add(45);
multiset = MultiSet.from([1, 2, 3]);
multiset = MultiSet.from({'one': 1});

/**
 * MultiMap.
 */
let multimap: MultiMap<number, string, Set<string>> = new MultiMap(Set);
multimap.set(45, 'test');
multimap.get(45).has('test');
let stringMultimap: MultiMap<string, number> = MultiMap.from({one: 1});
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
const passjoinIndex: PassjoinIndex<string> = new PassjoinIndex((a: string, b: string) => 0, 1);

let passjoinResults: Set<string> = passjoinIndex.search('hello');

/**
 * Queue.
 */
let queue = new Queue<number>();

queue.enqueue(45);
let queueitem: number = queue.dequeue();

queue.enqueue(45);
queue.enqueue(34);

queue = Queue.from([1, 2, 3]);
queue = Queue.from({0: 1});

let queueIterator: Iterator<number> = queue.values();

/**
 * set.
 */
let setA = new Set([1, 2, 3]);
let setB = new Set([3, 4, 5]);
let unionOfSets = set.union(setA, setB);

/**
 * SparseSet.
 */
let sparseSet: SparseSet = new SparseSet(45);
sparseSet.add(3);

/**
 * Stack.
 */
let stack = new Stack<number>();

stack.push(45);
let stackitem: number = stack.pop();

stack.push(45);
stack.push(34);

stack = Stack.from([1, 2, 3]);
stack = Stack.from({0: 1});

let stackIterator: Iterator<number> = stack.values();

/**
 * StaticDisjointSet.
 */
let disjointSet: StaticDisjointSet = new StaticDisjointSet(45);
disjointSet.union(3, 5);

/**
 * StaticIntervalTree.
 */
type Interval = [number, number];
let intervalTree: StaticIntervalTree<Interval> = StaticIntervalTree.from([[0, 1] as Interval, [3, 4] as Interval]);

/**
 * SuffixArray.
 */
let generalizedSuffixArray = new GeneralizedSuffixArray(['test', 'hello']);
let suffixArrayLCS: string = generalizedSuffixArray.longestCommonSubsequence() as string;

/**
 * SymSpell.
 */
let symspell = SymSpell.from(['one', 'two'], {verbosity: 2});
let symspellMatches: Array<any> = symspell.search('three');

/**
 * Trie.
 */
let trie = new Trie<string>();
trie.add('roman');

let trieMatches: Array<string> = trie.find('rom');

/**
 * TrieMap.
 */
let trieMap = new TrieMap<string, number>();
trieMap.set('roman', 45);

let trieMapMatches: Array<[string, number]> = trieMap.find('rom');

trieMap = TrieMap.from(new Map([['roman', 45]]));
trieMap = TrieMap.from({roman: 45});

let arrayTrieMap = new TrieMap<string[], number>(Array);
arrayTrieMap.set(['the', 'cat', 'eats', 'the', 'mouse'], 45);

/**
 * Vector.
 */
let vector = new Vector(Uint32Array, 10);
vector.set(45, 2);

let uint16vector = Uint16Vector.from([1, 2, 3]);
uint16vector.pop();

/**
 * VPTree.
 */
let vptree: VPTree<string> = VPTree.from(['hello'], (a: string, b: string) => 1);
