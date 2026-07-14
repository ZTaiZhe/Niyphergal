import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => ({
  test: {
    fileParallelism: false,
  },
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        bindings: {
          BOOTSTRAP_INVITE: "test-bootstrap-invite",
          PBKDF2_ITERATIONS: "1000",
          TEST_MIGRATIONS: await readD1Migrations("./migrations"),
        },
      },
    }),
  ],
}));
