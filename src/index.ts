import { generateCode } from "./codegen";
import parser, { IProgram } from "./parser";

export interface IOptions {
    noComments?: boolean;
}

export let SyntaxError = parser.SyntaxError;

export function isConfigValid(str: string) {
    try {
        const ast = generateAST(str);
        return ast != null && typeof ast !== "undefined";
    } catch (err) {
        if (err instanceof SyntaxError) {
            return false;
        }
        throw err;
    }
}

export function generateAST(str: string, options?: IOptions) {
    const ast = parser.parse(str);

    if (typeof options !== "undefined") {
        if (options.noComments) {
            delete ast.comments;
        }
    }

    return ast;
}

export function generateConfig(ast: IProgram) {
    return generateCode(ast);
}
