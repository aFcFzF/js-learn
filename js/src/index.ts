/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from './model/Interpreter';

const code = `
var name = "hello"
name = "world"
`;

// const a = new Interpreter().evaluate(code, { scope: { JSON, Function, Error, Math, Number } });
const a = new Interpreter().evaluate(code);
console.log('result: ', a);
