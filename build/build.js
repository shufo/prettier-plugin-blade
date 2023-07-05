#!/usr/bin/env node

import esbuild from "esbuild";

// Automatically exclude all node_modules from the bundled version
import { nodeExternalsPlugin } from "esbuild-node-externals";

const isProduction = process.env.NODE_ENV === "production";
const isEsm = process.env.ESM_BUILD === "true";

const build = async () => {
    const context = await esbuild.context({
        entryPoints: ["./src/index.ts"],
        outfile: isEsm ? "dist/index.js" : "dist/index.cjs",
        bundle: true,
        minify: isProduction ?? false,
        platform: "node",
        sourcemap: true,
        target: "node14",
        format: isEsm ? "esm" : "cjs",
        external: ["./src/worker"],
        plugins: [
            nodeExternalsPlugin(),
            {
                name: "watch",
                setup(build) {
                    build.onEnd((result) => {
                        console.log("===========================================");
                        // error if errors array have errors
                        if (result.errors.length > 0) {
                            console.log(`${new Date().toLocaleString()}: main module build failed.`);
                            process.exit(1);
                        } else {
                            console.log(`${new Date().toLocaleString()}: main module build succeeded.`);
                        }
                    });
                },
            },
        ],
    });

    if (isProduction) {
        await context.rebuild();
        context.dispose();
    } else {
        await context.watch();
    }
};

build();
