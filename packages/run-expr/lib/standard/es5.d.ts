/**
 * @file es5.ts
 * @author afcfzf(9301462@qq.com)
 */
import { BinaryExpression, Literal, Program, ExpressionStatement, VariableDeclaration, Identifier, ForStatement, UpdateExpression, BlockStatement, AssignmentExpression, MemberExpression, ObjectExpression, BreakStatement, ContinueStatement, ReturnStatement, ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, CallExpression, ThisExpression, NewExpression, ArrayExpression, IfStatement, LogicalExpression, ThrowStatement, TryStatement, CatchClause, UnaryExpression, ConditionalExpression, DoWhileStatement, ForInStatement, SequenceExpression, SwitchStatement, SwitchCase, WhileStatement, EmptyStatement, WithStatement } from 'estree';
import type { Walker } from '../model/Walker';
export interface ES5NodeMap {
    BinaryExpression: BinaryExpression;
    Literal: Literal;
    Program: Program;
    ExpressionStatement: ExpressionStatement;
    VariableDeclaration: VariableDeclaration;
    Identifier: Identifier;
    ForStatement: ForStatement;
    UpdateExpression: UpdateExpression;
    BlockStatement: BlockStatement;
    AssignmentExpression: AssignmentExpression;
    MemberExpression: MemberExpression;
    ObjectExpression: ObjectExpression;
    BreakStatement: BreakStatement;
    ContinueStatement: ContinueStatement;
    ReturnStatement: ReturnStatement;
    ArrowFunctionExpression: ArrowFunctionExpression;
    FunctionDeclaration: FunctionDeclaration;
    CallExpression: CallExpression;
    FunctionExpression: FunctionExpression;
    ThisExpression: ThisExpression;
    NewExpression: NewExpression;
    ArrayExpression: ArrayExpression;
    IfStatement: IfStatement;
    LogicalExpression: LogicalExpression;
    ThrowStatement: ThrowStatement;
    TryStatement: TryStatement;
    CatchClause: CatchClause;
    UnaryExpression: UnaryExpression;
    ConditionalExpression: ConditionalExpression;
    DoWhileStatement: DoWhileStatement;
    ForInStatement: ForInStatement;
    SequenceExpression: SequenceExpression;
    SwitchStatement: SwitchStatement;
    SwitchCase: SwitchCase;
    WhileStatement: WhileStatement;
    EmptyStatement: EmptyStatement;
    WithStatement: WithStatement;
}
export type ES5VisitorMap = {
    [name in keyof ES5NodeMap]: (node: Walker<ES5NodeMap[name]>) => any;
};
export type ES5NodeType = keyof ES5NodeMap;
export type ES5NodeVisitor = ES5VisitorMap[ES5NodeType];
export declare const es5: ES5VisitorMap;
