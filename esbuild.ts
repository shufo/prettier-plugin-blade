#!/usr/bin/env node

const esbuild = require("esbuild");

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require("esbuild-node-externals");

if (process.env.NODE_ENV === "production") {
  esbuild
    .build({
      entryPoints: ["./src/index.ts"],
      outfile: "dist/index.js",
      bundle: true,
      minify: true,
      platform: "node",
      sourcemap: true,
      target: "node14",
      external: ["./src/worker"],
      plugins: [nodeExternalsPlugin()],
    })
    .then(() => {
      console.log("===========================================");
      console.log(`${new Date().toLocaleString()}: build succeeded.`);
    })
    .catch(() => process.exit(1));

  return;
}

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    platform: "node",
    sourcemap: true,
    target: "node14",
    plugins: [nodeExternalsPlugin()],
    external: ["./src/worker"],
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  })
  .then(() => {
    console.log("===========================================");
    console.log(`${new Date().toLocaleString()}: watching...`);
  })
  .catch(() => process.exit(1));
