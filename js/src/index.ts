/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter, InterpreterOption } from './model/Interpreter';

export type EvaluateContext = Record<string, any>;

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


// const a = new Interpreter().evaluate(code, { scope: { JSON, Function, Error, Math, Number } });
const context = { a: 1, b: 1, c: 1, data: { z: 1 } };

// const rootContext = { a: 1, b: 1, c: 1 };
//   const interpreter = new Interpreter({
//     context: rootContext,
//   });
//   const result = interpreter.evaluate('');
//   expect(result).toEqual([2, 1, 1]);
const code = `
c = 2;
c;
`;

const a = runInContext(code, context, { globalThis: context });

console.log('result: ', a);
