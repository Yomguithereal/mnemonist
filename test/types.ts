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
  MultiSet,
  Stack,
  Trie,
  TrieMap
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
 * MultiSet.
 */
let multiset: MultiSet<number> = new MultiSet();
multiset.add(45);
multiset = MultiSet.from([1, 2, 3]);
multiset = MultiSet.from({'one': 1});

/**
 * Stack.
 */
let stack = new Stack<number>();

stack.push(45);
let item: number = stack.pop();

stack.push(45);
stack.push(34);

stack = Stack.from([1, 2, 3]);
stack = Stack.from({0: 1});

let iterator: Iterator<number> = stack.values();

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
