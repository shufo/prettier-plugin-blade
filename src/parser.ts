import { type Parser, type ParserOptions, resolveConfigFile } from "prettier";
import type { FormatterOption } from "blade-formatter";
import { Formatter } from "blade-formatter";
import path from "node:path";
import { parsePhpVersion } from "./options";
import { sortTailwindClasses } from "./tailwind";

/**
 * Parses the given Blade template text using the provided options and returns the formatted result.
 * @param text The Blade template text to parse and format.
 * @param _parsers An object containing parsers to use for parsing the template.
 * @param opts The options to use for formatting the template.
 * @returns An object containing the formatted result, along with metadata about the original text.
 */
export const parse = async (
	text: string,
	_parsers: { [parserName: string]: Parser },
	opts: ParserOptions & FormatterOption & { tailwindStylesheet?: string },
) => {
	const phpVersion = parsePhpVersion(opts.phpVersion);
	const tailwindStylesheet = opts.sortTailwindcssClasses
		? await resolveOptionPath(opts.filepath, opts.tailwindStylesheet)
		: undefined;

	const formatterOptions: FormatterOption = {
		indentSize: opts.tabWidth,
		wrapLineLength: opts.printWidth,
		wrapAttributes: opts.singleAttributePerLine
			? "force-expand-multiline"
			: opts.bracketSameLine
				? "force-aligned"
				: opts.wrapAttributes,
		wrapAttributesMinAttrs: opts.wrapAttributesMinAttrs,
		endWithNewline: opts.endWithNewline,
		// blade-formatter defaults to os.EOL; Prettier converts LF to the configured endOfLine itself
		endOfLine: "LF",
		useTabs: opts.useTabs,
		// Tailwind CSS v4 classes are sorted before blade-formatter runs
		sortTailwindcssClasses: opts.sortTailwindcssClasses && !tailwindStylesheet,
		tailwindcssConfigPath: await resolveOptionPath(
			opts.filepath,
			opts.tailwindcssConfigPath,
		),
		sortHtmlAttributes: opts.sortHtmlAttributes,
		noMultipleEmptyLines: true,
		noPhpSyntaxCheck: opts.noPhpSyntaxCheck,
		noSingleQuote: !opts.singleQuote,
		noTrailingCommaPhp: phpVersion < 7.2 || !opts.trailingCommaPHP,
		customHtmlAttributesOrder: opts.customHtmlAttributesOrder,
		indentInnerHtml: opts.indentInnerHtml,
		componentPrefix: opts.componentPrefix?.split(","),
		// @ts-expect-error
		extraLiners: opts.extraLiners.split(","),
		phpVersion: opts.phpVersion || "auto",
	};

	const source = tailwindStylesheet
		? await sortTailwindClasses(text, tailwindStylesheet)
		: text;
	const result = await new Formatter(formatterOptions).formatContent(source);

	return {
		type: "blade-formatter",
		body: result,
		end: text.length,
		source: text,
		start: 0,
	};
};

/**
 * Resolves a path given in the formatting options relative to the Prettier configuration file, if one is specified.
 * @param filepath The path to the Blade template file being formatted.
 * @param optionPath The path as specified in the formatting options.
 * @returns The resolved path, or undefined if no path was specified.
 */
async function resolveOptionPath(
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
