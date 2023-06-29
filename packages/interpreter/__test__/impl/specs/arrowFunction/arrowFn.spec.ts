/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('箭头函数this', () => {
  it('基本结果正确', () => {
    const code = `
      box = {
        name: 'box',
        sayName() {
            const fn = () => {
              return this.name;
            };
            return fn();
        }
      };

      box.sayName();
    `;

    expect(testEval(code)).toBe('box');
  });
});
