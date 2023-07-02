/**
 * @file Lexer.ts
 * @author afcfzf(9301462@qq.com)
 */

import {ParseException} from './ParseException';
import { Token } from './Token';

export class Lexer {
  public static pattern = /\s/;

  private queue: Token[] = [];

  private hasMore = false;

  private reader: any; // LineNumberReader;

  public read(): Token {
    if (this.fillQueue(0)) {
      const token = this.queue.shift();
      if (!token) {
        throw new Error('token not exist!');
      }
    }

    return Token.EOF;
  }

  private fillQueue(i: number): boolean {
    while (i >= this.queue.length) {
      if (!this.hasMore) {
        return false;
      }
      this.readLine();
    }

    return true;
  }

  private readLine(): void {
    let line: string;
    try {
      line = this.reader.readLine();
    } catch (err) {
      throw new ParseException(err);
    }

    if (line == null) {
      this.hasMore = false;
      return;
    }

    const lineNo = this.reader.getLineNumber();

  }
}
