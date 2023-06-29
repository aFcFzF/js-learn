import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('ForInStatement-1', () => {
  const obj = evaluate(`
var obj = {
  1: false,
  2: false
};

for (var attr in obj) {
  obj[attr] = true;
}

 obj;
  `);

  deepEqual(true, obj[1]);
  deepEqual(true, obj[2]);
});

test('ForInStatement-2', () => {
  const obj = evaluate(`
var obj = {
  1: false,
  2: false
};

for (var attr in obj) {
  if (obj.hasOwnProperty(attr)){
    obj[attr] = true;
  }
}

 obj;
  `);

  deepEqual(true, obj[1]);
  deepEqual(true, obj[2]);
});

test('var in outer', () => {
  const obj = evaluate(`
const obj = {
  1: false,
  2: false
};

let attr;
for (attr in obj) {
  if (obj.hasOwnProperty(attr)){
    obj[attr] = true;
  }
}

 obj;
  `);

  deepEqual(true, obj[1]);
  deepEqual(true, obj[2]);
});

test('访问block之外const变量，报错', () => {
  const constInBlock = `
const obj = {
  1: false,
  2: false
};

for (let attr in obj) {
  if (obj.hasOwnProperty(attr)){
    obj[attr] = true;
  }
}

attr`;

  expect(() => evaluate(constInBlock)).toThrow(ReferenceError);
});

test('访问block之外var变量，正常', () => {
  const varInBlock = `
    const obj = {
      1: false,
      2: false
    };

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)){
        obj[attr] = true;
      }
    }

    attr`;

  expect(evaluate(varInBlock)).toBe('2');
});
