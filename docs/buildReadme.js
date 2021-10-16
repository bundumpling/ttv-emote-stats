const markdownInclude = require("markdown-include");

markdownInclude
  .compileFiles("markdown.json")
  .then(() => console.log("Markdown File Compilation Complete"));
