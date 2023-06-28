/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('实例化对象', () => {
  it('实例化并使用', () => {
    const code = `
      function Person() {
        this.name = 'person class!';
        this.sayName = function() {
          return this.name;
        }
      }

      const p = new Person();
      p.sayName();
    `;

    expect(testEval(code)).toBe('person class!');
  });
});
