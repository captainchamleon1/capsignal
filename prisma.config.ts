import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Fallback lets `prisma generate` run on Vercel before env vars are injected at runtime.
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
