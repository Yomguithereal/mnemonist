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
  first(): T | undefined;
  peekFirst(): T | undefined;
  last(): T | undefined;
  peek(): T | undefined;
  peekLast(): T | undefined;
  push(value: T): number;
  unshift(value: T): number;
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
