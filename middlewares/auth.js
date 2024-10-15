// var jwt = require('jsonwebtoken');
// var db = require("../middlewares/mongooes");
// //const LoginHistoryModel = require('../model/loginHistoryModel');
// const { JwtSecret } = require('../utils/constants');
// const commonResponse = require('../utils/commonResponse');
// module.exports = (req, res, next) => {
//     /* if not request header then it will return to the index page */
//     if (!req) {
//         return next("Not Found!");
//     } else {
//         const token = req.headers['authorization']; // Token found in headers
//         try {
//             if (!token) {
//                 next('Your req is not valid. Please try again!.'); //res.json({success: false, message: 'Your id is not valid. Please try again!.'});
//             } else {
//                 // here getting the token from request header and decrypte and check is valid or not using jwt
//                 let secret = "newarchapikey"
//                 if (req.headers['sourceapp'] === 'crmapp') {
//                     secret = JwtSecret.crmJwtSecret || secret;
//                 } else if (req.headers['sourceapp'] === 'cvfleetapp') {
//                     secret = JwtSecret.cvfleetJwtSecret || secret;
//                 } else if (req.headers['sourceapp'] === 'pvfleetapp') {
//                     secret = JwtSecret.pvfleetJwtSecret || secret;
//                 } else if (req.headers['sourceapp'] === 'aqsapp') {
//                     secret = JwtSecret.aqsJwtSecret || secret;
//                 } else if (req.headers['sourceapp'] === 'cdapp') {
//                     secret = JwtSecret.cdJwtSecret || secret;
//                 } else {
//                     return next({
//                         msg: commonResponse.commonResponseCode.Status_Unauthorized.message,
//                         "status": commonResponse.commonResponseCode.Status_Unauthorized.code
//                     });
//                 }
//                 jwt.verify(token, secret, function (err, decode) {
//                     if (err) {
//                         next('Access denied, Please login again')
//                     } else {
//                         LoginHistoryModel.findOne({ sessionToken: token, logoutAt: { $exists: false } }, function (err, user) {
//                             if (err) next('An error occured while authenticating user');
//                             else if (!user) next('User has been logged out');
//                             else {
//                                 db.commonDb.collection(user.schemaName).findOne({ _id: user.userId }, { lean: true }, function (e, userDetails) {
//                                     if (err || !userDetails) {
//                                         next('Access denied, Please login again')
//                                     } else {
//                                         console.log('decode', decode);
//                                         console.log('auth', user);
//                                         console.log('user', userDetails);
//                                         req.loggedInUser = userDetails;
//                                         req.auth = user;
//                                         req.decode = decode;
//                                         next();
//                                     }
//                                 })
//                             }
//                         })
//                     }

//                 });
//             }
//         } catch (error) {
//             next(error)
//         }
//     }
// }
