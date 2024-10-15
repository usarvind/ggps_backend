module.exports = function(model,config) {
    var module = {};

    module.login = function(req, res, next){
        if(req.session.admin) {
            next();
        } else {
            req.flash('error',"Please login");
            res.redirect('/admin');
        }
    };

    module.isLogin = function(req, res, next){
        if (req.session && req.session.admin) {
            console.log("Already login");
            //req.flash('error',"You have already login.");
            res.redirect('/admin/dashboard');            
        } else {
        	next();
        }
    };  

    return module;
}    