/**
 * @file RootContext.test.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from '../../lib/evaluate';

test('rootContext -1', () => {
  const rootContext = { a: 1, b: 1, c: 1 };
  const ctx = { a: 2 };
  const interpreter = new Interpreter({
    rootScope: rootContext,
  });
  const result = interpreter.evaluate('[a,b,c]', { scope: ctx });
  expect(result).toEqual([2, 1, 1]);
});

test('rootContext -2', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1 };
  const ctx: Record<string, any> = { a: 2 };
  const interpreter = new Interpreter({
    rootScope: rootContext,
  });
  interpreter.evaluate(`
    var t = 1;
    y = 2
	`, { scope: ctx });
  expect(ctx.t).toEqual(undefined);
  expect(ctx.y).toEqual(undefined);
  expect(rootContext.t).toEqual(undefined);
  expect(rootContext.y).toEqual(undefined);
});

test('rootContext -3', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1 };
  const ctx: Record<string, any> = { a: 2, b: 2 };
  const interpreter = new Interpreter({
    rootScope: rootContext,
  });
  const result = interpreter.evaluate(`
        delete a;
        delete b;
        [a,b];
    `, { scope: ctx });
  expect(result).toEqual([1, 1]);
});

test('rootContext -4', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1, data: { z: 1 } };
  const ctx: Record<string, any> = { a: 2, b: 3 };
  const interpreter = new Interpreter({
    rootScope: rootContext,
  });
  const result = interpreter.evaluate(`
			delete eval;
			delete a;
			delete b;
			delete data.z;
			[a,b, data.z, typeof eval];
    `, { scope: ctx });
  expect(result).toEqual([1, 1, undefined, 'undefined']);
});

test('rootContext -5', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1, data: { z: 1 } };
  const ctx: Record<string, any> = { a: 2 };
  const interpreter = new Interpreter({
    rootScope: rootContext,
  });

  const result = interpreter.evaluate(`
        c = 2;
        c;
    `, { scope: ctx });
  expect(result).toEqual(2);
  expect(rootContext.c).toEqual(1);
});

test('rootContext -6', () => {
  const rootContext: Record<string, any> = { a: 1, b: 1, c: 1, data: { z: 1 } };
  const ctx: Record<string, any> = { a: 2, c: 3 };
  const interpreter = new Interpreter({
    rootScope: rootContext,
  });

  const result = interpreter.evaluate(`
        c = 2;
        c;
    `, { scope: ctx });
  expect(result).toEqual(2);
  expect(rootContext.c).toEqual(1);
});
