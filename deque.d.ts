/**
 * Mnemonist Deque Typings
 * ========================
 */

export default class Deque<T> implements Iterable<T> {

  // Members
  size: number;

  // Constructor
  constructor();

  // Methods
  clear(): void;
  peekFirst(): T | undefined;
  /** @deprecated: use peekFirst() instead. */
  first(): T | undefined;
  peekLast(): T | undefined;
  /** @deprecated: use peekLast() instead. */
  peek(): T | undefined;
  /** @deprecated: use peekLast() instead. */
  last(): T | undefined;
  push(value: T): number;
  unshift(value: T): number;
  pop(): T | undefined;
  shift(): T | undefined;
  forEach(callback: (value: T, index: number, list: this) => void, scope?: any): void;
  toArray(): Array<T>;
  values(): IterableIterator<T>;
  entries(): IterableIterator<[number, T]>;
  [Symbol.iterator](): IterableIterator<T>;
  toString(): string;
  toJSON(): Array<T>;
  inspect(): any;

  // Statics
  static from<I>(iterable: Iterable<I> | {[key: string]: I}): Deque<I>;
}
