/**
 * Mnemonist Types Testing
 * ========================
 */
import {Stack} from '../index';

var stack = new Stack<number>();

stack.push(45);
var item: number = stack.pop();

stack.push(45);
stack.push(34);

var iterator: Iterator<number> = stack.values();

console.log(iterator.next());