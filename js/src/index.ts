/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

// import { parse } from 'acorn';
import { Interpreter } from './model/Interpreter';
import { Visitor } from './model/Visitor';
import ast from './ast.json';

// const code = '1 + 2';

// const root = parse(code, {
//   ecmaVersion: 8,
//   sourceType: 'script',
// });

const jsInterpreter = new Interpreter(new Visitor());

console.log('result: ', jsInterpreter.run(ast));
