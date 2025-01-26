/**
 * Mnemonist Set Typings
 * ======================
 */
export function intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, ...rest: Array<ReadonlySet<T>>): Set<T>;
export function union<T>(a: ReadonlySet<T>, b: ReadonlySet<T>, ...rest: Array<ReadonlySet<T>>): Set<T>;
export function difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T>;
export function symmetricDifference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T>;
export function isSubset<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean;
export function isSuperset<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean;
export function add<T>(a: Set<T>, b: ReadonlySet<T>): void;
export function subtract<T>(a: Set<T>, b: ReadonlySet<T>): void;
export function intersect<T>(a: Set<T>, b: ReadonlySet<T>): void;
export function disjunct<T>(a: Set<T>, b: ReadonlySet<T>): void;
export function intersectionSize<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): number;
export function unionSize<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): number;
export function jaccard<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): number;
export function overlap<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): number;
