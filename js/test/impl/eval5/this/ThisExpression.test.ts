import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('ThisExpression', () => {
  const func = evaluate(`
function t(){
  this.name = "hello";
  return this;
}

 t;
  `);

  const ctx: { [x: string]: any } = {};

  func.call(ctx);

  deepEqual(ctx.name, 'hello');
});

test('global this', () => {
  const ctx = {
    test: 1,
  };
  const a = evaluate(
    `
        this
  `,
    { globalThis: ctx },
  );

  expect(a === ctx).toEqual(true);
});

test('global this equal rootScope', () => {
  const a = evaluate(`
			name = 1;
			this.name === 1;
  `);

  expect(a).toEqual(true);
});
