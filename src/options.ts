export const defaultOptions = {
  tabWidth: 4,
  printWidth: 120,
  singleQuote: true,
};

export const options = {
  wrapAttributes: {
    type: "string",
    category: "Blade",
    default: "auto",
    description:
      "The way to wrap attributes. [auto|force|force-aligned|force-expand-multiline|aligned-multiple|preserve|preserve-aligned]",
    since: "1.0.0",
  },
  wrapAttributesMinAttrs: {
    type: "int",
    category: "Blade",
    default: 2,
    description:
      "Minimum number of html tag attributes for force wrap attribute options. Wrap the first attribute only if 'force-expand-multiline' is specified in wrap attributes",
    since: "1.11.0",
  },
  endWithNewLine: {
    type: "boolean",
    category: "Blade",
    default: true,
    description: "End output with newline.",
    since: "1.0.0",
  },
  sortTailwindcssClasses: {
    type: "boolean",
    category: "Blade",
    default: false,
    description: "Sort Tailwindcss classes automatically. This option respects `tailwind.config.js`.",
    since: "1.0.0",
  },
  tailwindcssConfigPath: {
    type: "string",
    category: "Blade",
    default: '',
    description: "Path to custom Tailwindcss config. This option is available only when `sortTailwindcssClasses` is present.",
    since: "1.5.7",
  },
  sortHtmlAttributes: {
    type: "string",
    category: "Blade",
    default: "none",
    description: "Sort HTML Attributes. [none|alphabetical|code-guide|idiomatic|vuejs|custom]",
    since: "1.5.0",
  },
  customHtmlAttributesOrder: {
    type: "string",
    category: "Blade",
    default: "",
    description: "Comma separated custom HTML attributes order. e.g. \"id, aria-.+, class, src\". To enable this you must specify sort html attributes option as `custom`. You can use regex for attribute names.",
    since: "1.8.0",
  },
  noPhpSyntaxCheck: {
    type: "boolean",
    category: "Blade",
    default: false,
    description: "Disable PHP syntax checking",
    since: "1.7.0",
  },
  indentInnerHtml: {
    type: "boolean",
    category: "Blade",
    default: false,
    description: "Indent <head> and <body> sections in html",
    since: "1.10.0",
  },
  extraLiners: {
    type: "string",
    category: "Blade",
    default: "head,body,/html",
    description: "Comma separated list of tags that should have an extra newline before them.",
    since: "1.10.0",
  },
};

