/**
 * @file Function.ts
 * @author afcfzf(9301462@qq.com)
 */
import { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression } from 'estree';
import { Walker } from './Walker';
interface UpdateFuncInfoOption {
    fn: Function;
    sourceCode: string;
    start: number;
    end: number;
    name?: string;
    length?: number;
}
export declare const updateFuncInfo: (option: UpdateFuncInfoOption) => void;
export declare const createFunction: (itprNode: Walker<FunctionExpression | FunctionDeclaration | ArrowFunctionExpression>) => Function;
export {};
