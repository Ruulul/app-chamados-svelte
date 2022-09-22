import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      default: true,
    },
    trailingSlash: "always",
  },

  preprocess: [
    preprocess({
      postcss: true,
      pug: true,
    }),
  ],
};

export default config;
