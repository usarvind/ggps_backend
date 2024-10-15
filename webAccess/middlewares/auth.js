module.exports = function (model, config) {
    var module = {};
    module.login = function (req, res, next) {
        if (req.session.user) {
            next();
        } else {
            req.flash('error', "Please login");
            res.redirect('/login');
        }
    };
    module.isLogin = function (req, res, next) {
        if (req.session.user) {
            req.flash('error', "You have already login.");
            res.redirect('/login');
        } else {
            next();
        }
    };
    module.reCaptchaVarification = function (req, res, next) {

        var captchToken = req.body["g-recaptcha-response"];
        // if (!captchToken) {
        //     req.flash('error', "Please Select reCaptcha.");
        //     res.redirect('/login');
        // }
        var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
        recaptcha_url += "secret=" + config.RECAPTCHA_SECRET_KEY + "&";
        recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
        recaptcha_url += "remoteip=" + req.connection.remoteAddress;
        RequestPkg(recaptcha_url, function (error, resp, body) {
            //console.log(body);
            if (body) {
                var resData = JSON.parse(body);
                if (resData.success) {
                    next();
                } else {
                    req.flash('error', "Recaptch Verification Failed. Please Try Again.");
                    res.redirect('/login');
                }
            } else {
                req.flash('error', "Recaptch Verification Failed. Please Try Again.");
                res.redirect('/login');
            }
        });
    }

    return module;
}    