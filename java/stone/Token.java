/**
 * @file Token.java
 * @author afcfzf(9301462@qq.com)
 */

package java.stone;

public abstract class Token {
  // end of file
  public static final Token EOF = new Token(-1);

  // end of line
  public static final String EOL = "\\n";


  private int lineNumber;

  protected Token(int line) {
    lineNumber = line;
  }

  public int getLineNumber() {
    return lineNumber;
  }

  public boolean isIdentifier() {
    return false;
  }

  public boolean isNumber() {
    return false;
  }

  public boolean isString() {
    return false;
  }

  public int getNumber() {
    throw new StoneException("not number token");
  }

  public String getText() {
    return "";
  }
}