module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "./.next/standalone/server.js",
      cwd: "/home/deploy/apps/gerenciamento_patio",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
