/**
 * PM2: multivendor Next storefront
 *
 * Install: npm i -g pm2
 * From this repo (multivendor-storefront/):
 *   yarn build
 *   Point .env / .env.production at your API (NEXT_PUBLIC_API_URL, BACKEND_URL, etc.)
 *   pm2 start pm2/ecosystem.config.cjs
 *   pm2 logs storefront-mv
 *
 * Default PORT=3002 if nothing else is set; change for your host or put PORT in .env.
 * Stale Windows yarn errors in PM2 log files: `pm2 flush` (see BS-Commerce pm2 config).
 */
const path = require("node:path");

const cwd = path.join(__dirname, "..");
const nextCli = path.join(cwd, "node_modules", "next", "dist", "bin", "next");

module.exports = {
  apps: [
    {
      name: "storefront-mv",
      cwd,
      script: nextCli,
      interpreter: "node",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3002",
      },
    },
  ],
};
