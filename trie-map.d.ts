/**
 * Mnemonist TrieMap Typings
 * ==========================
 */
export default class TrieMap<K, V> implements Iterable<[K, V]> {

  // Members
  size: number;

  // Constructor
  constructor(Token?: new () => K);

  // Methods
  clear(): void;
  set(prefix: K, value: V): this;
  get(prefix: K): V;
  delete(prefix: K): boolean;
  has(prefix: K): boolean;
  find(prefix: K): Array<[K, V]>;
  values(): Iterator<V>;
  prefixes(): Iterator<K>;
  keys(): Iterator<K>;
  entries(): Iterator<[K, V]>;
  [Symbol.iterator](): Iterator<[K, V]>;
  inspect(): any;

  // Statics
  static from<I, J>(iterable: Iterable<[I, J]> | {[key: string]: J}): TrieMap<I, J>;
}
