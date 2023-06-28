import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('basic without flags', () => {
  const func = evaluate(`
var reg = /^hello/;

function isSayHi(word) {
  return reg.test(word);
}

 isSayHi;
  `);

  deepEqual(true, func('hello world'));
  deepEqual(false, func('abcd'));
});

test('with flags', () => {
  const func = evaluate(`
var reg = /^hello/i;

function isSayHi(word) {
  return reg.test(word);
}

 isSayHi;
  `);

  deepEqual(true, func('hello world'));
  deepEqual(true, func('Hello woRld'));
});

test('with multiple flags', () => {
  const func = evaluate(`
var reg = /^hello/im;

function isSayHi(word) {
  return reg.test(word);
}

 isSayHi;
  `);

  deepEqual(true, func('hello world'));
  deepEqual(true, func('Hello woRld'));
  deepEqual(true, func('Hello \nwoRld'));
});
