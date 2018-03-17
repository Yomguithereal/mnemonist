/**
 * Mnemonist Trie Typings
 * =======================
 */
export default class Trie<T> implements Iterable<T> {

  // Members
  size: number;

  // Constructor
  constructor(Token?: new () => T);

  // Methods
  clear(): void;
  add(prefix: T): this;
  delete(prefix: T): boolean;
  has(prefix: T): boolean;
  find(prefix: T): Array<T>;
  prefixes(): Iterator<T>;
  keys(): Iterator<T>;
  [Symbol.iterator](): Iterator<T>;
  inspect(): any;

  // Statics
  static from<I>(iterable: Iterable<I> | {[key: string]: I}): Trie<I>;
}
