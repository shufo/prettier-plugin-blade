import { Parser, ParserOptions, resolveConfigFile } from "prettier";
import { FormatterOption } from "blade-formatter";
import { Formatter } from "blade-formatter";
import path from "path";
import { parsePhpVersion } from "./options";

/**
 * Parses the given Blade template text using the provided options and returns the formatted result.
 * @param text The Blade template text to parse and format.
 * @param parsers An object containing parsers to use for parsing the template.
 * @param opts The options to use for formatting the template.
 * @returns An object containing the formatted result, along with metadata about the original text.
 */
export const parse = async (
  text: string,
  parsers: { [parserName: string]: Parser },
  opts: ParserOptions & FormatterOption,
) => {
  const phpVersion = parsePhpVersion(opts["phpVersion"]);

  const formatterOptions: FormatterOption = {
    indentSize: opts["tabWidth"],
    wrapLineLength: opts["printWidth"],
    wrapAttributes: opts["singleAttributePerLine"]
      ? "force-expand-multiline"
      : opts["bracketSameLine"]
        ? "force-aligned"
        : opts["wrapAttributes"],
    wrapAttributesMinAttrs: opts["wrapAttributesMinAttrs"],
    endWithNewline: opts["endWithNewline"],
    useTabs: opts["useTabs"],
    sortTailwindcssClasses: opts["sortTailwindcssClasses"],
    tailwindcssConfigPath: await resolveTailwindConfigPath(opts["filepath"], opts["tailwindcssConfigPath"]),
    sortHtmlAttributes: opts["sortHtmlAttributes"],
    noMultipleEmptyLines: true,
    noPhpSyntaxCheck: opts["noPhpSyntaxCheck"],
    noSingleQuote: !opts["singleQuote"],
    noTrailingCommaPhp: phpVersion < 7.2 || !opts["trailingCommaPHP"],
    customHtmlAttributesOrder: opts["customHtmlAttributesOrder"],
    indentInnerHtml: opts["indentInnerHtml"],
    // @ts-ignore
    extraLiners: opts["extraLiners"].split(","),
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

/**
 * Resolves the path to the Tailwind CSS configuration file, if one is specified.
 * @param filepath The path to the Blade template file being formatted.
 * @param optionPath The path to the Tailwind CSS configuration file, as specified in the formatting options.
 * @returns The resolved path to the Tailwind CSS configuration file, or undefined if no path was specified.
 */
async function resolveTailwindConfigPath(
  filepath: string | undefined,
  optionPath: string | undefined,
): Promise<string | undefined> {
  if (!optionPath) {
    return;
  }

  if (path.isAbsolute(optionPath ?? "")) {
    return optionPath;
  }

  const prettierRcPath = await resolveConfigFile(filepath);

  return path.resolve(path.dirname(prettierRcPath ?? ""), optionPath ?? "");
}
