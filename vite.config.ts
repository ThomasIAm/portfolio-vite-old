import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { execSync } from "child_process";
import type { Plugin } from "vite";

function contentfulPlugin(): Plugin {
  return {
    name: "vite-contentful-plugin",

    // Run fetch before build starts
    buildStart() {
      console.log("📡 Fetching content from Contentful...");
      try {
        execSync("node scripts/fetch-content.mjs", {
          stdio: "inherit",
          env: process.env,
        });
      } catch (error) {
        console.error("❌ Failed to fetch content:", error);
        throw error;
      }
    },

    // Refresh content on every page load in development
    configureServer(server) {
      const fetchContent = () => {
        try {
          execSync("node scripts/fetch-content.mjs", {
            stdio: "pipe",
            env: process.env,
          });
          console.log("🔄 Content refreshed");
        } catch (error) {
          console.error("❌ Content refresh failed");
        }
      };

      // Initial fetch
      fetchContent();

      // Refresh on HTML requests (page loads/refreshes)
      server.middlewares.use((req, _res, next) => {
        if (req.headers.accept?.includes("text/html")) {
          fetchContent();
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8788",
        changeOrigin: true,
      },
      "/og": {
        target: "http://localhost:8788",
        changeOrigin: true,
      },
      "/sitemap.xml": {
        target: "http://localhost:8788",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  plugins: [
    contentfulPlugin(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_CF_PAGES_URL": JSON.stringify(
      process.env.CF_PAGES_URL || "",
    ),
  },
}));
