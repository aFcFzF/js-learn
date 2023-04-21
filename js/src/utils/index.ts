/**
 * @file index.ts
 * @author afcfzf(9301462@qq.com)
 */

export const hasOwnProperty = (
  obj: Record<string, unknown>,
  propName: string,
): boolean => ({}).hasOwnProperty.call(obj, propName);
