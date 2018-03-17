/**
 * Mnemonist BiMap Typings
 * ========================
 */
export class InverseMap<K, V> implements Iterable<[K, V]> {

  // Members
  size: number;
  inverse: BiMap<V, K>;

  // Methods
  clear(): void;
  set(key: K, value: V): this;
  delete(key: K): boolean;
  has(key: K): boolean;
  get(key: K): V;
  forEach(callback: (value: V, key: K, map: this) => void, scope?: any): void;
  keys(): Iterator<K>;
  values(): Iterator<V>;
  entries(): Iterator<[K, V]>;
  [Symbol.iterator](): Iterator<[K, V]>;
  inspect(): any;
}

export default class BiMap<K, V> implements Iterable<[K, V]> {

  // Members
  size: number;
  inverse: InverseMap<V, K>;

  // Methods
  clear(): void;
  set(key: K, value: V): this;
  delete(key: K): boolean;
  has(key: K): boolean;
  get(key: K): V;
  forEach(callback: (value: V, key: K, map: this) => void, scope?: any): void;
  keys(): Iterator<K>;
  values(): Iterator<V>;
  entries(): Iterator<[K, V]>;
  [Symbol.iterator](): Iterator<[K, V]>;
  inspect(): any;

  // Statics
  static from<I, J>(iterable: Iterable<[I, J]> | {[key: string]: J}): BiMap<I, J>;
}
