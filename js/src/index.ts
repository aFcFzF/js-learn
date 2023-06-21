/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from './model/Interpreter';

const code = `
name = 1;
this.name === 1;
`;

const a = new Interpreter().evaluate(code, { scope: { JSON, Function, Error, Math, Number } });
console.log('result: ', a);
