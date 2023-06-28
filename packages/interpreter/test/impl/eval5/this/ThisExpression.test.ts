import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('getThisValue', () => {
  // 读的时候，name不存在不要报错
  const result = evaluate(`
    this.name
  `);

  deepEqual(result, undefined);
});

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
    ctx,
  );

  expect(a === ctx).toEqual(true);
});

test('global this -1', () => {
  const ctx = {
    test: 1,
  };

  const globalThis = 1;

  const a = evaluate(
    `
      this
  `,
    ctx,
    {
      globalThis,
    },
  );

  expect(a).toEqual(1);
});

test('global this equal rootScope', () => {
  const a = evaluate(`
			name = 1;
			this.name === 1;
  `);

  expect(a).toEqual(true);
});

test('global this equal rootScope', () => {
  const a = evaluate(`
    const fn = () => {
			name = 1;
      age += 1;
    };

    [this.name === 1, Number.isNaN(this.age)];
  `);

  expect(a).toEqual([false, false]);
});

test('plus a undefine', () => {
  const fn = (): void => evaluate(`
    const fn = () => {
			name = 1;
      age += 1;
    };

    fn();

    [this.name === 1, Number.isNaN(this.age)];
  `);

  expect(fn).toThrowError(ReferenceError);
});
