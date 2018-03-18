/**
 * Mnemonist Set Typings
 * ======================
 */
export function intersection<T>(...set: Array<Set<T>>): Set<T>;
export function union<T>(...set: Array<Set<T>>): Set<T>;
export function difference<T>(a: Set<T>, b: Set<T>): Set<T>;
export function symmetricDifference<T>(a: Set<T>, b: Set<T>): Set<T>;
export function isSubset<T>(a: Set<T>, b: Set<T>): boolean;
export function isSuperset<T>(a: Set<T>, b: Set<T>): boolean;
export function add<T>(a: Set<T>, b: Set<T>): void;
export function subtract<T>(a: Set<T>, b: Set<T>): void;
export function intersect<T>(a: Set<T>, b: Set<T>): void;
export function disjunct<T>(a: Set<T>, b: Set<T>): void;