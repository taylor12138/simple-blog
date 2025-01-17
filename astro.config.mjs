import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import solidJs from "@astrojs/solid-js";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Katex plugin options
        },
      ],
    ],
  },

  image: {
    service: passthroughImageService(),
  },
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  site: "https://blog.plr.moe",
  integrations: [
    mdx(),
    sitemap(),
    solidJs({
        include: ['**/solid/*', '**/node_modules/solid-icons/**'],
    }),
    react({
        include: ['**/react/*', '**/node_modules/p5-react-component/**'],
    }),
  ],
});
