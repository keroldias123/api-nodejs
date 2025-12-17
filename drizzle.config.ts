import { defineConfig } from "drizzle-kit";
import { env } from "env.ts";
if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  out: "./drizzle",
  schema: "./src/database/schema.ts",
});
