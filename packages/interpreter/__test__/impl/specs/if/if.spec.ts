/**
 * @file const.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('if条件判断', () => {
  it('条件为真', () => {
    const code = `
      const a = 100;
      let pass = false;
      if (a < 101 && a > 99) {
        pass = true;
      }
      pass;
    `;

    expect(testEval(code)).toBe(true);
  });

  it('if if', () => {
    const code = `
      const a = 100;
      const pass = [];
      if (a > 99) {
        pass.push('half');
      }

      if (a < 101) {
        pass.push('half');
      }

      if (a > 99 && a < 101) {
        pass.push('all');
      }
      pass;
    `;
    expect(testEval(code)).toEqual(['half', 'half', 'all']);
  });

  it('if else', () => {
    const code = `
      const list = [99, 100, 101];
      let pass = [];
      for (let i = 0; i < list.length; i++) {
        const val = list[i];
        if (val === 99) {
          pass.push('lt')
        } else if (val === 100) {
          pass.push('eq');
        } else {
          pass.push('gt')
        }
      }
      pass;
    `;
    expect(testEval(code)).toEqual(['lt', 'eq', 'gt']);
  });
});
