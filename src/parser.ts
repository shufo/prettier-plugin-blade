import { Parser, ParserOptions } from "prettier";
import execa from 'execa';
import { FormatterOption } from "blade-formatter";

interface IFormatterOption {
  printWidth: number,
  tabWidth: number,
  wrapAttributes?: string,
  endWithNewLine?: boolean,
}

function formatTextWithBladeFormat(text: string, opts: IFormatterOption): execa.ExecaSyncReturnValue {
  const printWidthOption = ["--wrap-line-length", opts.printWidth.toString()];
  const tabWidthOption = ["--indent-size", opts.tabWidth.toString()];
  const wrapAttributesOption = ["--wrap-attributes", opts.wrapAttributes ?? "auto"]
  const endWithNewLineOption = opts.endWithNewLine ? ["--endWithNewLine"] : [];

  return execa.sync("blade-formatter", [
    "--stdin",
    ...printWidthOption,
    ...tabWidthOption,
    ...wrapAttributesOption,
    ...endWithNewLineOption
  ], {
    input: text,
    preferLocal: true,
    localDir: __dirname,
    stripFinalNewline: false,
  });
}

export const parse = (
  text: string,
  parsers: { [parserName: string]: Parser },
  opts: ParserOptions & FormatterOption,
) => {
  // extract formatted text from blade-formatter
  const executionResult = formatTextWithBladeFormat(text, {
    printWidth: opts.printWidth,
    tabWidth: opts.tabWidth,
    wrapAttributes: opts.wrapAttributes,
    endWithNewLine: opts.endWithNewline
  });

  return {
    type: "blade-formatter",
    body: executionResult.stdout,
    end: text.length,
    source: text,
    start: 0,
  };
};
