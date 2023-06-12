/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('实例化对象', () => {
  it('实例化并使用', () => {
    const code = `
      function fn() {
        throw new Error('test throw');
      }

      fn();
    `;

    expect(() => testEval(code)).toThrow(Error);
  });
});
