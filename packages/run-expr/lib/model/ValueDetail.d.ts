/**
 * @file ValueDetail.ts
 * @author afcfzf(9301462@qq.com)
 */
import type { Scope } from './Scope';
export declare enum ValueDetailKind {
    VAR = "var",
    LET = "let",
    CONST = "const"
}
interface ValueDetailOption {
    kind: ValueDetailKind;
    name: string;
    scope: Scope;
}
export declare class ValueDetail {
    private name;
    private kind;
    private scope;
    constructor(option: ValueDetailOption);
    getKind(): ValueDetailOption['kind'];
    getName(): string;
    getScope(): Scope;
    dispose(): void;
}
export {};
