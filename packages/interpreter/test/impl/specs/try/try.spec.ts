/**
 * @file try.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('try catch', () => {
  it('返回try', () => {
    const code = `
      try {
        1
      } catch (err) {
        2
      }
    `;

    expect(testEval(code)).toBe(1);
  });

  it('返回catch', () => {
    const code = `
      try {
        1
        throw 2;
      } catch (err) {
        err;
      }
    `;

    expect(testEval(code)).toBe(2);
  });

  it('finally 不返回', () => {
    const code = `
      try {
        1
      } catch (err) {
        2
      } finally {
        3
      }
    `;

    expect(testEval(code)).toBe(1);
  });
});
