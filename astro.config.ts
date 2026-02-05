import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: {
      enabled: true,
      configPath: "wrangler.jsonc",
      persist: { path: "./.wrangler/state/v3" }
    },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "./src"
      }
    }
  },
  // Type-safe environment variables
  env: {
    schema: {
      OPENAI_API_KEY: envField.string({
        context: "server",
        access: "secret"
      })
    }
  }
});
