/**
 * Mnemonist LRUCacheWithDelete Typings
 * ===========================
 */
 import LRUCache from './lru-cache';

 export default class LRUCacheWithDelete<K, V> extends LRUCache<K, V> {

   delete(key: K): V | undefined;

}
