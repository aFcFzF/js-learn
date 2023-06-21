/**
 * @file main.ts
 * @author afcfzf(9301462@qq.com)
 */

import { globSync } from 'glob';
import { resolve, parse } from 'path';
import { readFileSync } from 'fs';
import { Interpreter } from '@/src/model/Interpreter';
import chalk from 'chalk';

class Tester {
  // /Volumes/code/personal/languageStudy/js/test/262/specs/es5/ch07/7.8/7.8.3
  // private static targetPaths = globSync(resolve(__dirname, '../specs/**/*.js'));
  private static targetPaths = resolve(__dirname, '../262/specs/es5/ch08/**/*.js');

  private static libsPath = resolve(__dirname, './lib/es5/**/*.js');

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
    const paths = globSync(Tester.targetPaths, { ignore: { ignored: path => {
      const ignore = path.fullpath().includes('.todo');
      return ignore;
    }}});

    const info = {
      all: paths.length,
      success: 0,
      fail: 0,
    };

    for (const path of paths) {
      const { name, dir, ext } = parse(path);
      const forld = dir.split(/\//).slice(-2)
        .join('/');
      const file = `${forld}/${name}${ext}`;
      const code = readFileSync(path, { encoding: 'utf-8' });
      try {
        this.evaluate(`${this.libCode}\n${code}`);
        console.log(chalk.green(`✅ PASS: ${file}`));
        info.success += 1;
      } catch (err) {
        info.fail += 1;
        console.log(chalk.red(`❌ FAIL: ${file} ----- err: ${err}`));
      }
    }

    console.log('=============');
    console.log(`【✅ Summary】-- pass ${info.success}/${info.all}; percent: ${(info.success / info.all * 100).toFixed(2)}%`);
    console.log(`【❌ Summary】-- fail ${info.fail}/${info.all}`);
  }

  private evaluate(code: string): void {
    new Interpreter({
      rootScope: {
        globalThis: {},
        Symbol,
        eval,
        Function,
        Error,
        Math,
        Number,
        SyntaxError,
        ReferenceError,
        Boolean,
        String,
        isNaN,
        Infinity,
      },
    }).evaluate(code);
  }
}

new Tester();
