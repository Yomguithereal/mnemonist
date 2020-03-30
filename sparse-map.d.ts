/**
 * Mnemonist SparseMap Typings
 * ============================
 */
export default class SparseMap<V> implements Iterable<[number, V]> {

  // Members
  length: number;
  size: number;

  // Constructor
  constructor(length: number);

  // Methods
  clear(): void;
  has(key: number): boolean;
  get(key: number): V | undefined;
  set(key: number, value: V): this;
  delete(key: number): boolean;
  forEach(callback: (value: V, key: number, set: this) => void, scope?: any): void;
  keys(): Iterator<number>;
  values(): Iterator<V>;
  entries(): Iterator<[number, V]>;
  [Symbol.iterator](): Iterator<[number, V]>;
  inspect(): any;
}
