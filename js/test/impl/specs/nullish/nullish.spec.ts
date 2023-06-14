/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('nullish', () => {
  it('基本语法', () => {
    const code = `
      var x = undefined ?? true ? 0 : 42;
      x;
    `;

    expect(testEval(code)).toBe(0);
  });
});
