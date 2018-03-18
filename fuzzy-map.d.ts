/**
 * Mnemonist FuzzyMap Typings
 * ==========================
 */
type HashFunction<K> = (key: K) => any;
type HashFunctionsTuple<K> = [HashFunction<K>, HashFunction<K>];

export default class FuzzyMap<K, V> implements Iterable<V> {

  // Members
  size: number;

  // Constructor
  constructor(hashFunction: HashFunction<K>);
  constructor(hashFunctionsTuple: HashFunctionsTuple<K>);

  // Methods
  clear(): void;
  add(key: K): this;
  set(key: K, value: V): this;
  get(key: K): V | undefined;
  has(key: K): boolean;
  forEach(callback: (value: V, key: V) => void, scope?: this): void;
  values(): Iterator<V>;
  [Symbol.iterator](): Iterator<V>;
  inspect(): any;

  // Statics
  static from<I, J>(
    iterable: Iterable<[I, J]> | {[key: string]: J},
    hashFunction: HashFunction<I> | HashFunctionsTuple<I>,
  ): FuzzyMap<I, J>;
}