const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");
const template = require("@babel/template").default;

const sourceCode = `
console.log(1);

function func() {
  console.info(2);
}

export default class Clazz {
  say() {
    console.debug(3);
  }

  render() {
    return <div>{console.error(4)}</div>;
  }

}
`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

const targetCalleeName = ["log", "info", "debug", "error"].map(
  (item) => `console.${item}`
);
// 在console 的前面插入console
traverse(ast, {
  CallExpression(path, state) {
    if (path.node.isNew) {
      return;
    }
    const calleeName = generator(path.node.callee).code;
    // 目标函数就是需要的函数
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      // expression 需要执行一下
      const newNode = template.expression(
        `console.log("filename:(${line},${column})")`
      )();
      newNode.isNew = true;
      // 还要看是不是jsx里面
      if (path.findParent((path) => path.isJSXElement())) {
        // 是的话就需要替换
        path.replaceWith(types.arrayExpression([newNode, path.node]));
        path.skip();
      } else {
        path.insertBefore(newNode);
      }
    }
  },
});

const { code, map } = generator(ast);
console.log("code: ", code);
