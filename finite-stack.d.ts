/**
 * Mnemonist FiniteStack Typings
 * ==============================
 */
export default class FiniteStack<T> implements Iterable<T> {

  // Members
  capacity: number;
  size: number;

  // Constructor
  constructor(ArrayClass: any, capacity: number);

  // Methods
  clear(): void;
  push(item: T): number;
  pop(): T | undefined;
  peek(): T | undefined;
  forEach(callback: (item: T, index: number, stack: this) => void, scope?: any): void;
  toArray(): Iterable<T>;
  values(): Iterator<T>;
  entries(): Iterator<[number, T]>;
  [Symbol.iterator](): Iterator<T>;
  toString(): string;
  toJSON(): Iterable<T>;
  inspect(): any;

  // Statics
  static from<I>(
    iterable: Iterable<I> | {[key: string] : I},
    ArrayClass: any,
    capacity?: number
  ): FiniteStack<I>;
}