import path from "path";
import fs from "fs";
import * as prettier from "prettier";
import * as plugin from "../dist/index";
import { describe, test, expect } from "vitest";

describe("formatter test", () => {
	const fixturesDir = path.resolve(__dirname, "fixtures");
	const formattedFixturesDir = path.resolve(__dirname, "fixtures", "formatted");
	const fixtureDirEntries = fs.readdirSync(fixturesDir, {
		withFileTypes: true,
	});
	const fixtures = fixtureDirEntries
		.filter((entry) => entry.isFile())
		.map((entry) => entry.name);

	for (const fixture of fixtures) {
		test.concurrent(`can format fixture ${fixture}`, async () => {
			const content = fs
				.readFileSync(path.resolve(fixturesDir, fixture))
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
			});

			const expected = fs
				.readFileSync(
					path.resolve(formattedFixturesDir, `formatted.${fixture}`),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		});
	}
});

describe("broken text test", () => {
	const fixturesDir = path.resolve(__dirname, "error-fixtures");

	test.concurrent("can not format fixture", async () => {
		const content = fs
			.readFileSync(path.resolve(fixturesDir, "syntax.error.blade.php"))
			.toString("utf-8");

		const f = async () => {
			return await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
			});
		};

		expect(f).rejects.toThrow("Parse Error");
	});
});

describe("option test", () => {
	const fixturesDir = path.resolve(
		__dirname,
		"fixtures",
		"formattedWithOption",
	);

	const formattedFixturesDir = path.resolve(
		__dirname,
		"fixtures",
		"formattedWithOption",
	);

	test.concurrent("can format fixture with options", async () => {
		const content = fs
			.readFileSync(path.resolve(fixturesDir, "index.blade.php"))
			.toString("utf-8");

		const result = await prettier.format(content, {
			plugins: [plugin],
			parser: "blade",
			tabWidth: 2,
		});

		const expected = fs
			.readFileSync(path.resolve(formattedFixturesDir, "index.blade.php"))
			.toString("utf-8");

		expect(result).toEqual(expected);
	});

	test.concurrent("can format fixture with sort options", async () => {
		const content = fs
			.readFileSync(path.resolve(fixturesDir, "tailwindcss.blade.php"))
			.toString("utf-8");

		const result = await prettier.format(content, {
			plugins: [plugin],
			parser: "blade",
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			sortTailwindcssClasses: true,
		});

		const expected = fs
			.readFileSync(
				path.resolve(formattedFixturesDir, "formatted.tailwindcss.blade.php"),
			)
			.toString("utf-8");

		expect(result).toEqual(expected);
	});

	test.concurrent(
		"can format fixture with singleAttributePerLine options",
		async () => {
			const content = fs
				.readFileSync(
					path.resolve(fixturesDir, "single_attribute_per_line.blade.php"),
				)
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				singleAttributePerLine: true,
			});

			const expected = fs
				.readFileSync(
					path.resolve(
						formattedFixturesDir,
						"formatted.single_attribute_per_line.blade.php",
					),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);

	test.concurrent(
		"can format fixture with bracketSameLine option",
		async () => {
			const content = fs
				.readFileSync(path.resolve(fixturesDir, "bracket_same_line.blade.php"))
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				bracketSameLine: true,
			});

			const expected = fs
				.readFileSync(
					path.resolve(
						formattedFixturesDir,
						"formatted.bracket_same_line.blade.php",
					),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);

	test.concurrent(
		"can format fixture with tailwind config path option",
		async () => {
			const content = fs
				.readFileSync(path.resolve(fixturesDir, "tailwind", "index.blade.php"))
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				sortTailwindcssClasses: true,
				tailwindcssConfigPath: path.resolve(
					fixturesDir,
					"tailwind",
					"tailwind.config.example.js",
				),
			});

			const expected = fs
				.readFileSync(
					path.resolve(
						formattedFixturesDir,
						"tailwind",
						"formatted.index.blade.php",
					),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);

	test.concurrent(
		"can format fixture with no php syntax check option",
		async () => {
			const content = fs
				.readFileSync(
					path.resolve(fixturesDir, "no_php_syntax_check.blade.php"),
				)
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				noPhpSyntaxCheck: true,
			});

			const expected = fs
				.readFileSync(
					path.resolve(
						formattedFixturesDir,
						"formatted.no_php_syntax_check.blade.php",
					),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);

	test.concurrent(
		"can format fixture with custom html attributes order option",
		async () => {
			const content = fs
				.readFileSync(
					path.resolve(fixturesDir, "custom_html_attributes_order.blade.php"),
				)
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				sortHtmlAttributes: "custom",
				customHtmlAttributesOrder: "id, aria-.+, class, src",
			});

			const expected = fs
				.readFileSync(
					path.resolve(
						formattedFixturesDir,
						"formatted.custom_html_attributes_order.blade.php",
					),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);

	test.concurrent(
		"can format fixture with sort html attributes option as vuejs",
		async () => {
			const content = fs
				.readFileSync(path.resolve(fixturesDir, "vuejs_sort.blade.php"))
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				sortHtmlAttributes: "vuejs",
			});

			const expected = fs
				.readFileSync(
					path.resolve(formattedFixturesDir, "formatted.vuejs_sort.blade.php"),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);

	test.concurrent("can format fixture with single quote option", async () => {
		const content = fs
			.readFileSync(
				path.resolve(
					__dirname,
					"fixtures",
					"runtimeConfig",
					"singleQuote",
					"index.blade.php",
				),
			)
			.toString("utf-8");

		const result = await prettier.format(content, {
			plugins: [plugin],
			parser: "blade",
			singleQuote: false,
		});

		const expected = fs
			.readFileSync(
				path.resolve(
					__dirname,
					"fixtures",
					"runtimeConfig",
					"singleQuote",
					"formatted.index.blade.php",
				),
			)
			.toString("utf-8");

		expect(result).toEqual(expected);
	});

	test.concurrent(
		"can format fixture with trailing comma php option",
		async () => {
			const content = fs
				.readFileSync(
					path.resolve(
						__dirname,
						"fixtures",
						"runtimeConfig",
						"trailingCommaPhp",
						"index.blade.php",
					),
				)
				.toString("utf-8");

			const result = await prettier.format(content, {
				plugins: [plugin],
				parser: "blade",
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				trailingCommaPHP: false,
			});

			const expected = fs
				.readFileSync(
					path.resolve(
						__dirname,
						"fixtures",
						"runtimeConfig",
						"trailingCommaPhp",
						"formatted.index.blade.php",
					),
				)
				.toString("utf-8");

			expect(result).toEqual(expected);
		},
	);
});
