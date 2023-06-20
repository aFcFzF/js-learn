/**
 * @file evaluate.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from '../../../src/model/Interpreter';

const ins = new Interpreter();

export const testEval = (...args: Parameters<Interpreter['evaluate']>): any => ins.evaluate(...args);

export const evaluate = testEval;

export {
  Interpreter,
};
