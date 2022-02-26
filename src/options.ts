export const defaultOptions = {
  tabWidth: 4,
  printWidth: 120,
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
};

