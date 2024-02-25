import { parse } from "../src/parser";
import { describe, it, expect } from "vitest";

describe("parse", () => {
	it("should format the given text using the provided options", async () => {
		const text = `
      <div class="container">
        <h1>Hello, world!</h1>
      </div>
    `;

		const parsers = {};
		const opts = {
			tabWidth: 4,
			printWidth: 80,
			singleAttributePerLine: false,
			bracketSameLine: false,
			wrapAttributes: "auto",
			wrapAttributesMinAttrs: 2,
			endWithNewline: true,
			useTabs: false,
			sortTailwindcssClasses: false,
			tailwindcssConfigPath: undefined,
			sortHtmlAttributes: false,
			noPhpSyntaxCheck: false,
			singleQuote: false,
			trailingCommaPHP: false,
			customHtmlAttributesOrder: [],
			indentInnerHtml: false,
			extraLiners: "",
			filepath: undefined,
		};

		// @ts-ignore
		const result = await parse(text, parsers, opts);

		expect(result.type).toBe("blade-formatter");
		expect(result.body).toBe(
			'<div class="container">\n    <h1>Hello, world!</h1>\n</div>\n',
		);
	});
});
