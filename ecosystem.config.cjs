module.exports = {
  apps : [{
    name: "borderdle",
    script : "./server.js",
    env: {
      PORT: 800,
      NODE_ENV: "production"
    }
  }],

  deploy: {
    production: {
      user: "root",
      host: ["198.199.104.207"],
      ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/main",
      repo: "git@github.com:KingSkyrock/borderdle.git",
      path: "/var/www/borderdle",
      "post-deploy": "npm install; npm run build; pm2 startOrRestart ecosystem.config.js"
    }
  }
}
