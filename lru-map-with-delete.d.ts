/**
 * Mnemonist LRUMapWithDelete Typings
 * ===========================
 */
 import LRUMap from './lru-map';

 export default class LRUMapWithDelete<K, V> extends LRUMap<K, V> {

   delete(key: K): V | undefined;

}
