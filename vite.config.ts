import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(() => {
  return {
    plugins: [
      // visualizer({ open: true }), 
      react(), expressPlugin(),],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0];
            }
          },
        },
      },
      outDir: "dist/client",
    },
    server: {
      host: true,
    },
  };
});

function expressPlugin(): PluginOption {
  return {
    name: " vite:express",
    apply: "serve",

    async configureServer(viteServer) {
      const serverPath = path.resolve(import.meta.dirname, "./server/index.ts");

      const { createServer } = await viteServer.ssrLoadModule(serverPath);
      const app = await createServer();

      viteServer.middlewares.use(app);

      console.log("✅ Express API mounted at /api");
    },
  };
}