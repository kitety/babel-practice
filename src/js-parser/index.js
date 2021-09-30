const { Parser } = require("acorn");

const MyParser = Parser.extend(require("acorn-jsx")(), require("acorn-bigint"));
console.log(MyParser.parse("// Some bigint + JSX code\n<div></div>"));

// 给 javascript 一个关键字 guang，可以作为 statement 单独使用

module.exports = function noisyReadToken(Parser) {
  return class extends Parser {
    readToken(code) {
      console.log("Reading a token!");
      super.readToken(code);
    }
  };
};
