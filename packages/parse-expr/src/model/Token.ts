/**
 * @file Token.ts
 * @author afcfzf(9301462@qq.com)
 */

export class Token {
  public static eof: Token = new Token(-1);

  private lineNumber: number;

  constructor(line: number) {
    this.lineNumber = line;
  }

  public getLineNumber(): number {
    return this.lineNumber;
  }

  public isIdentifier(): boolean {
    return false;
  }

  public isNumber(): boolean {
    return false;
  }

  public isString(): boolean {
    return false;
  }

  public getNumber(): number {
    throw new Error('not number Token');
  }

  public getText(): string {
    return '';
  }
}
