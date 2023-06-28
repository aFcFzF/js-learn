/**
 * @file test.ts
 * @author afcfzf(9301462@qq.com)
 */

export const deepEqual = (a: unknown, b: unknown): void => {
  expect(a).toEqual(b);
};

export const throws = (fn: Function): void => {
	expect(fn).toThrow();
};
