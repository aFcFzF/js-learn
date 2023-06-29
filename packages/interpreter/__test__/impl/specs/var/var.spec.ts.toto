import { evaluate } from '../../lib/evaluate';
import { deepEqual } from '../../lib/test';

test('declare function -1', () => {
  const a = evaluate(`
    var tmp = 1;
    function f() {
      if(false) {
        var tmp = 'hxd'
      }
      return tmp;
    }
    f();
  `);

  deepEqual(a, undefined);
});
