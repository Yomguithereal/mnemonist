/**
 * Mnemonist Types Testing
 * ========================
 */
import {
  Stack,
  TrieMap
} from '../index';

// Stack
let stack = new Stack<number>();

stack.push(45);
let item: number = stack.pop();

stack.push(45);
stack.push(34);

stack = Stack.from([1, 2, 3]);
stack = Stack.from({0: 1});

let iterator: Iterator<number> = stack.values();

// TrieMap
let trieMap = new TrieMap<string, number>();
trieMap.set('roman', 45);

let matches: Array<[string, number]> = trieMap.find('rom');

trieMap = TrieMap.from(new Map([['roman', 45]]));
trieMap = TrieMap.from({roman: 45});

let arrayTrieMap = new TrieMap<Array<string>, number>(Array);
arrayTrieMap.set(['the', 'cat', 'eats', 'the', 'mouse'], 45);