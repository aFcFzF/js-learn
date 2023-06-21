/**
 * @file eval.spec.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from '../../../../src/model/Interpreter';

test('eval result -1', () => {
  const interpreter = new Interpreter();

  const value = interpreter.evaluate(`
      b = 1;
      function fn() {
        const b = 2;
        return eval('b + 1');
      }
      fn();
  `);

  expect(value).toEqual(3);
});

// test('new Function result -1', () => {
//   const interpreter = new Interpreter();

//   const value = interpreter.evaluate(`
//       b = 1;
//       function fn() {
//         const b = 2;
//         return (new Function('return b + 1'))();
//       }
//       fn();
//   `);

//   expect(value).toEqual(2);
// });
