/**
 * @file Signal.ts
 * @author afcfzf(9301462@qq.com)
 */
export declare enum SignalType {
    BREAK = "break",
    CONTINUE = "continue",
    RETURN = "return"
}
export declare class Signal {
    signalType: SignalType;
    val?: any;
    static isSignal(target: unknown): target is Signal;
    static is(target: unknown, type: SignalType): target is Signal;
    static isContinue(target: unknown): target is Signal;
    static isBreak(target: unknown): target is Signal;
    static isReturn(target: unknown): target is Signal;
    constructor(signalType: SignalType, val?: any);
}
