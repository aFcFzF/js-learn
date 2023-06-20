/**
 * @file global.d.ts
 * @author afcfzf(9301462@qq.com)
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseNode } from 'estree';

declare module 'estree' {
  interface BaseNode {
    start: number;
    end: number;
  }
}
