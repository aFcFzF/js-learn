/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from './model/Interpreter';

const code = `
delete a;
a;
`;


// const a = new Interpreter().evaluate(code, { scope: { JSON, Function, Error, Math, Number } });
const a = new Interpreter({
  context: {
    a: 1,
    b: 1,
    c: 1,
  },
}).evaluate(code);

console.log('result: ', a);
