import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using dummy value for development");
  process.env.DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/dummy";
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
