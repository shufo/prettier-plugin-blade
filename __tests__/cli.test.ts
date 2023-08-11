import * as cmd from './support/cmd';
import path from 'path';
import fs from 'fs';
import { name as packageName } from '../package.json';

describe('CLI test', () => {
    const prettierBin = path.resolve('node_modules', '.bin', 'prettier');
    const prettierPluginArgs = ['--plugin', packageName];

    const targets = [
        {
            name: 'basic',
            fromDir: path.resolve('__tests__', 'fixtures'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'formatted'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with tailwind config path option',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'tailwind'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'tailwind'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with tailwind config (ESM) and path option',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'tailwind_esmodule'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'tailwind_esmodule'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with tailwind config path exists above given path',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'tailwind', 'subdirectory'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'tailwind'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with no php syntax check option',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'noPhpSyntaxCheck'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'noPhpSyntaxCheck'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with custom html attributes order option',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'customHtmlAttributesOrder'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'customHtmlAttributesOrder'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with single quote option',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'singleQuote'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'singleQuote'),
            to: 'formatted.index.blade.php',
        },
        {
            name: '.prettierrc.json with wrap attributes min attrs option',
            fromDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'wrapAttributesMinAttrs'),
            from: 'index.blade.php',
            toDir: path.resolve('__tests__', 'fixtures', 'runtimeConfig', 'wrapAttributesMinAttrs'),
            to: 'formatted.index.blade.php',
        },
    ];

    targets.forEach(target => {
        test.concurrent(`${target.name} test`, async function () {
            const args = [
                ...prettierPluginArgs,
                path.resolve(target.fromDir, target.from),
            ];

            const result = await cmd.execute(prettierBin, args);

            const formatted = fs.readFileSync(
                path.resolve(target.toDir, target.to),
            );

            expect(result).toEqual(formatted.toString('utf-8'));
        });
    });
});
