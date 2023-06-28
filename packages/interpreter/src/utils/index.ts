/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Statement } from 'estree';

export const hasOwnProperty = (
  obj: Record<string, unknown>,
  propName: string,
): boolean => ({}).hasOwnProperty.call(obj, propName);

/**
 * 得到重排host后的statement
 * var a = 1;
 * function a() {} // a结果是1
 * @param body 函数
 * @returns
 */
export const getHostingStatements = (body: Statement[]): Statement[] => {
  const functionHostingStats: Statement[] = [];
  const varHostingStates: Statement[] = [];
  const normalStats: Statement[] = [];

  for (const statement of body) {
    if (statement.type === 'FunctionDeclaration') {
      functionHostingStats.push(statement);
    } else if (statement.type === 'VariableDeclaration' && statement.kind === 'var') {
      varHostingStates.push(statement);
    } else {
      normalStats.push(statement);
    }
  }
  return [...functionHostingStats, ...varHostingStates, ...normalStats];
};
