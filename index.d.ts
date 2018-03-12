declare module 'mnemonist' {
    type HashFunc = ((item: any) => any)
    type HashFuncTuple = [HashFunc, HashFunc];
    class FuzzyMultiMap {
        constructor(hashFuncs: HashFunc | HashFuncTuple, container?: any)
        clear(): void;
        add(item: any): FuzzyMultiMap;
        set(key: any, item: any): FuzzyMultiMap;
        get(key: any): any;        
        has(item: any): boolean;
        forEach(callback: (item: any) => any, scope: any): void;
        values(): Iterator<any>;
        inspect(): any;
        [key: string]: any;
    }

    namespace FuzzyMultiMap {
        export function from(iterable: Iterator<any>)
    }

    class Trie {
        clear(): void;
        add(item: string | string[]): Trie;
        delete(item: string | string[]): boolean;
        has(item: string | string[]): boolean;
        get(prefix: string | string[]): (string | string[])[];
        longestPrefix(item: string | string[]): string | string[];
        inspect(): any;
        toJSON(): any;
    }

    namespace Trie {
        export function from(iterable: Iterator<any>)
    }

    type Sequence = string | any[];
    class TrieMap {
        clear(): void;
        set(sequence: Sequence, value: any): TrieMap;
        get(sequence: Sequence): any | undefined;
        delete(sequence: Sequence): boolean;
        has(sequence: Sequence): boolean;
        find(prefix: Sequence): any[];
        longestPrefix(sequence: Sequence): [Sequence, any];
        inspect(): any;
        toJSON(): any;
    }    

    namespace TrieMap {
        export function from(iterable: Iterator<any>)
    }
}