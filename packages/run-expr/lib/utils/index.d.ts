/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */
import { Statement } from 'estree';
export declare const hasOwnProperty: (obj: Record<string, unknown>, propName: string) => boolean;
/**
 * 得到重排host后的statement
 * var a = 1;
 * function a() {} // a结果是1
 * @param body 函数
 * @returns
 */
export declare const getHostingStatements: (body: Statement[]) => Statement[];
