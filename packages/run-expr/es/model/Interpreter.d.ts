/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */
import { ModeType } from '../types';
export interface InterpreterOption {
    mode?: ModeType;
    context?: Record<string, any>;
    globalThis?: any;
}
export declare class Interpreter {
    private option;
    constructor(option?: InterpreterOption);
    evaluate: (code: string) => any;
}
