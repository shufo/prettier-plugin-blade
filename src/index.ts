import { parse } from "./parser";
import { print } from "./printer";
import { options, defaultOptions } from "./options";
import { Parser, Printer, SupportLanguage } from "prettier";


export const languages: SupportLanguage[] = [
  {
    name: "Blade",
    parsers: ["blade"],
    since: "1.0.0",
    extensions: [".blade.php"],
    tmScope: "source.blade.php",
    aceMode: "text",
    linguistLanguageId: 33,
    vscodeLanguageIds: ["blade"],
  },
];

export const parsers: { [k: string]: Parser } = {
  blade: {
    parse,
    astFormat: "blade-format",
    locStart(node: any) {
      return node.start;
    },
    locEnd(node: any) {
      return node.end;
    },
  },
};

export const printers: { [k: string]: Printer } = {
  "blade-format": {
    print,
  },
};

export { options, defaultOptions };