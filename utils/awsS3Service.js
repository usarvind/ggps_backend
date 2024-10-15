// Load the SDK for JavaScript
'use strict'
const AWS = require('aws-sdk');
const path = require("path");
const appConfig = require("../../app-config");
// AWS.config.update(appConfig.s3Auth);
AWS.config = new AWS.Config();
AWS.config.accessKeyId = appConfig.awsS3Config.accessKeyId;
AWS.config.secretAccessKey = appConfig.awsS3Config.secretAccessKey;
AWS.config.region = appConfig.awsS3Config.region;
AWS.config.update({
    accessKeyId: appConfig.awsS3Config.accessKeyId,
    secretAccessKey: appConfig.awsS3Config.secretAccessKey,
    region: appConfig.awsS3Config.region
});
var s3 = new AWS.S3({ apiVersion: appConfig.awsS3Config.version });
module.exports = class awsS3Service {
    async putObject(key, body, cb){
        key = path.join(appConfig.client.clientName, appConfig.client.clientFunction,
            appConfig.client.clientEnvironment, key);
        var s3 = new AWS.S3();
        s3.putObject({
            Bucket: appConfig.awsS3Config.bucket,
            Key: key,
            Body: body
        }, function (err, data) {
            if (err) {
                //console.log("Put Object: ", err);
                cb(null, []);
            } else {
                //console.log("Successfully uploaded data to Bucket", data);
                cb(null, data);
            }
        });
    }

    //To upload data on s3 bucket
    async upload (key, body, cb) {
        key = path.join(appConfig.client.clientName, appConfig.client.clientFunction,
            appConfig.client.clientEnvironment, key);

        // //const s3 = new AWS.S3();
		AWS.config.update({
			accessKeyId: appConfig.awsS3Config.accessKeyId,
			secretAccessKey: appConfig.awsS3Config.secretAccessKey,
			region: appConfig.awsS3Config.region
		});
        s3.upload({
            Bucket: appConfig.awsS3Config.bucket,
            Key: key,
            Body: body.data,
            ContentType: body.mimetype,
            ContentEncoding: body.encoding,
            ACL: 'public-read'
        }, function (err, data) {
            if (err) {
                //console.log("upload Object: ", err);
                cb(err);
            } else {
                //console.log("Successfully uploaded data to Bucket", data);
                // s3.getSignedUrl(key, function (e, r) {
                //     //console.log(e, r)
                // });
                cb(null, data);
            }
        });
    }
    // //To download data from s3 bucket
    async getObject(key, cb) {
        // key = path.join(appConfig.client.clientName, appConfig.client.clientFunction, appConfig.client.clientEnvironment, key);
        //console.log(key);
        //const s3 = new AWS.S3();
        s3.getObject({
            Bucket: appConfig.awsS3Config.bucket,
            Key: key
        }, function (e, data) {
            if (e) {
                //console.log("Error ", e);
                cb(e);
            } else {
                cb(null, data);
                //console.log("Data ", data.Body.toString());
                // AcceptRanges: 'bytes'
                // Body: Buffer(1518) [137,, …]
                // ContentEncoding: '7bit'
                // ContentLength: 1518
                // ContentType: 'image/png'
                // ETag: '"490115ea0e17851b8d3ea9d757783eff"'
                // LastModified: Mon Jan 11 2021 10:40:15 GMT+0530 (India Standard Time)
                // Metadata: {}
            }
        });
    }
    // //To get signed url from s3 bucket
    async getSignedUrl (key, cb) {
        key = path.join(appConfig.client.clientName, appConfig.client.clientFunction, appConfig.client.clientEnvironment, key);
        //console.log(key);
        //const s3 = new AWS.S3();
        s3.getSignedUrl('getObject', {
            Bucket: appConfig.awsS3Config.bucket,
            Key: key
        }, function (e, data) { //,ResponseContentType :"video/mp4"
            if (e) {
                //console.log("Error ", e);
                cb(null, "");
            } else {
                //console.log("Data ", data);
                cb(null, data);
            }
        });
    }
    async listObject (cb) {
        //Call to s3 bucket to list objects
        //const s3 = new AWS.S3();
        s3.listObjects({
            Bucket: appConfig.awsS3Config.bucket
        }, function (err, data) {
            if (err) {
                //console.log("List Objects: ", err);
                cb(null, []);
            } else {
                //console.log("List Objects", data);
                cb(null, data);
            }
        });
    }
    //To delete data from s3 bucket
    async deleteObject (key, cb) {
        key = path.join(appConfig.client.clientName, appConfig.client.clientFunction, appConfig.client.clientEnvironment, key);
        //console.log(key);
        //const s3 = new AWS.S3();
        s3.deleteObject({
            Bucket: appConfig.awsS3Config.bucket,
            Key: key
        }, function (err, data) {
            if (err) {
                //console.log(err, err.stack); // an error occurred
                cb(null, []);
            } else {
                //console.log("Data ", data);
                cb(null, data);
            }
        });
    }
    //to check Object Exists
    async checkS3Object (key, cb) {
        key = path.join(appConfig.client.clientName, appConfig.client.clientFunction, appConfig.client.clientEnvironment, key);
        //console.log(key);
        //const s3 = new AWS.S3();
		AWS.config.update({
			accessKeyId: appConfig.awsS3Config.accessKeyId,
			secretAccessKey: appConfig.awsS3Config.secretAccessKey,
			region: appConfig.awsS3Config.region
		});
        s3.waitFor('objectExists', {
            Bucket: appConfig.awsS3Config.bucket,
            Key: key
        }, function (err, data) {
            if (err) {
                //console.log(err, err.stack); // an error occurred
                cb(null, []);
            } else {
                //console.log(data); // successful response
                cb(null, data);
            }
        });
    }
};
