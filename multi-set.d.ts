/**
 * Mnemonist MultiSet Typings
 * ===========================
 */
export default class MultiSet<K> implements Iterable<K> {

  // Members
  dimension: number;
  size: number;

  // Methods
  clear(): void;
  add(key: K, count?: number): this;
  set(key: K, count: number): this;
  has(key: K): boolean;
  delete(key: K): boolean;
  remove(key: K, count?: number): void;
  edit(a: K, b: K): this;
  multiplicity(key: K): number;
  count(key: K): number;
  get(key: K): number;
  frequency(key: K): number;
  top(n: number): Array<[K, number]>;
  forEach(callback: (value: K, key: K, set: this) => void, scope?: any): void;
  forEachMultiplicity(callback: (value: number, key: K, set: this) => void, scope?: any): void;
  keys(): Iterator<K>;
  values(): Iterator<number>;
  multiplicities(): Iterator<[K, number]>;
  [Symbol.iterator](): Iterator<K>;
  inspect(): any;
  toJSON(): any;

  // Statics
  static from<I>(iterable: Iterable<I> | {[key: string]: I}): MultiSet<I>;
  static isSubset<T>(a: MultiSet<T>, b: MultiSet<T>): boolean;
  static isSuperset<T>(a: MultiSet<T>, b: MultiSet<T>): boolean;
}
