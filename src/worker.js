import { runAsWorker } from "synckit";
import { BladeFormatter } from "blade-formatter";

runAsWorker(async (text, options) => {
  const result = await new BladeFormatter(options).format(text);
  return result;
});
