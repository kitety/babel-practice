const { transformFileSync } = require("@babel/core");
const insertParameterPlugin = require("./insertParameterPlugin");
const path = require("path");

const { code } = transformFileSync(path.resolve(__dirname, "./sourceCode.js"), {
  plugins: [insertParameterPlugin],
  parserOpts: {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  },
});

console.log("code: ", code);
