const path = require('path');

module.exports = {
  mode:'development',
  entry: './public/AdminPortal/assets/js/comman.js',
  output: {
    filename: 'array.js',
   
    path: path.resolve(__dirname, 'dist'),
  },
};