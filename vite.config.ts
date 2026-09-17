import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { configDefaults, defineConfig } from "vitest/config";

/*
 * `src/styles/fonts.css` loads the three shipped faces with `font-display: swap`, which keeps text
 * visible but only starts the download once the stylesheet has been parsed. Preloading starts it
 * with the stylesheet instead, so the swap lands before first paint rather than after it.
 *
 * The tags cannot live in `index.html`: Vite hashes the woff2 files, so their names exist only once
 * the bundle does. This reads them back out of the bundle and prepends one `<link rel="preload">`
 * per file. Build only — `vite dev` serves the fonts unhashed straight from the package.
 */
function preloadFonts(): Plugin {
  return {
    name: "preload-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, context) {
        return Object.keys(context.bundle ?? {})
          .filter((fileName) => fileName.endsWith(".woff2"))
          .sort()
          .map((fileName) => ({
            tag: "link",
            attrs: {
              rel: "preload",
              as: "font",
              type: "font/woff2",
              // `base` is '/', so the emitted asset path is already the served path.
              href: `/${fileName}`,
              crossorigin: "",
            },
            injectTo: "head-prepend" as const,
          }));
      },
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), preloadFonts()],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/support/setup.ts",
    // Vitest's 5 s default is below what the @testing-library/react cases in src/App.test.tsx need:
    // they render the whole application, and on a machine running other work in parallel a single
    // one exceeds 5 s while that file finishes in under 14 s when it runs alone. 30 s absorbs that
    // contention and still fails a genuinely hung test long before a CI job limit; hookTimeout gets
    // the same value because setup runs under the same contention.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // The printed-page geometry check needs a real browser; it runs under vitest.print.config.ts.
    exclude: [...configDefaults.exclude, "tests/print-geometry/**"],
  },
});
