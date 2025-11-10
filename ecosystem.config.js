module.exports = {
  apps: [
    {
      name: "clientApp-frontend-app",
      cwd: "/var/www/clientApp/clientApp", // must have absolute path
      script: "npm",
      args: "prod:ssr",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
