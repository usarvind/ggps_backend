module.exports = {
  apps: [
    {
      name: "Main",
      script: "./bin/www",
      env_production: {
        NODE_ENV: "development",
      },
      error_file: '../pm2/Main_err.log',
      out_file: '../pm2/Main_out.log',
      time: true,
      merge_logs: true
    },
     {
      name: "Main_AdminManagement",
      env_production: {
        NODE_ENV: "development",
      },
      script: "./microservicesList/adminMicroservice/bin/www",
      error_file: '../pm2/Main_AdminManagement_err.log',
      out_file: '../pm2/Main_AdminManagement_out.log',
    }
    
  ]
}