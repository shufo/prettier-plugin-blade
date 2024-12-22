import type { Parser, Printer, SupportLanguage } from "prettier";
import { defaultOptions, options } from "./options";
import { parse } from "./parser";
import { print } from "./printer";

/**
 * An array of supported languages by the plugin.
 */
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

/**
 * An object containing the parser functions for each supported language.
 */
export const parsers: { [k: string]: Parser } = {
	blade: {
		/**
		 * The parse function for the Blade parser.
		 */
		parse,
		/**
		 * The AST format used by the Blade parser.
		 */
		astFormat: "blade-format",
		/**
		 * The function used to get the start location of a node in the AST.
		 * @param node The AST node.
		 * @returns The start location of the node.
		 */

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		locStart(node: any) {
			return node.start;
		},
		/**
		 * The function used to get the end location of a node in the AST.
		 * @param node The AST node.
		 * @returns The end location of the node.
		 */
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		locEnd(node: any) {
			return node.end;
		},
	},
};

/**
 * An object containing the printer functions for each AST format.
 */
export const printers: { [k: string]: Printer } = {
	"blade-format": {
		/**
		 * The print function for the Blade AST format.
		 */
		print,
	},
};

export { options, defaultOptions };
