{
    var comments = [];
    function addComment(comment) {
        var duplicate = false;
        for(var c of comments) {
            if(c.location.start.offset == comment.location.start.offset && c.location.end.offset == comment.location.end.offset) {
                duplicate = true;
                break;
            }
        }

        if(!duplicate) {
            comments.push(comment);
        }
    }
}

Program
    =   statements:Block
        {
            return {
                type: "program",
                statements,
                comments,
                location: location()
            }
        }
    ;

Block
    =   _ @(@Statement _)+ _
    ;

Identifier
    =   identifier:[A-Za-z0-9_]+
        {
            return {
                type: "identifier",
                value: identifier.join(""),
                location: location()
            }
        }
    ;

Statement
    =   name:Identifier args:(__ @ArgumentList)? _ statements:Group
        {
            return {
                type: "group",
                name, args, statements,
                location: location()
            };
        }
    /   name:Identifier __ args:ArgumentList _ EOS
        {
            return {
                type: "statement",
                name, args,
                location: location()
            };
        }
    ;

Group
    =   "{" _ @Block _ "}"
    ;

ArgumentList
    =   args:(@Expression __ !SpecialChar)* lastArg:Expression
        {
            args.push(lastArg);
            return args;
        }
    ;

Literal
    =   char:(!SpecialChar @.)+
        {
            return {
                type: "literal",
                value: char.join(""),
                location: location()
            };
        }
    ;

Expression
    =   Literal
    ;

Comment
    =   "#" value:(!EOL @.)*
        {
            addComment({
                type: "comment",
                value: value.join(""),
                location: location()
            });
        }
    ;

// Chars

Whitespace "whitespace"
    =   (WhitespaceChar / Comment)+
    ;

WhitespaceChar "whitespace"
    =   "\t"
    /   "\v"
    /   "\f"
    /   " "
    /   "\u00A0"
    /   "\uFEFF" 
    /   [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
    /   LineTerminator
    ;

LineTerminator
    =   [\n\r\u2028\u2029]
    ;

EOL "end of line"
    =   "\r\n"
    /   "\n\r"
    /   "\u2028"
    /   "\u2029"
    /   "\n"
    /   "\r"
    ;

EOF "end of file"
    =   !.
    ;

EOS "end of statement"
    =   ";"
    ;

SpecialChar
    =   "{"
    /   "}"
    /   ";"
    /   "#"
    /   WhitespaceChar
    ;

_   "whitespace"        = Whitespace?       ;
__  "whitespace"        = Whitespace        ;