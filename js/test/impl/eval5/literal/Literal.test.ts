import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('Literal', () => {
  const output = evaluate(`
 d = {
  a: null,
  b: undefined,
  c: 0,
  d: "1",
  e: true
};
  `);
  deepEqual(output, {
    a: null,
    b: undefined,
    c: 0,
    d: '1',
    e: true,
  });
});
