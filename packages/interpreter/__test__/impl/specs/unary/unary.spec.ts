/**
 * @file try.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('unary', () => {
  it('typeof', () => {
    const code = 'typeof 1';

    expect(testEval(code)).toBe('number');
  });

  it('delete', () => {
    const code = `
      var a = [1, 2, 3];
      delete a[0];
      a[0];
    `;

    expect(testEval(code)).toBe(undefined);

    const delObj = `
      var obj = {
        a: {
          b: {
            c: {
              d: 1
            }
          }
        }
      };
      delete obj.a.b.c.d;
      obj.a.b.c.d
    `;
    expect(testEval(delObj)).toBe(undefined);
  });
});
