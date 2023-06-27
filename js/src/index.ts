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

// const a = new Interpreter().evaluate(code, { scope: { JSON, Function, Error, Math, Number } });
const context = { };
// const rootContext = { a: 1, b: 1, c: 1 };
//   const interpreter = new Interpreter({
//     context: rootContext,
//   });
//   const result = interpreter.evaluate('');
//   expect(result).toEqual([2, 1, 1]);
const code = `
b = 1;
function fn() {
  const b = 2;
  return eval('b + 1');
}
fn();
`;

const a = runInContext(code);

console.log('result: ', a);
