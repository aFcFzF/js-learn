/**
 * @file ValueRef.ts
 * @author afcfzf(9301462@qq.com)
 */
export type ValueContainer = Record<string, any>;
/**
 * 可读/写obj，要保持引用。比如 obj.a.b = 1; RefPropertyIns[this.key] = 1;
 */
export declare class ValueRef {
    private container;
    private name;
    constructor(container: ValueContainer, name: string);
    getValue(): any;
    setValue(val: any): any;
    getContainer(): ValueContainer;
    getName(): string;
}
