/**
 * @file StoneException.java
 * @author markJia(markjia@tencent.com)
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
