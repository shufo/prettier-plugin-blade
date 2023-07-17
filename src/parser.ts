import { Parser, ParserOptions, resolveConfigFile } from "prettier";
import { FormatterOption } from "blade-formatter";
import { Formatter } from "blade-formatter";
import path from "path";

export const parse = async (
  text: string,
  parsers: { [parserName: string]: Parser },
  opts: ParserOptions & FormatterOption,
) => {
  const formatterOptions: FormatterOption = {
    indentSize: opts.tabWidth,
    wrapLineLength: opts.printWidth,
    wrapAttributes: opts.singleAttributePerLine
      ? "force-expand-multiline"
      : opts.bracketSameLine
      ? "force-aligned"
      : opts.wrapAttributes,
    endWithNewline: opts.endWithNewline,
    useTabs: opts.useTabs,
    sortTailwindcssClasses: opts.sortTailwindcssClasses,
    tailwindcssConfigPath: await resolveTailwindConfigPath(opts.filepath, opts.tailwindcssConfigPath),
    sortHtmlAttributes: opts.sortHtmlAttributes,
    noMultipleEmptyLines: true,
    noPhpSyntaxCheck: opts.noPhpSyntaxCheck,
    noSingleQuote: !opts.singleQuote,
    customHtmlAttributesOrder: opts.customHtmlAttributesOrder,
  };

  const result = await new Formatter(formatterOptions).formatContent(text);

  return {
    type: "blade-formatter",
    body: result,
    end: text.length,
    source: text,
    start: 0,
  };
};

async function resolveTailwindConfigPath(
  filepath: string | undefined,
  optionPath: string | undefined,
): string | undefined {
  if (!optionPath) {
    return;
  }

  if (path.isAbsolute(optionPath ?? "")) {
    return optionPath;
  }

  const prettierRcPath = await resolveConfigFile(filepath);

  return path.resolve(path.dirname(prettierRcPath ?? ""), optionPath ?? "");
}
