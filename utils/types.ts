/**
 * Mnemonist Generic Types
 * ========================
 * 
 * Collection of types used throughout the library.
 */
export interface IArrayLike {
  length: number;
  slice(from, to?): IArrayLike;
}

export interface IArrayLikeConstructor {
  new(...args): IArrayLike | ArrayBuffer;
}