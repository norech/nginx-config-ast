var parser = require('./build/index');
var fs = require("fs")

var ast = parser.generateAST(`
server {
    listen  80;

    server_name  example.com;
    location / {
        root /etc/nginx/html;
        try_files $uri $uri/ $uri.html =404;
    }
}
`);

console.log("AST: ");
console.log(JSON.stringify(ast, null, 4));
console.log();
console.log("Code: ");
console.log(parser.generateConfig(ast));