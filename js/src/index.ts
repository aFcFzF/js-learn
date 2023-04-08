/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

// import { parse } from 'acorn';
import { Interpreter } from './model/Interpreter';
import ast from './ast.json';
import * as ESTree from 'estree';

// const code = '1 + 2';

// const root = parse(code, {
//   ecmaVersion: 8,
//   sourceType: 'script',
// });

// const jsInterpreter = new Interpreter(ast as ESTree.Node);


console.log('result: ', new Interpreter(ast as ESTree.Node).interpret());
