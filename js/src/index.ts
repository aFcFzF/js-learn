/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Interpreter } from './model/Interpreter';

// const code = `
// var a = (get() , 2);
// var b;

// function get(){
//   b = 3;
// }

//  d = {a: a, b: b};
// `;

// const code = `
// var tmp = 1;
// function f() {
//  console.log(tmp);
//  if(false) {
// 	var tmp = 'hxd'
//  }
// }
// f()
// `;

const code = `
  a = 2;
`;

console.log('result: ', new Interpreter().evaluate(code));
