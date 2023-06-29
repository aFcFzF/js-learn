import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('SwitchStatement', () => {
  const func = evaluate(`
function t1(type) {
  switch (type) {
    case "world":
      return "hi world";
    case "eval5":
      return "hi eval5";
    default:
      return "hello world";
  }
}

 t1;
  `);

  deepEqual(true, typeof func === 'function');
  deepEqual(func('world'), 'hi world');
  deepEqual(func('eval5'), 'hi eval5');
  deepEqual(func('aa'), 'hello world');
});

test('SwitchStatement-2', () => {
  const func = evaluate(`
function t2(type) {
  switch (true) {
    case type === "world":
      return "hi world";
    case type === "eval5":
      return "hi eval5";
    default:
      return "hello world";
  }
}

 t2;
  `);

  deepEqual(true, typeof func === 'function');
  deepEqual(func('world'), 'hi world');
  deepEqual(func('eval5'), 'hi eval5');
  deepEqual(func('aa'), 'hello world');
});

test('SwitchStatement with continue', () => {
  const func = evaluate(`
function t3(type) {
  var result = [];
  var i = 0;
  while (i < 5) {
    i++;
    switch (type + "") {
      case "0":
        continue;
    }
    result.push(i);
  }
  return result;
}

 t3;
  `);

  // deepEqual(func(1), [1, 2, 3, 4, 5]);
  // deepEqual(func(2), [1, 2, 3, 4, 5]);

  // the will loop will be continue
  deepEqual(func(0), []);
});

test('SwitchStatement with default continue', () => {
  const func = evaluate(`
function t3(type) {
  var result = [];
  var i = 0;
  while (i < 5) {
    i++;
    switch (type + "") {
      default:
        continue;
    }
    result.push(i);
  }
  return result;
}

 t3;
  `);

  deepEqual(func(0), []);
});

test('SwitchStatement with default break', () => {
  const func = evaluate(`
function t3(type) {
  var result = [];
  var i = 0;
  while (i < 5) {
    i++;
    switch (type + "") {
      default:
        break;
        result.push(i);
    }
  }

  return {
    result:result ,
    i:i,
  };
}

 t3;
  `);

  const { result, i } = func(0);
  deepEqual(result, []);
  deepEqual(i, 5);
});
