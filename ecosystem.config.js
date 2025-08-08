module.exports = {
  apps: [{
    name: 'huntier-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/huntier-app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/huntier-error.log',
    out_file: '/var/log/pm2/huntier-out.log',
    log_file: '/var/log/pm2/huntier-combined.log'
  }]
};