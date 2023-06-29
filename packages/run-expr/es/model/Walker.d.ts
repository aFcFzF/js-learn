/**
 * @file Interpreter.ts
 * @author afcfzf(9301462@qq.com)
 */
import * as ESTree from 'estree';
import { ES5VisitorMap } from '../standard/es5';
import { Scope } from './Scope';
interface WalkOption<T extends ESTree.Node> {
    node: T;
    scope: Scope;
    rootScope: Scope;
    envScope: Scope;
    visitorMap: ES5VisitorMap;
    globalThis: unknown;
    sourceCode: string;
}
export declare class Walker<T extends ESTree.Node> {
    visitorMap: ES5VisitorMap;
    scope: Scope;
    rootScope: Scope;
    envScope: Scope;
    globalThis: unknown;
    node: WalkOption<T>['node'];
    sourceCode: WalkOption<T>['sourceCode'];
    constructor(option: WalkOption<T>);
    walk(esNode: ESTree.Node, scope?: Scope): any;
    run(): any;
}
export {};
