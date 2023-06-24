/**
 * @file evaluate.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from '../../../src/model/Interpreter';

export const testEval = (...args: Parameters<Interpreter['evaluate']>): any => {
  const ins = new Interpreter();
  return ins.evaluate(...args);
};

export const evaluate = testEval;

export {
  Interpreter,
};
