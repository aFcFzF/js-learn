/**
 * @file ValueRef.ts
 * @author afcfzf(9301462@qq.com)
 */

export type ValueContainer = Record<string, any>;

/**
 * 可读/写obj，要保持引用。比如 obj.a.b = 1; RefPropertyIns[this.key] = 1;
 */
export class ValueRef {
  constructor(private container: ValueContainer, private name: string) {}

  public getValue(): any {
    return this.container[this.name];
  }

  public setValue(val: any): any {
    return this.container[this.name] = val;
  }

  public getContainer(): ValueContainer {
    return this.container;
  }

  public getName(): string {
    return this.name;
  }
}
