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
  FibonacciHeap, MinFibonacciHeap, MaxFibonacciHeap,
  FiniteStack,
  FuzzyMap,
  FuzzyMultiMap,
  MultiSet,
  MultiMap,
  Queue,
  set,
  Stack,
  Trie,
  TrieMap,
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
 * FibonacciHeap.
 */
let fibonacciHeap: FibonacciHeap<string> = new FibonacciHeap();
fibonacciHeap.push('hello');
fibonacciHeap.pop();

/**
 * FiniteStack.
 */
let finiteStack: FiniteStack<number> = new FiniteStack(Uint8Array, 4);
finiteStack.push(4);
finiteStack.pop();

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
 * MultiSet.
 */
let multiset: MultiSet<number> = new MultiSet();
multiset.add(45);
multiset = MultiSet.from([1, 2, 3]);
multiset = MultiSet.from({'one': 1});

/**
 * MultiMap.
 */
let multimap: MultiMap<number, string> = new MultiMap(Set);
multimap.set(45, 'test');
let stringMultimap: MultiMap<string, number> = MultiMap.from({one: 1});

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
 * VPTree.
 */
let vptree: VPTree<string> = VPTree.from(['hello'], (a: string, b: string) => 1);
