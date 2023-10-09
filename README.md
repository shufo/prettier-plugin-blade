<div align="center">
<img alt="Prettier"
  src="https://raw.githubusercontent.com/prettier/prettier-logo/master/images/prettier-icon-light.png">
<img alt="PHP" height="180" hspace="25" vspace="15"
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/500px-Laravel.svg.png">
</div>

<h2 align="center">Prettier Blade Plugin</h2>
<p align="center">
  <a href="https://github.com/shufo/prettier-plugin-blade/actions">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/shufo/prettier-plugin-blade/node.yml?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@prettier/plugin-php">
    <img alt="npm version" src="https://img.shields.io/npm/v/@shufo/prettier-plugin-blade.svg?style=flat-square">
  </a>
</p>

Format your blade template using Prettier

## Features

- Automatically indent markup inside directives
- Automatically add spacing to blade template markers
- PHP 8 syntax support (null safe operator, named arguments)
- Compliant to PSR-2 coding standard (PHP code inside directives)
- Automatically sort Tailwind CSS classes with respect of `tailwind.config.js`

## Installation

```bash
$ npm install --save-dev @shufo/prettier-plugin-blade prettier

# yarn
$ yarn add -D @shufo/prettier-plugin-blade prettier

# pnpm
$ pnpm add -D @shufo/prettier-plugin-blade prettier
```

