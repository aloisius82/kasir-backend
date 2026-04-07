module.exports = {
  apps: [
    {
      name: 'kasir',
      script: 'dist/main.js',
      exec_mode: 'cluster',      // cluster mode (multi core)
      instances: '2',          // pakai semua core
      watch: false,              // jangan watch di production
      autorestart: true,

      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
