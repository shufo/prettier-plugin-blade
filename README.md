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

## Limitation

This plugin does not generate ASTs with lexer, so it might not be able to format complex blade properly.

Like:

- The mix of open/closed HTML tag and directives

❌ Example of **unformattable** code

```blade
@if ($user)
  <div>
@else
  </div>
@endif
```

⭕ Example of **formattable** code

```blade
@if ($user)
  <div>foo</div>
@else
  <div>bar</div>
@endif
```

- Multiline expression

blade-formatter is line based formatter so multiline expression often causes unexpected behaviour.

❌ Example of **unformattable** code

```blade
<div>
    @php
    $myvar = "lorem
       ipsum";
    @endphp
</div>
```

⭕ Example of **formattable** code

```blade
<div>
    @php
    $myvar = "lorem\nipsum";
    @endphp
</div>
```

- Deeply nested expression

❌ Example of **unformattable** code

```blade
{{ asset(auth()->user()->getUserMedia('first', 'second')) }}
```

⭕ Example of **formattable** code

```php
# controller
return view('foo', ['media' => auth()->user()->getUserMedia('first', 'second')]);

# view
{{ asset($media) }}
```

Please make blade template as simple as possible for better formatting.

## API

You can format blade text programmatically using prettier

```js
const prettier = require("prettier");

const input = `
<div>
  @if ($user)
  {{ $foo }}
  @else
  {{ $bar }}
  @endif
</div>
`;

const res = prettier.format(input, { parser: "blade" });
console.log(res);
// =>
//<div>
//    @if ($user)
//        {{ $foo }}
//    @else
//        {{ $bar }}
//    @endif
//</div>
```

## Contributing

1.  Fork it
2.  Create your feature branch (`git checkout -b my-new-feature`)
3.  Commit your changes (`git commit -am 'Add some feature'`)
4.  Push to the branch (`git push origin my-new-feature`)
5.  Create new Pull Request

## LICENSE

MIT
