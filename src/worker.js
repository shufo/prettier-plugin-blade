const { runAsWorker } = require("synckit");
const { BladeFormatter } = require("blade-formatter");

runAsWorker(async (text, options) => {
  const result = await new BladeFormatter(options).format(text);
  return result;
});
