/**
 * Mnemonist LRUCache Typings
 * ===========================
 */
import {IArrayLikeConstructor} from './utils/types';

export default class LRUCache<K, V> implements Iterable<[K, V]> {

  // Members
  capacity: number;
  size: number;

  // Constructor
  constructor(capacity: number);
  constructor(KeyArrayClass: IArrayLikeConstructor, ValueArrayClass: IArrayLikeConstructor, capacity: number);

  // Methods
  clear(): void;
  set(key: K, value: V): this;
  setWithCallback(key: K, value: V, callback: (oldValue: V, oldKey: K, overwriting: boolean) => void): this;
  get(key: K): V | undefined;
  peek(key: K): V | undefined;
  has(key: K): boolean;
  forEach(callback: (value: V, key: K, cache: this) => void, scope?: any): void;
  keys(): Iterator<K>;
  values(): Iterator<V>;
  entries(): Iterator<[K, V]>;
  [Symbol.iterator](): Iterator<[K, V]>;
  inspect(): any;

  // Statics
  static from<I, J>(
    iterable: Iterable<[I, J]> | {[key: string]: J},
    KeyArrayClass: IArrayLikeConstructor,
    ValueArrayClass: IArrayLikeConstructor,
    capacity?: number
  ): LRUCache<I, J>;

  static from<I, J>(
    iterable: Iterable<[I, J]> | {[key: string]: J},
    capacity?: number
  ): LRUCache<I, J>;
}
