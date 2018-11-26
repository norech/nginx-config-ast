import {
    IDeclarationStatement,
    IExpression,
    IGroup,
    IIdentifier,
    ILiteral,
    IProgram,
    IStatement,
} from "./parser";

let indentation = 0;
let code = "";

export function generateCode(program: IProgram) {
    indentation = 0;
    code = "";
    writeStatements(program.statements);
    return code;
}

function write(str: string) {
    code += str;
}

function writeIndentation() {
    for (let i = 0; i < indentation; i++) {
        write("\t");
    }
}

function writeNewline() {
    write("\n");
}

function writeEOS() {
    write(";");
}

function writeSpace() {
    write(" ");
}

function writeIdentifier(identifier: IIdentifier) {
    write(identifier.value);
}

function writeStatements(statements: IStatement[]) {
    for (const statement of statements) {
        writeIndentation();
        writeStatement(statement);
        writeNewline();
    }
}

function writeStatement(statement: IStatement) {
    if (statement.type === "group") {
        writeGroup(<IGroup> statement);
    } else {
        writeDeclarationStatement(<IDeclarationStatement> statement);
    }
}

function writeDeclarationStatement(statement: IDeclarationStatement) {
    writeIdentifier(statement.name);

    writeArguments(statement.args);

    writeEOS();
}

export function writeGroup(group: IGroup) {
    writeIdentifier(group.name);

    writeArguments(group.args);

    writeSpace();

    write("{");
    writeNewline();

    indentation++;
    writeStatements(group.statements);
    indentation--;

    writeIndentation();
    write("}");
}

function writeArguments(expressions: IExpression[] | null) {
    if (expressions == null) { return; }

    for (const expression of expressions) {
        writeSpace();
        writeExpression(expression);
    }
}

function writeExpression(expression: IExpression) {
    if (expression.type === "literal") {
        writeLiteral(<ILiteral> expression);
    }
}

function writeLiteral(literal: ILiteral) {
    write(literal.value);
}
