/**
 * Mnemonist IncrementalMap Typings
 * =================================
 */
type IncrementalMapOptions = {
  step?: number;
  offset?: number;
};

export default class IncrementalMap<V> implements Iterable<[V, number]> {

  // Members
  size: number;
  step: number;

  // Constructor
  constructor(options?: IncrementalMapOptions);

  // Methods
  clear(): void;
  unsafeAdd(key: V): this;
  add(key: V): this;
  get(key: V): number;
  has(key: V): boolean;
  keys(): Iterator<V>;
  values(): Iterator<number>;
  entries(): Iterator<[V, number]>;
  [Symbol.iterator](): Iterator<[V, number]>;
  inspect(): any;

  // Statics
  static from<I>(
    iterable: Iterable<I> | {[key: string] : I},
    options?: IncrementalMapOptions
  ): IncrementalMap<I>;

  static fromDistinct<I>(
    iterable: Iterable<I> | {[key: string] : I},
    options?: IncrementalMapOptions
  ): IncrementalMap<I>;
}