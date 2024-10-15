let AdminLoginService = require('../../../microservicesList/adminMicroservice/serviceList/loginService');
let adminLoginService = new AdminLoginService();
module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');

	module.viewDashboard = function(req, res){
        
		let loginData = req.session.admin;
		res.render('./AdminPortal/dashboard/dashboard', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"dashboard",
			subalias:"adminDashboard"
		});
		
	};

	return module;
}
