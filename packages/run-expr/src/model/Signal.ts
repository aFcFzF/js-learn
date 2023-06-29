/**
 * @file Signal.ts
 * @author afcfzf(9301462@qq.com)
 */

export enum SignalType {
  BREAK = 'break',
  CONTINUE = 'continue',
  RETURN = 'return',
}

export class Signal {
  public static isSignal(target: unknown): target is Signal {
    return target instanceof Signal;
  }

  public static is(target: unknown, type: SignalType): target is Signal {
    return Signal.isSignal(target) && target.signalType === type;
  }

  public static isContinue(target: unknown): target is Signal {
    return Signal.is(target, SignalType.CONTINUE);
  }

  public static isBreak(target: unknown): target is Signal {
    return Signal.is(target, SignalType.BREAK);
  }

  public static isReturn(target: unknown): target is Signal {
    return Signal.is(target, SignalType.RETURN);
  }

  constructor(public signalType: SignalType, public val?: any) {}
}

