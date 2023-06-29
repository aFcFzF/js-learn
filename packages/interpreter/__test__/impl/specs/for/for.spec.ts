/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('for循环', () => {
  it('基本使用', () => {
    const code = `
      const result = [];
      for (let i = 0; i < 10; i++) {
        result.push(i);
      }

      // 0 ~ 9
      result.join();
    `;

    expect(testEval(code)).toBe(Array.from({ length: 10 }, (_, i) => i).join());
  });

  it('const 更新报错', () => {
    const code = `
      for (const i = 0; i < 10; i++) {}
      console.log(i);
    `;

    expect(() => testEval(code)).toThrow(TypeError);
  });

  it('let 块级作用域外无法读取', () => {
    const code = `
      for (let i = 0; i < 10; i++) {}
      console.log(i);
    `;

    expect(() => testEval(code)).toThrow(ReferenceError);
  });

  it('var 可外部读取', () => {
    const code = `
      for (var i = 0; i < 10; i++) {}
      i;
    `;

    expect(testEval(code)).toBe(10);
  });

  it('var 可外部读取2', () => {
    const code = `
      {
        {
          for (var i = 0; i < 10; i++) {}
        }
      }
      i
    `;

    expect(testEval(code)).toBe(10);
  });
});
