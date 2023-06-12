/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('三元表达式', () => {
  it('基本结果正确', () => {
    const code = `
      const a = 1;
      a ? 2 : 3;
    `;

    expect(testEval(code)).toBe(2);

    const alternate = `
      const a = 0;
      a ? 2 : 3;
    `;

    expect(testEval(alternate)).toBe(3);
  });
});
