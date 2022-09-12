import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit()],
    resolve: {
        alias: {
            'utils': '$lib/utils/utils.js'
        }
    },
    server: {
        port: 4127,
        hmr: {
            host: "hmr.localhost",
            protocol: "wss",
            clientPort: 3000,
        }
    },
    preview: {
        port: 4127
    }
};

export default config;