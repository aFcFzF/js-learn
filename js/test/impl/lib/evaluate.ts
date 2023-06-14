/**
 * @file evaluate.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from '../../../src/model/Interpreter';

const ins = new Interpreter();

export const testEval = (code: string): any => ins.evaluate(code);

export const { evaluate } = ins;
