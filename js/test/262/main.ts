/**
 * @file main.ts
 * @author afcfzf(9301462@qq.com)
 */

import { globSync } from 'glob';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { parse as acornParse } from 'acorn';
import * as ESTree from 'estree';
import { Scope, ScopeType } from '@/src/model/Scope';
import { Interpreter } from '@/src/model/Interpreter';


class Tester {
  // private static targetPaths = globSync(resolve(__dirname, '../specs/**/*.js'));
  private static targetPaths = resolve(__dirname, '../262/specs/expressions/addition/S11.6.1_A2.1_T1.js');

  private static libsPath = resolve(__dirname, './lib/harness/**/*.js');

  private libCode = '';

  constructor() {
    this.loadTestLib();
    this.run();
  }

  private loadTestLib(): void {
    const paths = globSync(Tester.libsPath);
    paths.forEach((path) => {
      this.libCode += `/* path: ${path} */\n${readFileSync(path, { encoding: 'utf-8' })}`;
    });
  }

  private run(): void {
    const paths = globSync(Tester.targetPaths);
    for (const path of paths) {
      const code = readFileSync(path, { encoding: 'utf-8' });
      this.evaluate(`${this.libCode}\n${code}`);
    }
  }

  private evaluate(code: string): void {
    const root = acornParse(code, {
      ecmaVersion: 8,
      sourceType: 'script',
    });

    const globalScope = new Scope(
      ScopeType.BLOCK,
      null,
      {
        test0011: 'hh',
        Boolean,
        String,
        Object,
      });

    console.log('result: ', new Interpreter(root as ESTree.Node, globalScope).evaluate());
  }
}

new Tester();
