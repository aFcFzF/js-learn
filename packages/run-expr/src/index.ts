/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter, InterpreterOption } from './model/Interpreter';
import { Scope } from './model/Scope';

export type EvaluateContext = Record<string, any> | Scope;

export type RunInContextOption = Omit<InterpreterOption, 'context'>;

export const runInContext = (code: string, context?: EvaluateContext, option?: RunInContextOption): any => {
  const ins = new Interpreter({
    ...option,
    context,
  });

  return ins.evaluate(code);
};


export {
  Interpreter,
};

export type {
  InterpreterOption,
};
