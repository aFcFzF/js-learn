/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

import { Statement } from 'estree';

export const hasOwnProperty = (
  obj: Record<string, unknown>,
  propName: string,
): boolean => ({}).hasOwnProperty.call(obj, propName);

export const getHostingStatements = (body: Statement[]): Statement[] => {
  const hostingStats: Statement[] = body.filter(node => node.type === 'FunctionDeclaration');
  const normalStats: Statement[] = body.filter(node => node.type !== 'FunctionDeclaration');
  return [...hostingStats, ...normalStats];
};
