import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** The part of the Tailwind CSS v4 design system used for sorting. */
type DesignSystem = {
	getClassOrder(classes: string[]): [string, bigint | null][];
};

type LoadDesignSystem = (
	css: string,
	options: {
		base: string;
		loadStylesheet?: (
			id: string,
			base: string,
		) => Promise<{ path: string; base: string; content: string }>;
		loadModule?: (
			id: string,
			base: string,
		) => Promise<{ path: string; base: string; module: unknown }>;
	},
) => Promise<DesignSystem>;

/**
 * Regions blade-formatter never sorts classes in, because it replaces them
 * with placeholders before its own Tailwind sorting runs.
 */
const ignoredRegionPatterns = [
	// ignore entire file
	/^{{--\s*blade-formatter-disable\s*--}}[\s\S]*$/g,
	// range ignore
	/(?:{{--\s*?blade-formatter-disable\s*?--}}|<!--\s*?prettier-ignore-start\s*?-->|{{--\s*?prettier-ignore-start\s*?--}}).*?(?:{{--\s*?blade-formatter-enable\s*?--}}|<!--\s*?prettier-ignore-end\s*?-->|{{--\s*?prettier-ignore-end\s*?--}})/gis,
	// line ignore
	/(?:{{--\s*?blade-formatter-disable-next-line\s*?--}}|{{--\s*?prettier-ignore\s*?--}}|<!--\s*?prettier-ignore\s*?-->)[\r\n]+[^\r\n]+/gi,
	/<script\b.*?<\/script>/gis,
	/<style\b.*?<\/style>/gis,
	/@verbatim\b.*?@endverbatim\b/gs,
	/<\?(?:php|=).*?(?:\?>|$)/gs,
];

/** Pairs of opening and closing Blade tokens whose contents are kept as is. */
const bladeEnclosures: [string, string][] = [
	["{{--", "--}}"],
	["@{{", "}}"],
	["{!!", "!!}"],
	["{{", "}}"],
];

