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

export type ArrayLike = IArrayLike | ArrayBuffer;

export interface IArrayLikeConstructor {
  new(...args): ArrayLike;
}