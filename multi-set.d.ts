/**
 * Mnemonist MultiSet Typings
 * ===========================
 */
export default class MultiSet<K> implements Iterable<K> {

  /**
   * Number of distinct items in the set.
   */
  dimension: number;
  /**
   * Total number of items in the set.
   */
  size: number;

  // Methods
  /**
   * Method used to clear the structure.
   *
   * @return {undefined}
   */
  clear(): void;
  /**
   * Adds the item to the set. Optionally, you can provide a number which is the number of times the same item is added.
   *
   * Adding an item 0 times is a no-op.
   *
   * Adding an item a negative number of times will remove items.
   *
   * @param {K} key item to add.
   * @param {number} count optional count.
   * @return {MultiSet}
   */
  add(key: K, count?: number): this;
  /**
   * Sets the multiplicity of an item in the set.
   *
   * Setting the multiplicity of an item to be 0 or a negative number will remove said item from the set.
   *
   * @param {K} key item to set
   * @param {number} count - desired multiplicity.
   * @return {MultiSet}
   */
  set(key: K, count: number): this;
  /**
   * Returns true when items are in the set.
   *
   * Equivalent to `set.count(item) > 0`.
   *
   * @param  {any} key  - Item to check.
   * @return {boolan}
   */
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
  keys(): IterableIterator<K>;
  values(): IterableIterator<K>;
  multiplicities(): IterableIterator<[K, number]>;
  [Symbol.iterator](): IterableIterator<K>;
  inspect(): any;
  toJSON(): any;

  // Statics
  static from<I>(iterable: Iterable<I> | {[key: string]: I}): MultiSet<I>;
  static isSubset<T>(a: MultiSet<T>, b: MultiSet<T>): boolean;
  static isSuperset<T>(a: MultiSet<T>, b: MultiSet<T>): boolean;
}
