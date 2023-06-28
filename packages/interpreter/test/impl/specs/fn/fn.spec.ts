/**
 * @file fn.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { testEval } from '../../lib/evaluate';

describe('普通函数', () => {
  it('函数作用域', () => {
    const code = `
      function fn() {
        var a = 100;
      }
      a
    `;
    expect(() => testEval(code)).toThrow(ReferenceError);


    // const testCode2 = `
    //   var f = function fn() {
    //   }

    //   typeof f === 'function' && typeof fn === 'undefined';
    // `;

    // expect(testEval(testCode2)).toBe(true);
  });

  it('iife 递归调用', () => {
    const code = `
      var callCount = 0;
      (function f(n) {
        if (n > 0) {
          f(n - 1);
          callCount += 1;
        }
      }(1));
      callCount;
    `;
    expect(testEval(code)).toBe(1);
  });

  it('iife 递归调用2', () => {
    const code = `
      var callCount = 0;
      (function f(n) {
        if (n === 0) {
          callCount += 1
          return;
        }
        return false ? 0 : f(n - 1);
      }(100));
      callCount;
    `;
    expect(testEval(code)).toBe(1);
  });
});
