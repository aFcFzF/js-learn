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
var obj = {
  a: 10,
  f1: function(){
      return this;
  },
  f2: function(){
      return this.a;
  }
}

with(obj) {
var f = f1;
[f(),(0,f1)(),f2()]
}
`;

const a = new Interpreter().evaluate(code, { scope: { JSON } });
console.log('result: ', a);
