/**
 * Mnemonist Heap Typings
 * =======================
 */
type HeapComparator<T> = (a: T, b: T) => number;

export default class Heap<T> {

  // Members
  size: number;

  // Constructor
  constructor(comparator?: HeapComparator<T>);

  // Methods
  clear(): void;
  push(item: T): number;
  peek(): T | undefined;
  pop(): T | undefined;
  replace(): T | undefined;
  pushpop(): T | undefined;
  toArray(): Array<T>;
  inspect(): any;

  // Statics
  static from<I>(
    iterable: Iterable<I> | {[key: string] : I},
    comparator?: HeapComparator<I>
  ): Heap<I>;
}

export class MinHeap<T> {

  // Members
  size: number;

  // Constructor
  constructor(comparator?: HeapComparator<T>);

  // Methods
  clear(): void;
  push(item: T): number;
  peek(): T | undefined;
  pop(): T | undefined;
  replace(): T | undefined;
  pushpop(): T | undefined;
  toArray(): Array<T>;
  inspect(): any;
}

export class MaxHeap<T> {

  // Members
  size: number;

  // Constructor
  constructor(comparator?: HeapComparator<T>);

  // Methods
  clear(): void;
  push(item: T): number;
  peek(): T | undefined;
  pop(): T | undefined;
  toArray(): Array<T>;
  inspect(): any;
}
