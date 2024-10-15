const { check, validationResult } = require('express-validator/check');
module.exports = function (app, controller) {

  var middleware = require('../middlewares/index')();
  app.use(async function (req, res, next) {
    var emailId = "";
    var password = "";
    if (req.session && req.session.user == undefined) {
      if (req.cookies && req.cookies.auth_login_detail != null && req.cookies.auth_login_detail != undefined) {
        var emailId = req.cookies.auth_login_detail.emailId;
        var password = req.cookies.auth_login_detail.password;
      }
    }
    //req.session.remember = { 'emailId': emailId, 'password': password };

    if (req.session && req.session.user) {
      var userId = req.session.user.id;

      if (userId != null && userId != 0 && userId != undefined && userId != "") {
        var userDetail = await User.findById(userId)
        if (userDetail != null) {
          if (userDetail.id == userId) {
            req.session.user = userDetail;
            next();
          }
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });

  
}