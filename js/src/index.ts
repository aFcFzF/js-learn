/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { parse } from 'acorn';
import { Interpreter } from './model/Interpreter';
import fnAst from '@/test/ast/fn.json';
import * as ESTree from 'estree';
import { Scope, ScopeType } from './model/Scope';

// const code = 'var a = 1; const b = 4; (a + b) / 2';
// const code = `
// const key = 'a';
// let obj ={num: {[key]: 1}};
// for (let i = 0; i < 30; i++) {obj.num.a=i}
// obj.num.a
// `;

// const code = `
//   const obj = {666: 1, 777: { ccc: {ddd: {eee: 111}} }},
//         ddd = {a: {b: {c: 111}}};
//   obj[777].ccc.ddd.eee === ddd.a.b.c;
//   test0011;
// `;

// const root = parse(code, {
//   ecmaVersion: 8,
//   sourceType: 'script',
// });

const globalScope = new Scope(ScopeType.BLOCK, null, { test0011: 'hh', console });

// console.log('result: ', new Interpreter(root as ESTree.Node, globalScope).evaluate());
console.log('result: ', new Interpreter(fnAst as ESTree.Node, globalScope).evaluate());
