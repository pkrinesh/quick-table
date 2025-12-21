import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles.css"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@tanstack/react-table", "tailwindcss"],
  treeshake: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  esbuildOptions(options) {
    options.alias = {
      "#": "./src",
    };
  },
});
