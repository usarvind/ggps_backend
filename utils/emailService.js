// const path = require('path');
// const EmailLog = require('../model/EmailLogsModel')
// var nodemailerPackage = require("nodemailer");
// var sesTransport = require("nodemailer-ses-transport");
// require('dotenv').config();
// const constants = require('./constants');
// var nodemailer = nodemailerPackage.createTransport(sesTransport(constants.awsSesConfig));
// var EmailTemplates = require('swig-email-templates');

// const emailService = {
//     sendEmail: function (input, cb) {
//         const email = {
//             from: process.env.smtp.from, // sender address
//             to: input.ToemailID, // list of receivers
//             cc: input.CcemailID,
//             bcc: input.BccemailID,
//             subject: input.subject, // Subject line
//             html: input.body + "<br><br><h5>Note: This is a system generated Email, Please do not send a reply to this Email.<br>Regards,<br>Apollo Tyres Limited</h5>",
//             attachments: input.attachments
//         };
//         nodemailer.sendMail(email, function (e, r) {
//             if (e) {
//                 let emaillogs = new EmailLog();
//                 emaillogs.ServiceResponse = email.e
//                 emaillogs.EmailTo = email.to
//                 emaillogs.EmailCC = email.cc
//                 emaillogs.EmailBody = email.html
//                 emaillogs.EmailSubject = email.subject
//                 emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
//                 emaillogs.SucessFlag = "Error"
//                 emaillogs.save(function (err, res) {
//                     if (err) {
//                         cb(e)
//                     } else {
//                         cb(e)
//                     }
//                 })
//             } else {
//                 let emaillogs = new EmailLog();
//                 emaillogs.ServiceResponse = email.r
//                 emaillogs.EmailTo = email.to
//                 emaillogs.EmailCC = email.cc
//                 emaillogs.EmailBody = email.html
//                 emaillogs.EmailSubject = email.subject
//                 emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
//                 emaillogs.SucessFlag = "success"
//                 emaillogs.save(function (err, res) {
//                     if (err) {
//                         cb(err)
//                     } else {
//                         cb(null, r);
//                     }
//                 })
//             }
//         });
//     },

//     sendEmailByTemplate: function (input, cb) {
//         console.log('input', input);
//         var templateDir = path.join(__dirname, "../lib/templates", input.template);
//         var templates = new EmailTemplates({ root: path.join(__dirname, '../') });
//         templates.render(templateDir, input.templateInput, function (err, html, text, subject) {
//             if (err) {
//                 // emaillogs.ServiceResponse = email.e
//                 // emaillogs.EmailTo = email.to
//                 // emaillogs.EmailCC = email.cc
//                 // emaillogs.EmailBody = email.html
//                 // emaillogs.EmailSubject = email.subject
//                 // emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
//                 // emaillogs.SucessFlag = "Error"
//                 console.log(err)
//                 cb(err)
//                 //console.log("html: ",err, html, text, subject)
//             } else {
//                 const email = {
//                     from: constants.smtp.from,
//                     to: input.toEmailId,
//                     cc: input.ccEmailId || [],
//                     bcc: input.bccEmailId || [],
//                     subject: input.subject,
//                     html: html,
//                 };
//                 // Send email
//                 nodemailer.sendMail(email, function (e, r) {
//                     if (e) {
//                         // emaillogs.ServiceResponse = email.e
//                         // emaillogs.EmailTo = email.to
//                         // emaillogs.EmailCC = email.cc
//                         // emaillogs.EmailBody = email.html
//                         // emaillogs.EmailSubject = email.subject
//                         // emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
//                         // emaillogs.SucessFlag = "Error"
//                         console.log(e)
//                     } else {
//                         // emaillogs.ServiceResponse = email.r
//                         // emaillogs.EmailTo = email.to
//                         // emaillogs.EmailCC = email.cc
//                         // emaillogs.EmailBody = email.html
//                         // emaillogs.EmailSubject = email.subject
//                         // emaillogs.EmailAttatchment = email.attachments && email.attachments[0] && email.attachments[0].href || ""
//                         // emaillogs.SucessFlag = "success"
//                     }
//                     // emaillogs.save(function (err, res) {
//                     //     if (err) {
//                     //         cb(err)
//                     //     } else {
//                     cb(e, r);
//                     //     }
//                     // })
//                 });
//             }
//         });
//     }
// };

// module.exports = emailService;