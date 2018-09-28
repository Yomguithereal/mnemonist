/**
 * Mnemonist MultiMap Typings
 * ===========================
 */
export default class MultiMap<K, V> implements Iterable<[K, V]> {

  // Members
  dimension: number;
  size: number;

  // Constructor
  constructor(Container?: ArrayConstructor | SetConstructor);

  // Methods
  clear(): void;
  set(key: K, value: V): this;
  delete(key: K): boolean;
  remove(key: K, value: V): boolean;
  has(key: K): boolean;
  get(key: K): Array<V> | Set<V> | undefined;
  multiplicity(key: K): number;
  forEach(callback: (value: V, key: K, map: this) => void, scope?: any): void;
  forEachAssociation(callback: (value: Array<V> | Set<V>, key: K, map: this) => void, scope?: any): void;
  keys(): Iterator<K>;
  values(): Iterator<V>;
  entries(): Iterator<[K, V]>;
  containers(): Iterator<Array<V> | Set<V>>;
  associations(): Iterator<[K, Array<V> | Set<V>]>;
  [Symbol.iterator](): Iterator<[K, V]>;
  inspect(): any;
  toJSON(): any;

  // Statics
  static from<I, J>(
    iterable: Iterable<[I, J]> | {[key: string]: J},
    Container?: ArrayConstructor | SetConstructor
  ): MultiMap<I, J>;
}
