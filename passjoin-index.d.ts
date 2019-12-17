/**
 * Mnemonist PassjoinIndex Typings
 * ================================
 */
type LevenshteinDistanceFunction<T> = (a: T, b: T) => number;

export default class PassjoinIndex<T> implements Iterable<T> {

  // Members
  size: number;

  // Constructor
  constructor(levenshtein: LevenshteinDistanceFunction<T>, k: number);

  // Methods
  add(value: T): this;
  search(query: T): Set<T>;
  clear(): void;
  forEach(callback: (value: T, index: number, self: this) => void, scope?: any): void;
  values(): Iterator<T>;
  [Symbol.iterator](): Iterator<T>;
  inspect(): any;

  // Statics
  static from<I>(
    iterable: Iterable<I> | {[key: string] : I},
    levenshtein: LevenshteinDistanceFunction<I>,
    k: number
  ): PassjoinIndex<I>;
}
