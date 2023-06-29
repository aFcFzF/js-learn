/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */
import { Interpreter, InterpreterOption } from './model/Interpreter';
import { Scope } from './model/Scope';
export type EvaluateContext = Record<string, any> | Scope;
export type RunInContextOption = Omit<InterpreterOption, 'context'>;
export declare const runInContext: (code: string, context?: EvaluateContext, option?: RunInContextOption) => any;
export { Interpreter, };
export type { InterpreterOption, };