then, add in your [Prettier configuration](https://prettier.io/docs/en/configuration.html):

```json
{
  "plugins": ["@shufo/prettier-plugin-blade"],
  "overrides": [
    {
      "files": ["*.blade.php"],
      "options": {
        "parser": "blade",
        "tabWidth": 4
      }
    }
  ]
}
```

## Prettier version Compatibilitiy

| Prettier | Package |
| -------: | ------: |
|      3.x |  ^1.9.x |
|      2.x |   1.8.x |

## Usage (CLI)

```bash
$ ./node_modules/.bin/prettier --write resources/**/*.blade.php
```

https://user-images.githubusercontent.com/1641039/151354641-6305805e-8e0c-4226-8331-64195f85160e.mp4

## Example

### Input

```blade
@extends('frontend.layouts.app')
@section('title') foo
@endsection
@section('content')
<section id="content">
<div class="container mod-users-pd-h">
    <div class="pf-user-header">
    <div></div>
    <p>@lang('users.index')</p>
    </div>
        <div class="pf-users-branch">
            <ul class="pf-users-branch__list">
                @foreach($users as $user)
        <li>
            <img src="{{ asset('img/frontend/icon/branch-arrow.svg') }}" alt="branch_arrow">
            {{ link_to_route("frontend.users.user.show",$users["name"],$users['_id']) }}
        </li>
        @endforeach
      </ul>
      <div class="pf-users-branch__btn">
      @can('create', App\Models\User::class)
            {!! link_to_route("frontend.users.user.create",__('users.create'),[1,2,3],['class' => 'btn']) !!}
            @endcan
        </div>
  </div>
    </div>
</section>
@endsection
@section('footer')
@stop
```

### Output

```blade
@extends('frontend.layouts.app')
@section('title') foo
@endsection
@section('content')
    <section id="content">
        <div class="container mod-users-pd-h">
            <div class="pf-user-header">
                <div></div>
                <p>@lang('users.index')</p>
            </div>
            <div class="pf-users-branch">
                <ul class="pf-users-branch__list">
                    @foreach ($users as $user)
                        <li>
                            <img src="{{ asset('img/frontend/icon/branch-arrow.svg') }}" alt="branch_arrow">
                            {{ link_to_route('frontend.users.user.show', $users['name'], $users['_id']) }}
                        </li>
                    @endforeach
                </ul>
                <div class="pf-users-branch__btn">
                    @can('create', App\Models\User::class)
                        {!! link_to_route('frontend.users.user.create', __('users.create'), [1, 2, 3], ['class' => 'btn']) !!}
                    @endcan
                </div>
            </div>
        </div>
    </section>
@endsection
@section('footer')
@stop
```

## Options

You can use these options for prettier blade plugin in prettier CLI.

|                           key | description                                                                                                                                                                                                                                                                     |
| ----------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|                 `--tab-width` | Number of spaces per indentation level. default: `4`                                                                                                                                                                                                                            |
|               `--print-width` | The line length where Prettier will try wrap. default: `120`                                                                                                                                                                                                                    |
|           `--wrap-attributes` | The way to wrap attributes. [`auto`\|`force`\|`force-aligned`\|`force-expand-multiline`\|`aligned-multiple`\|`preserve`\|`preserve-aligned`]. default: `auto`                                                                                                                   |
| `--wrap-attributes-min-attrs` | Minimum number of html tag attributes for force wrap attribute options. Wrap the first attribute only if 'force-expand-multiline' is specified in wrap attributes. default: `2`.                                                                                                |
|         `--end-with-new-line` | End output with newline. default: `true`                                                                                                                                                                                                                                        |
|  `--sort-tailwindcss-classes` | Sort Tailwind CSS classes. It will automatically look for and respect `tailwind.config.js` if it exists. default: `false`                                                                                                                                                       |
|   `--tailwindcss-config-path` | Path to your custom Tailwind configuration file. This option is only available if `--sort-tailwindcss-classes` is present. default: `''`                                                                                                                                        |
|      `--sort-html-attributes` | Sort HTML Attributes in the specified order. [`none` \| `alphabetical` \| [`code-guide`](https://codeguide.co/) \| [`idiomatic`](https://github.com/necolas/idiomatic-html#attribute-order) \| [`vuejs`](https://eslint.vuejs.org/rules/attributes-order.html)] default: `none` |
|       `--no-php-syntax-check` | Disable PHP syntax checking. default: `false`                                                                                                                                                                                                                                   |
|              `--extra-liners` | Comma separated list of tags that should have an extra newline before them. default: `head,body,/html`                                                                                                                                                                          |
|        `--trailing-comma-php` | If set to false, no trailing commas are printed for php expression. default: `true`                                                                                                                                                                                             |

### `.prettierrc` example

```json
{
  "printWidth": 120,
  "tabWidth": 4,
  "wrapAttributes": "auto",
  "wrapAttributesMinAttrs": 2,
  "sortTailwindcssClasses": true,
  "sortHtmlAttributes": "none",
  "noPhpSyntaxCheck": false,
  "indentInnerHtml": true,
  "extraLiners": "",
  "trailingCommaPHP": true
}
```

## Disabling format in file

To disable formatting in your file, you can use blade/html comments in the following format:

```blade
{{-- prettier-ignore-start --}}
    {{ $foo }}
    {{ $bar }}
{{-- prettier-ignore-end --}}

or

<!-- prettier-ignore-start -->
    {{ $foo }}
    {{ $bar }}
<!-- prettier-ignore-end -->
```

To disable formatting on a specific line, you can use comment in the following format:

```blade
{{-- prettier-ignore --}}
    {{ $foo }}

or

<!-- prettier-ignore -->
    {{ $foo }}
```

## Editor Integration

The editors below are confirmed to work with this plugin.

### VSCode

You can use [Prettier extension for VSCode](https://github.com/prettier/prettier-vscode) to format blade in VSCode. You need to install this plugin as a local dependency. see https://github.com/prettier/prettier-vscode#prettier-resolution

If you want to use a formatter without Prettier, please consider to use the [vscode-blade-formatter](https://github.com/shufo/vscode-blade-formatter) instead.

### Vim

You can use [coc-prettier](https://github.com/neoclide/coc-prettier) plugin on [coc.nvim](https://github.com/neoclide/coc.nvim)

If you want to use formater without Prettier, please consider to using [coc-blade](https://github.com/yaegassy/coc-blade)

### JetBrains WebStorm, PHPStorm, PyCharm...

You can use the [Prettier Plugin](https://plugins.jetbrains.com/plugin/10456-prettier) for JetBrains IDE.

Add extension setting `blade.php` to `File | Settings | Languages & Frameworks | JavaScript | Prettier | Run for files`:

e.g.

`{**/*,*}.{js,ts,jsx,tsx,blade.php}`

and turn on checkbox `On 'Reformat Code' action`

Restart your IDE if you get the error: 'Prettier: File \*.php has unsupported type'

## Limitation

This plugin is based on [blade-formatter](https://github.com/shufo/blade-formatter) which does not generate ASTs with lexer, so it might break indentation on complex blade.

Like:

- The mix of open/closed HTML tag and directives

❌ Example of **unexpected** code

```blade
@if ($user)
    <div>
    @else
    </div>
@endif
```

⭕ Example of **expected** code

```blade
@if ($user)
    <div>foo</div>
@else
    <div>bar</div>
@endif
```

Please keep the blade template as simple as possible for better formatting.

## API

You can format the blade file programmatically using Prettier's API

```js
// CommonJS
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

const res = await prettier.format(input, { parser: "blade" });
console.log(res);
// =>
//<div>
//    @if ($user)
//        {{ $foo }}
//    @else
//        {{ $bar }}
//    @endif
//</div>

// ES Module
import * as prettier from "prettier";

const input = `
<div>
  @if ($user)
  {{ $foo }}
  @else
  {{ $bar }}
  @endif
</div>
`;
const res = await prettier.format(input, { parser: "blade" });
console.log(res);
```

## Development

```bash
$ yarn install
$ yarn run watch # watch changes
```

## Testing

```bash
$ yarn install
$ yarn run test
```

## Contributing

1.  Fork it
2.  Create your feature branch (`git checkout -b my-new-feature`)
3.  Commit your changes (`git commit -am 'Add some feature'`)
4.  Push to the branch (`git push origin my-new-feature`)
5.  Create new Pull Request

## Contributors

<!-- readme: collaborators,contributors -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/shufo">
            <img src="https://avatars.githubusercontent.com/u/1641039?v=4" width="100;" alt="shufo"/>
            <br />
            <sub><b>Shuhei Hayashibara</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/howdu">
            <img src="https://avatars.githubusercontent.com/u/533658?v=4" width="100;" alt="howdu"/>
            <br />
            <sub><b>Beej</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/ianjamieson">
            <img src="https://avatars.githubusercontent.com/u/2786904?v=4" width="100;" alt="ianjamieson"/>
            <br />
            <sub><b>Ian Jamieson</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/mortenscheel">
            <img src="https://avatars.githubusercontent.com/u/6514342?v=4" width="100;" alt="mortenscheel"/>
            <br />
            <sub><b>Morten Scheel</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/nessimabadi">
            <img src="https://avatars.githubusercontent.com/u/11637110?v=4" width="100;" alt="nessimabadi"/>
            <br />
            <sub><b>Nessim Abadi</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/vuolter">
            <img src="https://avatars.githubusercontent.com/u/1221092?v=4" width="100;" alt="vuolter"/>
            <br />
            <sub><b>Walter Purcaro</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators,contributors -end -->

## LICENSE

MIT
