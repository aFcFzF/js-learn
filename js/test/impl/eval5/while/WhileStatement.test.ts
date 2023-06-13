import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('WhileStatement-1', () => {
  const obj = evaluate(`
var obj = {
  i: 0
};

while (obj.i < 3) {
  obj.i++;
}

 obj;
  `);

  deepEqual(true, typeof obj.i === 'number');
  deepEqual(obj.i, 3);
});

test('WhileStatement-2', () => {
  const obj = evaluate(`
var obj = {
  i: 0
};

while (true) {
  obj.i++;
  if (obj.i >= 3) {
    break;
  }
}

 obj;
  `);

  deepEqual(true, typeof obj.i === 'number');
  deepEqual(obj.i, 3);
});
