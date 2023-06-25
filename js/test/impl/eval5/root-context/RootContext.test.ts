/**
 * @file RootContext.test.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from '../../lib/evaluate';

test('rootContext -1', () => {
  const rootContext = { a: 1, b: 1, c: 1 };
  const interpreter = new Interpreter({
    context: rootContext,
  });
  const result = interpreter.evaluate('[a,b,c]');
  expect(result).toEqual([2, 1, 1]);
});

test('rootContext -2', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1 };
  const interpreter = new Interpreter({
    context: rootContext,
  });
  interpreter.evaluate(`
    var t = 1;
    y = 2
	`);
  expect(rootContext.t).toEqual(1);
  expect(rootContext.y).toEqual(2);
  expect(rootContext.t).toEqual(undefined);
  expect(rootContext.y).toEqual(undefined);
});

test('rootContext -2.1', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1 };
  const interpreter = new Interpreter({
    context: rootContext,
  });
  interpreter.evaluate(`
    var t = 1;
    y = 2;
    a = 3;
    b = 4;
	`);
  expect(rootContext.t).toEqual(1);
  expect(rootContext.y).toEqual(2);
  expect(rootContext.a).toEqual(3);
  expect(rootContext.b).toEqual(4);
});

test('rootContext -2.2', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1 };
  const interpreter = new Interpreter({
    context: rootContext,
  });
  interpreter.evaluate(`
    this.a = 8;
    this.x = 9;
	`);
  expect(rootContext.a).toEqual(8);
  expect(rootContext.x).toEqual(9);
});

test('rootContext -3', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1 };
  const interpreter = new Interpreter({
    context: rootContext,
  });
  const result = interpreter.evaluate(`
        delete a;
        delete b;
        [a,b];
    `);
  expect(result).toEqual([1, 1]);
});

test('rootContext -4', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1, data: { z: 1 } };
  const interpreter = new Interpreter({
    context: rootContext,
  });
  const result = interpreter.evaluate(`
			delete eval;
			delete a;
			delete b;
			delete data.z;
			[a,b, data.z, typeof eval];
    `);
  expect(result).toEqual([1, 1, undefined, 'undefined']);
});

test('rootContext -5', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1, data: { z: 1 } };
  const interpreter = new Interpreter({
    context: rootContext,
  });

  const result = interpreter.evaluate(`
        c = 2;
        c;
    `);
  expect(result).toEqual(2);
  expect(rootContext.c).toEqual(1);
});

test('rootContext -6', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1, data: { z: 1 } };
  const interpreter = new Interpreter({
    context: rootContext,
  });

  const result = interpreter.evaluate(`
        c = 2;
        c;
    `);
  expect(result).toEqual(2);
  expect(rootContext.c).toEqual(1);
});
