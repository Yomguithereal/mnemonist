import {nsmallest, nlargest} from '../heap';

const input = new Uint16Array([4, 1, 3]);
const small: Uint16Array = nsmallest(2, input);
const large: Uint16Array = nlargest((a, b) => a - b, 2, input);
const floatSmall: Float32Array = nsmallest((a, b) => a - b, 1, new Float32Array([2, 1]));
const floatLarge: Float64Array = nlargest(1, new Float64Array([2, 1]));
const array: number[] = nsmallest(2, [4, 1, 3]);
const iterable: string[] = nlargest(1, new Set(['a', 'b']));
// @ts-expect-error Typed array selections are not JavaScript arrays.
const wrong: number[] = nsmallest(2, input);
// @ts-expect-error Numeric typed arrays need numeric comparators.
nlargest((a: string, b: string) => a.localeCompare(b), 2, input);
void [small, large, floatSmall, floatLarge, array, iterable, wrong];
