import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit()],
    server: {
        port: 4127,
        hmr: {
            host: "hmr.localhost",
            protocol: "wss",
            clientPort: 3000,
        }
    },
};

export default config;