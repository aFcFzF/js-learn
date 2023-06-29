/**
 * @file Scope.ts
 * @author afcfzf(9301462@qq.com)
 */
import { ValueDetail, ValueDetailKind } from './ValueDetail';
import { ValueContainer, ValueRef } from './ValueRef';
export type ScopeValue = Record<string, unknown>;
export type ScopeDetail = Record<string, ValueDetail>;
export declare const DEFAULT_INTERNAL_FULL_SCOPE_DATA: ScopeValue;
export declare enum ScopeType {
    FUNCTION = "function",
    BLOCK = "block",
    ENV = "env"
}
export interface ScopeSearchResult {
    scope: Scope;
    valueRef: ValueRef;
}
interface ScopeValueRefOption {
    container: ValueContainer;
    name: string;
    scope: Scope;
}
export declare class ScopeValueRef extends ValueRef {
    private scope;
    constructor(option: ScopeValueRefOption);
    setValue(val: any): void;
    getScope(): Scope;
}
export declare class Scope {
    type: ScopeType;
    /**
     * 父作用域
     */
    parent: Scope | null;
    /**
     * 当前作用域
     * 必须存引用，场景: this === window;
     */
    protected scopeValue: ScopeValue;
    protected scopeDetail: ScopeDetail;
    constructor(type: ScopeType, parent?: Scope | null, scopeValue?: ScopeValue);
    getScopeValue(): ScopeValue;
    /**
     * 这里setValue是给当前scope赋值；
     * 原因：不清楚是给block/function/root作用域赋值，调用该方法时, 只给current赋值；其他作用域需要自行判断
     * 注意；如果detail不存在，说明应该用declare申明而不是重新赋值;
     * @param val
     */
    setValue(name: string, value: unknown): any;
    deleteScopeValue(name: string): void;
    getScopeDetail(): ScopeDetail;
    /**
     * 先从自身scope找，然后从作用域链找，最后从global找
     * @param rawName
     * @returns
     */
    search(rawName: string): ScopeValueRef;
    /**
     * rootScope在Scope里拿不到，原因是：一直递归到env，只能拿到最后一层，否则和search到的scope不一致
     */
    declare(kind: ValueDetailKind, rawName: string, value: any): void;
    private checkDefinition;
    /**
     * ctx.fn = () => 1
     * 那么 function fn() { return 2 } 应该覆盖ctx
     * @param rawName
     * @param value
     */
    private defineVar;
    private defineLet;
    private defineConst;
}
export {};
