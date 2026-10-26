import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.TMDB_READ_ACCESS_TOKEN;

  if (mode === "development" && !token) {
    throw new Error("Token do TMDB ausente. Configure TMDB_READ_ACCESS_TOKEN no arquivo .env.");
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/tmdb": {
          target: "https://api.themoviedb.org/3",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ""),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    },
  };
});
