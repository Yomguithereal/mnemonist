/**
 * Mnemonist DefaultMap Typings
 * =============================
 */
export default class DefaultMap<K, V> implements Iterable<[K, V]> {

  // Members
  size: number;

  // Constructor
  constructor(factory: (key?: K, index?: number) => V);

  // Methods
  clear(): void;
  set(key: K, value: V): this;
  delete(key: K): boolean;
  has(key: K): boolean;
  get(key: K): V | undefined;
  peek(key: K): V | undefined;
  forEach(callback: (value: V, key: K, map: this) => void, scope?: any): void;
  keys(): Iterator<K>;
  values(): Iterator<V>;
  entries(): Iterator<[K, V]>;
  [Symbol.iterator](): Iterator<[K, V]>;
  inspect(): any;

  // Statics
  static autoIncrement(): number;
}
