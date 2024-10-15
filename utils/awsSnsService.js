const AWS = require('aws-sdk');
const SMSModel = require('../model/smsLogsModel')
const path = require('path');
const envPath = path.join(__dirname, '../../.env')
const dotenv =require('dotenv');
const result = dotenv.config({ path: envPath });
const EmailLog = require('../model/EmailLogsModel')
const constants = require('../utils/constants');

var nodemailerPackage = require("nodemailer");
var sesTransport = require("nodemailer-ses-transport");
var nodemailer = nodemailerPackage.createTransport(sesTransport(constants.awsSesConfig));


module.exports = {
    sendMsg: async function (message) {
        return new Promise((resolve, reject) => {
            //OLD CODE  process.env.config
            AWS.config.update(constants.config);
            const sns = new AWS.SNS();
            var SNS_TOPIC_ARN = constants.config.arn;
            var MobNo = message.phoneNumber;
            if (MobNo.length === 10) {
                MobNo = '+91' + MobNo
            };

            sns.subscribe({
                Protocol: 'sms',
                TopicArn: SNS_TOPIC_ARN,
                Endpoint: MobNo,
            }, function (error, data) {
                if (error || !data || data == null) {
                    //console.log("error when subscribe", error);
                    reject(error || "Can't send SMS.");
                }
                else {
                    //console.log("subscribe data", data);
                    var SubscriptionArn = data.SubscriptionArn;
                    var params = {
                        TargetArn: SNS_TOPIC_ARN,
                        Message: message.message + `\n\nRegards,\nApollo Tyres Limited.`
                    };
                    //console.log("REQUEST :", params);
                    //publish a message.
                    sns.publish(params, function (err_publish, data) {
                        let smsData = {
                            mobileNumber: message.phoneNumber,
                            message: message.message,
                            // RequestId:data.RequestId ,

                        };
                        if (err_publish) {
                            smsData.MessageRes = err_publish;
                            smsData.SucessFlag = "error";
                        } else {
                            smsData.MessageRes = data;
                            smsData.SucessFlag = "Success";
                        }
                        //unsubscribing the topic
                        var params = {
                            SubscriptionArn: SubscriptionArn
                        };
                        sns.unsubscribe(params, function (err, res) {
                            if (err) {
                                //console.log("err when unsubscribe : ", err);
                                smsData.unsubscribeMessageErr = err;
                                smsData.unsubscribeSucessFlag = "Error Unsubscribe";
                            } else {
                                smsData.unsubscribeMessageRes = res;
                                smsData.unsubscribeSucessFlag = "Successfully Unsubscribe";
                            }
                            insertLog(smsData, function (err, result) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(res);
                                }
                            })
                        });
                    });
                }
            });
        });
    },
    sendEmail: async function (input) {
        console.log(input)
        return new Promise((resolve, reject) => {
            let email = {
                from: input.from,// sender address
                to: input.emailID, // list of receivers
                subject: input.subject, // Subject line
                html: input.body,
                cc: input.emailCC
            }
            // input.OTP = Token.OTP6digit()           
            nodemailer.sendMail(email, function (e, r) {
                console.log("sending mail err, res ------------ ", e, r)
                if (e) {
                    let emaillogs = new EmailLog();
                    emaillogs.ServiceResponse = email.e
                    emaillogs.EmailTo = email.to
                    emaillogs.EmailCC = email.cc
                    emaillogs.EmailBody = email.html
                    emaillogs.EmailSubject = email.subject
                    emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
                    emaillogs.SucessFlag = "Error"
                    emaillogs.save(function (err, res) {
                        if (err) {
                            reject(e);
                        } else {
                            reject(e);
                        }
                    })
                    reject(e);
                } else {
                    let emaillogs = new EmailLog();
                    emaillogs.ServiceResponse = email.r
                    emaillogs.EmailTo = email.to
                    emaillogs.EmailCC = email.cc
                    emaillogs.EmailBody = email.html
                    emaillogs.EmailSubject = email.subject
                    emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
                    emaillogs.SucessFlag = "success"
                    emaillogs.save(function (err, res) {
                        if (err) {
                            reject("success")
                        } else {
                            resolve("success")
                        }
                    })

                }
            });
        })
    }
};
function insertLog(data, cb) {
    let sms = new SMSModel(data)
    sms.save(function (err, result) {
        if (err) {

            cb(err)
        } else {
            cb(null, data)
        }

    })
}
