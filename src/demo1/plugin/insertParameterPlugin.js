const generate = require("@babel/generator").default;

const targetCalleeName = ["log", "info", "error", "debug"].map(
  (item) => `console.${item}`
);

module.exports = function (api, option) {
  // console.log(JSON.stringify(api))
  const { types, template, } = api;
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return;
        }
        const calleeName = generate(path.node.callee).code;
        // 目标函数就是需要的函数
        if (targetCalleeName.includes(calleeName)) {
          const { line, column } = path.node.loc.start;
          // expression 需要执行一下
          const newNode = template.expression(
            `console.log("${
              state.filename || "unkown filename"
            }:(${line},${column})")`
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
    },
  };
};
