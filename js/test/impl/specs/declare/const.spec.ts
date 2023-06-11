/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('变量定义', () => {
  it('只定义不返回值, 赋值才返回值', () => {
    expect(testEval('const a = 1;')).toBe(undefined);
  });

  it('定义简单值和取值', () => {
    const result = testEval('const a = 1; a;');
    expect(result).toBe(1);
  });

  it('定义对象', () => {
    const code = `
      const obj = { name: 'mark', age: 20 };
      obj.company = {
        leader: {
          boss: 'pony',
        },
      };
      obj.company.leader.boss;
    `;

    expect(testEval(code)).toBe('pony');
  });

  it('防止重写const', () => {
    const result = (): void => testEval('const a = 1; a = 2;');
    expect(result).toThrow(TypeError);
  });
});
