/**
 * Mnemonist SparseSet Typings
 * ============================
 */
export default class SparseSet implements Iterable<number> {

  // Members
  size: number;

  // Constructor
  constructor(length: number);

  // Methods
  clear(): void;
  has(value: number): boolean;
  add(value: number): this;
  delete(value: number): boolean;
  forEach(callback: (value: number, key: number, set: this) => void, scope?: any): void;
  values(): Iterator<number>;
  [Symbol.iterator](): Iterator<number>;
  inspect(): any;
}
