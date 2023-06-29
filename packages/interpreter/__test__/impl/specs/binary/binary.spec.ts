/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('二元表达式', () => {
  it('delete后，再访问变量应该报错', () => {
    const ctx: Record<string, any> = { b: 2 };

    const code = `
      var c = 6;
      var a = 1;
      delete a;
      a;
    `;

    expect(() => testEval(code, ctx)).toThrowError(ReferenceError);
    expect(ctx.b).toBe(2);
    expect(ctx.a).toBe(undefined);
    expect(ctx.c).toBe(6);
  });
});
