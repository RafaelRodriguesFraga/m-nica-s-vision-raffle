import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      host: "127.0.0.1",
      port: 8080,
    },
  },
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});