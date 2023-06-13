import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('LogicalExpression-or-1', () => {
  const num = evaluate(`
 0 || 2;
  `);

  deepEqual(num, 2);
});

test('LogicalExpression-or-2', () => {
  const num = evaluate(`
 1 || 2;
  `);

  deepEqual(num, 1);
});

test('LogicalExpression-and-1', () => {
  const num = evaluate(`
 1 && 2;
  `);

  deepEqual(num, 2);
});

test('LogicalExpression-and-2', () => {
  const num = evaluate(`
 0 && 2;
  `);

  deepEqual(num, 0);
});
