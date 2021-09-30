const acorn = require("acorn");

const Parser = acorn.Parser;
const TokenType = acorn.TokenType;

const guang = "guang";

Parser.acorn.keywordTypes[guang] = new TokenType(guang, { keyword: guang });

// 正则
function wordsRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
}

var guangKeyword = function (Parser) {
  return class extends Parser {
    parse(program) {
      let newKeywords =
        "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super";
      newKeywords += ` ${guang}`;
      this.keywords = wordsRegexp(newKeywords);
      return super.parse(program);
    }
    parseStatement(context, topLevel, exports) {
      var startType = this.type;
      if (startType === Parser.acorn.keywordTypes["guang"]) {
        // 通过 this.startNode() 创建一个新的AST节点，然后 this.next() 消费掉这个 token，之后返回新的 AST 节点。
        var node = this.startNode();
        return this.parseGuangStatement(node);
      } else {
        return super.parseStatement(context, topLevel, exports);
      }
    }
    parseGuangStatement(node) {
      this.next();
      return this.finishNode({ value: guang }, "GuangStatement");
    }
  };
};
const newParser = Parser.extend(guangKeyword);
var program = `
    guang
    const a = 1
`;

const ast = newParser.parse(program);
console.log(ast);
