import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('+', () => {
  const num = evaluate(`
1 + 2;
  `);
  deepEqual(num, 3);
});

test('+=', () => {
  const num = evaluate(`
var a = 1;
var b = 2;
a += 2;

  `);
  deepEqual(num, 3);
});

test('-', () => {
  const num = evaluate(`
 2 - 1;
  `);
  deepEqual(num, 1);
});

test('-=', () => {
  const num = evaluate(`
var a = 1;
var b = 2;
a -= 2;

  `);
  deepEqual(num, -1);
});

test('*', () => {
  const num = evaluate(`
 2 * 1;
  `);
  deepEqual(num, 2);
});

test('**', () => {
  const num = evaluate(`
 2 ** 3;
  `);
  deepEqual(num, 8);
});

test('*=', () => {
  const num = evaluate(`
var a = 1;
var b = 2;
a *= 2;

  `);
  deepEqual(num, 2);
});

test('**=', () => {
  const num = evaluate(`
var a = 2;
var b = 3;
a **= b;

  `);
  deepEqual(num, 8);
});

test('/', () => {
  const num = evaluate(`
 2 / 1;
  `);
  deepEqual(num, 2);
});

test('/=', () => {
  const num = evaluate(`
var a = 1;
var b = 2;
a /= 2;

  `);
  deepEqual(num, 0.5);
});

test('%', () => {
  const num = evaluate(`
 2 % 1;
  `);
  deepEqual(num, 0);
});

test('%=', () => {
  const num = evaluate(`
var a = 1;
var b = 2;
a %= 2;

  `);
  deepEqual(num, 1);
});

test('>', () => {
  const output = evaluate(`
 2 > 2;
  `);
  deepEqual(output, false);
});

test('>=', () => {
  const output = evaluate(`
 2 >= 2;
  `);
  deepEqual(output, true);
});

test('<', () => {
  const output = evaluate(`
 2 < 2;
  `);
  deepEqual(output, false);
});

test('<=', () => {
  const output = evaluate(`
 2 <= 2;
  `);
  deepEqual(output, true);
});

test('>>', () => {
  const output = evaluate(`
 2 >> 2;
  `);
  deepEqual(output, 0);
});

test('>>>', () => {
  const output = evaluate(`
 2 >>> 2;
  `);
  deepEqual(output, 0);
});

test('<<', () => {
  const output = evaluate(`
 2 << 2;
  `);
  deepEqual(output, 8);
});

test('&', () => {
  const output = evaluate(`
 2 & 2;
  `);
  deepEqual(output, 2);
});

test('|', () => {
  const output = evaluate(`
 2 | 2;
  `);
  deepEqual(output, 2);
});

test('|', () => {
  const output = evaluate(`
 2 | 2;
  `);
  deepEqual(output, 2);
});

test('??=', () => {
  const output = evaluate(`
	 var a;
	 a ??= 2;
  `);
  deepEqual(output, 2);
});
