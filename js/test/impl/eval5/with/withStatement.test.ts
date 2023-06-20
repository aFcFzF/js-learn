import { Interpreter, evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('with1', () => {
  const a = evaluate(`
    var a1 = 1;
    var obj = {
        a1 :2
    }
with(obj){
    a1
}
    `);

  deepEqual(a, 2);
});

test('with2', () => {
  const a = evaluate(`
    function o1(){}
 o1.prototype.x = 100;
 var z = new o1();

 with(z) {
     x
 }
    `);

  deepEqual(a, 100);
});

test('with3', () => {
  const result = evaluate(`
    var obj = {}

    with(obj) {
        a = 10
    }

    [obj.a, a]
    `);

  expect(result).toEqual([undefined, 10]);
});

test('with4', () => {
  const ctx: Record<string, any> = {};
  const result = evaluate(
    `

    var obj = {
        a: 10
    }

    with(obj) {
        a = 20
    }

    obj.a

    `,
    { scope: ctx },
  );

  expect(result).toEqual(20);
});

test('with5', () => {
  const ctx: Record<string, any> = {};
  const result = evaluate(
    `

    var obj = {
        a: 10
    }

    with(obj) {
        var a = 20
    }

    obj.a

    `,
    { scope: ctx },
  );

  expect(result).toEqual(20);
});

test('with6', () => {
  const ctx: Record<string, any> = {};
  const result = evaluate(
    `
    var obj = {
        a: 10
    }

    with(obj) {
        var b = 20
    }

    b
    `,
    { scope: ctx },
  );

  expect(result).toEqual(20);
});

test('with7', () => {
  const interpreter = new Interpreter();
  const result = interpreter.evaluate(`
        var obj = {
            a: 10
        }

        with(obj) {
            var a = 20
            var b = 20;
        }

        obj
    `);

  expect(result.a).toEqual(20);
  expect(result.b).toEqual(undefined);
});

test('with8', () => {
  const ctx: Record<string, any> = {};
  const interpreter = new Interpreter({ rootScope: ctx });
  const result = interpreter.evaluate(`
    try {
        var obj = {
            a: 10
        }
        function abc() {
            //throw error
            u.a = 1;
        }
        abc.call(obj);
    } catch (err) {}
    var b = 1;
    [obj.a, b];
  `);

  expect(result).toEqual([10, 1]);
});

test('with9', () => {
  const ctx: Record<string, any> = {};
  const result = evaluate(
    `
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
    `,
    { scope: ctx },
  );

  expect(result).toEqual([undefined, undefined, 10]);
});

test('with10', () => {
  const ctx: Record<string, any> = {};
  const result = evaluate(
    `
    var obj = {
        a: 10,
        f1: function(){
            return this;
        },
        f2: function(){
            return this.a;
        }
    }
    var obj2 = {
        a: 11,
        f3: function(){
            return this;
        },
        f4: function(){
            return this.a;
        }
    }


    with(obj) {
        with(obj2) {
          var f = f1;
          [f(),(0,f1)(),f2(), f4(), (0,f3)()];
        }
    }
    `,
    { scope: ctx },
  );

  expect(result).toEqual([undefined, undefined, 10, 11, undefined]);
});

test('with11', () => {
  const code = `
    with (JSON.parse('{"a": 1}')) {
      a
    }
`;

  const a = new Interpreter().evaluate(code, { scope: { JSON } });
  expect(a).toEqual(1);
});
