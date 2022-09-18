import * as cmd from './support/cmd';
import path from 'path';
import fs from 'fs';

describe('CLI test', () => {
    const prettierBin = path.resolve('node_modules', '.bin', 'prettier');
    const prettierPluginArgs = ['--plugin', '.', '--plugin-search-dir', '.'];

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