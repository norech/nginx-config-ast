export class SyntaxError extends Error {}

export function parse(code: string): IProgram;

export interface INode {
    type: string;
    location: any;
}

export interface IProgram extends INode {
    type: "program";
    statements: IStatement[];
    comments: IComment[];
}

export interface IIdentifier extends INode {
    type: "identifier";
    value: string;
}

export interface IComment extends INode {
    type: "comment";
    value: string;
}

// Statements
export interface IStatement extends INode {
    type: "statement" | "group";
    name: IIdentifier;
    args: IExpression[] | null;
}

export interface IDeclarationStatement extends IStatement {
    type: "statement";
    name: IIdentifier;
    args: IExpression[] | null;
}

export interface IGroup extends IStatement {
    type: "group";
    name: IIdentifier;
    args: IExpression[] | null;
    statements: IStatement[];
}

// Expressions
export interface IExpression extends INode {}

export interface ILiteral extends IExpression {
    type: "literal";
    value: string;
}