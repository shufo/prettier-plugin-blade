# prettier-plugin-blade

Format your blade template using Prettier

## Features

- Automatically Indents markup inside directives
- Automatically add spacing to blade templating markers
- PHP 8 syntax support (null safe operator, named arguments)
- Compliant to PSR-2 coding standard (PHP code inside directives)

## Installation

```bash
$ npm install --save-dev @shufo/prettier-plugin-blade prettier
# yarn
$ yarn add -D @shufo/prettier-plugin-blade prettier
```

## Usage (CLI)

```bash
$ ./node_modules/.bin/prettier --write resources/**/*.blade.php
```

## Options

You can use these options for prettier blade plugin in prettier CLI.

|                   key |                                                                                                                                                   description |
| --------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|         `--tab-width` |                                                                                                          Number of spaces per indentation level. default: `4` |
|       `--print-width` |                                                                                                  The line length where Prettier will try wrap. default: `120` |
|   `--wrap-attributes` | The way to wrap attributes. [`auto`\|`force`\|`force-aligned`\|`force-expand-multiline`\|`aligned-multiple`\|`preserve`\|`preserve-aligned`]. default: `auto` |
| `--end-with-new-line` |                                                                                                                      End output with newline. default: `true` |

### `.prettierrc` example

```json
{
  "printWidth": 120,
  "tabWidth": 4,
  "wrapAttributes": "auto"
}
```

## LICENSE

MIT
