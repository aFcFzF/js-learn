/**
 * @file Context.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Variable, VariableKind } from './Variable';

export const defaultContext = {
  console: new Variable(VariableKind.VAR, console),
};