const classAttributeRegex = /\s+class\s*=\s*(["'])/y;
const directiveRegex = /@([A-Za-z_]\w*)/y;

const designSystems = new Map<string, Promise<DesignSystem>>();

/**
 * Sorts the classes of every `class` attribute in the given Blade template
 * with the Tailwind CSS v4 design system defined by the given stylesheet.
 *
 * Blade expressions and directive blocks inside a class attribute are kept
 * together and, like any class unknown to Tailwind, moved to the front.
 *
 * @param text The Blade template.
 * @param stylesheetPath Absolute path to the Tailwind CSS v4 entry stylesheet.
 * @returns The template with sorted class attributes.
 */
export async function sortTailwindClasses(
	text: string,
	stylesheetPath: string,
): Promise<string> {
	const designSystem = await getDesignSystem(stylesheetPath);
	const ignoredRegions = findIgnoredRegions(text);

	let result = "";
	let copiedUntil = 0;
	let i = 0;

	while (i < text.length) {
		const ignoredRegionEnd = ignoredRegions.get(i);
		if (ignoredRegionEnd !== undefined) {
			i = ignoredRegionEnd;
			continue;
		}

		const enclosureEnd = skipBladeEnclosure(text, i);
		if (enclosureEnd !== undefined) {
			i = enclosureEnd;
			continue;
		}

		classAttributeRegex.lastIndex = i;
		const attribute = classAttributeRegex.exec(text);
		if (!attribute) {
			i++;
			continue;
		}

		const valueStart = classAttributeRegex.lastIndex;
		const valueEnd = findValueEnd(text, valueStart, attribute[1]);
		if (valueEnd === -1) {
			i = valueStart;
			continue;
		}

		const classes = splitClasses(text.slice(valueStart, valueEnd));
		if (classes && classes.length > 0) {
			result +=
				text.slice(copiedUntil, valueStart) +
				sortClasses(designSystem, classes).join(" ");
			copiedUntil = valueEnd;
		}
		i = valueEnd + 1;
	}

	return result + text.slice(copiedUntil);
}

/**
 * Sorts classes in the order of the generated CSS. Classes unknown to
 * Tailwind CSS keep their relative order and are moved to the front.
 */
function sortClasses(designSystem: DesignSystem, classes: string[]): string[] {
	return designSystem
		.getClassOrder(classes)
		.sort(([, a], [, b]) => {
			if (a === b) return 0;
			if (a === null) return -1;
			if (b === null) return 1;
			return a < b ? -1 : 1;
		})
		.map(([className]) => className);
}

/**
 * Loads the design system of the given stylesheet, reusing it until the stylesheet changes.
 */
function getDesignSystem(stylesheetPath: string): Promise<DesignSystem> {
	let mtime: number;
	try {
		mtime = fs.statSync(stylesheetPath).mtimeMs;
	} catch {
		throw new Error(
			`Tailwind CSS stylesheet could not be found at: ${stylesheetPath}`,
		);
	}

	const key = `${stylesheetPath}:${mtime}`;
	let designSystem = designSystems.get(key);
	if (!designSystem) {
		designSystem = loadDesignSystem(stylesheetPath);
		designSystem.catch(() => designSystems.delete(key));
		designSystems.set(key, designSystem);
	}

	return designSystem;
}

/**
 * Loads the design system of the given stylesheet with the Tailwind CSS v4
 * installed in the project the stylesheet belongs to.
 *
 * `@tailwindcss/node` (a dependency of `@tailwindcss/vite` and `@tailwindcss/postcss`)
 * is preferred as it resolves imports, plugins and configs exactly like the build does.
 */
async function loadDesignSystem(stylesheetPath: string): Promise<DesignSystem> {
	const base = path.dirname(stylesheetPath);
	const css = await fs.promises.readFile(stylesheetPath, "utf-8");
	const projectRequire = createRequire(stylesheetPath);

	const tailwindcssPackagePath = resolveFrom(
		projectRequire,
		"tailwindcss/package.json",
	);
	const version: string | undefined = tailwindcssPackagePath
		? JSON.parse(fs.readFileSync(tailwindcssPackagePath, "utf-8")).version
		: undefined;
	if (!version || Number.parseInt(version, 10) < 4) {
		throw new Error(
			`The tailwindStylesheet option requires Tailwind CSS v4 to be installed in your project${version ? `, but found v${version}` : ""}.`,
		);
	}

	const nodePath = resolveFrom(projectRequire, "@tailwindcss/node");
	if (nodePath) {
		const loadDesignSystem = await importLoadDesignSystem(nodePath);
		return loadDesignSystem(css, { base });
	}

	const loadDesignSystem = await importLoadDesignSystem(
		projectRequire.resolve("tailwindcss"),
	);

	return loadDesignSystem(css, {
		base,
		async loadStylesheet(id, base) {
			const resolved = resolveStylesheet(id, base);
			return {
				path: resolved,
				base: path.dirname(resolved),
				content: await fs.promises.readFile(resolved, "utf-8"),
			};
		},
		async loadModule(id, base) {
			const resolved = createRequire(path.join(base, "noop.js")).resolve(id);
			const module = await importModule(resolved);
			return {
				path: resolved,
				base: path.dirname(resolved),
				module: module.default ?? module,
			};
		},
	});
}

/**
 * Resolves a stylesheet imported with `@import`, honoring the `style` export
 * of packages such as `tailwindcss`.
 */
function resolveStylesheet(id: string, base: string): string {
	if (id.startsWith(".") || path.isAbsolute(id)) {
		return path.resolve(base, id);
	}

	const segments = id.split("/");
	const packageName = id.startsWith("@")
		? segments.slice(0, 2).join("/")
		: segments[0];
	const subpath = id.slice(packageName.length);

	const packageJsonPath = createRequire(path.join(base, "noop.js")).resolve(
		`${packageName}/package.json`,
	);
	const packageDir = path.dirname(packageJsonPath);
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
	const exported = packageJson.exports?.[`.${subpath}`];

	if (typeof exported === "string") {
		return path.resolve(packageDir, exported);
	}
	if (exported?.style) {
		return path.resolve(packageDir, exported.style);
	}
	if (!subpath && packageJson.style) {
		return path.resolve(packageDir, packageJson.style);
	}

	const file = path.join(packageDir, subpath || "index.css");
	return fs.existsSync(file) || path.extname(file) ? file : `${file}.css`;
}

function resolveFrom(require: NodeJS.Require, id: string): string | undefined {
	try {
		return require.resolve(id);
	} catch {
		return undefined;
	}
}

async function importLoadDesignSystem(
	modulePath: string,
): Promise<LoadDesignSystem> {
	const module = await importModule(modulePath);
	return (
		module.__unstable__loadDesignSystem ??
		module.default.__unstable__loadDesignSystem
	);
}

// biome-ignore lint/suspicious/noExplicitAny: modules are loaded from the project at runtime
async function importModule(modulePath: string): Promise<any> {
	return import(pathToFileURL(modulePath).href);
}

/**
 * Maps the start of every region classes must not be sorted in to its end.
 */
function findIgnoredRegions(text: string): Map<number, number> {
	const regions = new Map<number, number>();

	for (const pattern of ignoredRegionPatterns) {
		for (const match of text.matchAll(pattern)) {
			const start = match.index ?? 0;
			const end = start + match[0].length;
			regions.set(start, Math.max(end, regions.get(start) ?? 0));
		}
	}

	return regions;
}

/**
 * Returns the end of the Blade echo or comment starting at `index`, or
 * `undefined` if none starts there. An unterminated one extends to the end.
 */
function skipBladeEnclosure(text: string, index: number): number | undefined {
	for (const [open, close] of bladeEnclosures) {
		if (text.startsWith(open, index)) {
			const end = text.indexOf(close, index + open.length);
			return end === -1 ? text.length : end + close.length;
		}
	}
}

/**
 * Returns the end of the parenthesized expression starting at `index`,
 * honoring nested parentheses and string literals, or -1 if unbalanced.
 */
function skipParentheses(text: string, index: number): number {
	let depth = 0;

	for (let i = index; i < text.length; i++) {
		const char = text[i];

		if (char === "'" || char === '"' || char === "`") {
			i++;
			while (i < text.length && text[i] !== char) {
				if (text[i] === "\\") i++;
				i++;
			}
		} else if (char === "(") {
			depth++;
		} else if (char === ")" && --depth === 0) {
			return i + 1;
		}
	}

	return -1;
}

/**
 * Returns the index of the quote closing the attribute value starting at
 * `start`, skipping quotes inside Blade echos and directive arguments, or
 * -1 if there is none.
 */
function findValueEnd(text: string, start: number, quote: string): number {
	let i = start;

	while (i < text.length) {
		if (text[i] === quote) {
			return i;
		}

		const enclosureEnd = skipBladeEnclosure(text, i);
		if (enclosureEnd !== undefined) {
			i = enclosureEnd;
			continue;
		}

		const directive = matchDirective(text, i);
		if (directive) {
			if (directive.end === -1) return -1;
			i = directive.end;
			continue;
		}

		i++;
	}

	return -1;
}

/**
 * Splits a class attribute value into classes, keeping Blade echos and
 * directive blocks together with the class they are part of.
 *
 * @returns The classes, or `undefined` if the value can not be split safely.
 */
function splitClasses(value: string): string[] | undefined {
	const classes: string[] = [];
	const openDirectives: string[] = [];
	let current = "";
	let i = 0;

	while (i < value.length) {
		if (/\s/.test(value[i]) && openDirectives.length === 0) {
			if (current) classes.push(current);
			current = "";
			i++;
			continue;
		}

		const enclosureEnd = skipBladeEnclosure(value, i);
		if (enclosureEnd !== undefined) {
			current += value.slice(i, enclosureEnd);
			i = enclosureEnd;
			continue;
		}

		const directive =
			current === "" || openDirectives.length > 0
				? matchDirective(value, i)
				: undefined;
		if (directive) {
			const { name, end } = directive;
			if (end === -1) return;

			if (
				name.startsWith("end") &&
				openDirectives[openDirectives.length - 1] === name.slice(3)
			) {
				openDirectives.pop();
			} else if (new RegExp(`@end${name}\\b`).test(value.slice(end))) {
				openDirectives.push(name);
			}

			current += value.slice(i, end);
			i = end;
			continue;
		}

		current += value[i];
		i++;
	}

	if (openDirectives.length > 0) return;
	if (current) classes.push(current);

	return classes;
}

/**
 * Matches a Blade directive and its arguments starting at `index`.
 *
 * @returns The directive name and the end of its arguments (-1 if they are
 * unbalanced), or `undefined` if no directive starts there.
 */
function matchDirective(
	text: string,
	index: number,
): { name: string; end: number } | undefined {
	directiveRegex.lastIndex = index;
	const directive = directiveRegex.exec(text);
	if (!directive) {
		return;
	}

	const name = directive[1];
	const end = directiveRegex.lastIndex;

	// Tailwind CSS container queries such as `@container`, `@md:flex` or `@container/main`
	if (name === "container" || /^[:\-/[]/.test(text[end] ?? "")) {
		return;
	}

	const argumentsStart = /^\s*\(/.exec(text.slice(end));
	if (!argumentsStart) {
		return { name, end };
	}

	return {
		name,
		end: skipParentheses(text, end + argumentsStart[0].length - 1),
	};
}
