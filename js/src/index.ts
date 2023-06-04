/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { parse } from 'acorn';
import { Interpreter } from './model/Interpreter';
// import ast from './ast.json';
import * as ESTree from 'estree';
import { Scope, ScopeType } from './model/Scope';

// const code = 'var a = 1; const b = 4; (a + b) / 2';
// const code = `
// const key = 'a';
// let obj ={num: {[key]: 1}};
// for (let i = 0; i < 30; i++) {obj.num.a=i}
// obj.num.a
// `;

const code = `
  const obj = {a: {b: {c: 0}}};
  obj.a.b.c;
`;

const root = parse(code, {
  ecmaVersion: 8,
  sourceType: 'script',
});

const globalScope = new Scope(ScopeType.BLOCK);

console.log('result: ', new Interpreter(root as ESTree.Node, globalScope).evaluate());
