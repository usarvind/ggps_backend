const route = require('express').Router();
const {spawn} = require('child_process');
const exec = require('child_process').exec;
const path = require('path');
var fs = require('fs');
var _ = require('lodash');

const cron = require('node-cron');


 function stringToDate (dateString) {
    return new Date(dateString);
}
	
	/* return if variable is empty or not. */
 function empty(mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
        return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
        return false;
        }
        return true;
    }
    return false;
};



var dbOptions =  {
    user: 'gayatrigps',
    pass: 'gayatrigps9876',
    host: '172.31.9.128', //13.233.116.27
    port: 27017,
    database: 'school', //school
    autoBackup: true, 
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: path.join(__dirname,'../../../public/')
    };

   
 
    
    cron.schedule('1 1 */2 * * *', () => {
        backupMongoDB();

        console.log("every 2 hours")
    });

    function backupMongoDB(){
            console.log("dbOptions : ",dbOptions)
            if (dbOptions.autoBackup == true) {
            var date = new Date();
            var beforeDate, oldBackupDir, oldBackupPath;
            currentDate = stringToDate(date); // Current date
            var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir+"/"; // New backup path for current backup process
            // check for remove old backup after keeping # of days given in configuration
            if (dbOptions.removeOldBackup == true) {
                beforeDate = _.clone(currentDate);
                beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
                oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
                oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
            }
           //let cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath;
           
           let cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath;
           console.log(" cmd : "+cmd)

           exec(cmd, function (error, stdout, stderr) {

                console.log("asddasdasdsadds",error)
                console.log("stdout:\n",stdout)
                if (empty(error)) {
                    // check for remove old backup after keeping # of days given in configuration
                    if (dbOptions.removeOldBackup == true) {
                        if (fs.existsSync(oldBackupPath)) {
                            exec("rm -rf " + oldBackupPath, function (err) { });
                        }
                    }
                }
            });
            }
    }

//module.exports = route;
