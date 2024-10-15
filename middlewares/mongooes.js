const mongoose = require('mongoose')
const path = require('path');
const envPath = path.join(__dirname, '../.env')
const dotenv = require('dotenv');
const result = dotenv.config({ path: envPath });

if (result.error) {
  throw result.error;
};
var mainDb = process.env.mainDb;
console.log(mainDb)
module.exports = {
  commonDb: mongoose.createConnection(mainDb, {
    useNewUrlParser: true
  }, function (err, connections) {
    if (err) {
      console.log("arvind : ",err)
      console.log(err)
      process.exit(0)
    } else {
      console.log("School commonDb " + mainDb + "  connected successfully");
      return connections;
    }
  }),
}