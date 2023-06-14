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

const code = `
var iterations = 0;
var iter = function*() {
  iterations += 1;
}();

var callCount = 0;
var f;
f = ([...[]]) => {
  assert.sameValue(iterations, 1);
  callCount = callCount + 1;
};

f(iter);
assert.sameValue(callCount, 1, 'arrow function invoked exactly once');
`;

console.log('result: ', new Interpreter().evaluate(code));

