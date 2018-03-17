/**
 * Mnemonist Stack Typings
 * ========================
 */
export default class Stack<T> implements Iterable<T> {

  // Members
  size: number;

  // Methods
  clear(): void;
  push(item: T): number;
  pop(): T | undefined;
  peek(): T | undefined;
  forEach(callback: (item: T, index: number, stack: this) => void, scope?: any): void;
  toArray(): Array<T>;
  values(): Iterator<T>;
  entries(): Iterator<[number, T]>;
  [Symbol.iterator](): Iterator<T>;
  toString(): string;
  toJSON(): Array<T>;
  inspect(): any;

  // Statics
  static from<I>(iterable: Iterable<I> | {[key: string] : I}): Stack<I>;
  static of<I>(...items: Array<I>): Stack<I>;
}
