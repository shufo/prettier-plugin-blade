import { Parser, ParserOptions } from "prettier";
import { FormatterOption } from "blade-formatter";
import { createSyncFn } from "synckit";

export const parse = (
  text: string,
  parsers: { [parserName: string]: Parser },
  opts: ParserOptions & FormatterOption
) => {
  const formatterOptions: FormatterOption = {
    indentSize: opts.tabWidth,
    wrapLineLength: opts.printWidth,
    wrapAttributes: opts.singleAttributePerLine ? 'force-expand-multiline' : opts.bracketSameLine ? 'force-aligned' : opts.wrapAttributes,
    endWithNewline: opts.endWithNewline,
    useTabs: opts.useTabs,
    sortTailwindcssClasses: opts.sortTailwindcssClasses,
    sortHtmlAttributes: opts.sortHtmlAttributes,
  };

  const syncFn = createSyncFn(require.resolve("./worker"));
  const result = syncFn(text, formatterOptions);

  return {
    type: "blade-formatter",
    body: result,
    end: text.length,
    source: text,
    start: 0,
  };
};
