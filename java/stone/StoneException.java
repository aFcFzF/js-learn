/**
 * @file StoneException.java
 * @author afcfzf(9301462@qq.com)
 */

package java.stone;

import javax.naming.ldap.StartTlsResponse;

public class StoneException extends RuntimeException {
  public StoneException(String m) {
    super(m);
  }

  public StoneException(String m, ASTree t) {
    super(m + " " + t.toString());
  }
}
