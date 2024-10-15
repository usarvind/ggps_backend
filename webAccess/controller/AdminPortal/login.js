let AdminLoginService = require('../../../microservicesList/adminMicroservice/serviceList/loginService');
let adminLoginService = new AdminLoginService();
const { validationResult } = require('express-validator');
module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');

	module.signin = function(req, res){
         console.log("login sessions : ", req.session)
		var emailId = "";
		var password = "";
		if(req.cookies && req.cookies.admin_login_detail != null && req.cookies.admin_login_detail != undefined){
			var emailId = req.cookies.admin_login_detail.email_id;
			var password = req.cookies.admin_login_detail.password;
		}

		res.render('./AdminPortal/auth/login', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			emailId: emailId,
			password: password,
		});
	};

	module.forget = function(request, response){
		response.render('./AdminPortal/auth/forgot-password', {
			error: request.flash("error"),
			success: request.flash("success"),
			vErrors: request.flash("vErrors"),
			config: config
		});
	};


	module.loginSubmit = async function(req, res){
		
	
		let body =  req.body;

		var emailId = body.email;
		//var password = md5(body.password);
		console.log("email ==============+ "+emailId)
		console.log("pass =================+ "+body.password)

		try{
			let condObj={
				email:emailId
			}
			adminLoginService.adminLogin(condObj,(err,userData)=>{
				console.log(" retrun code userData : ",userData)
				if(err){
					req.flash('error',err.message);
					res.redirect('/admin');	
				}else{
					if(!userData){
						req.flash('error',"Admin details not exist");
						return res.redirect('/admin');	
					}
					console.log("uuuuuuuuuuuuuuuuuuuuu : ",userData)
					
					if (userData.validPassword(body.password)) {
						userData = userData.toObject(); // converting to a plain javascript object
						
						delete userData["password"];
						//console.log("=================== : "+ userData.validPassword(body.password))

						req.session.admin=userData;
						req.flash('success',"Login successfully");
						res.redirect('/admin');
					}else{
						console.log("=== else ======REACHED ========== sdfdfdf : ")

						req.flash('error',"Invalid credentials ");
						return res.redirect('/admin');	
					}
					
				}

			})
		}catch(err){
			req.flash('error',err['message']);
			res.redirect('/admin');
		}
	};

	module.adminLogout = function(request, response){

		delete request.session.admin;

		request.flash('success',"Logout successfully");
		response.redirect('/admin');
		
	};

	module.adminProfile = function(req, res){

		try{
			let AdminLoginData = req.session.admin;
			let condObj={_id:AdminLoginData._id}
			adminLoginService.adminLogin(condObj,(err,userData)=>{
				console.log(" retrun code userData : ",userData)
				if(err){
					delete req.session.admin;
					req.flash('error',err.message);
					res.redirect('/admin');	
				}else{
					if(!userData){
						delete req.session.admin;
						req.flash('error',"Admin details not exist");
						return res.redirect('/admin');	
					}
					console.log("uuuuuuuuuuuuuuuuuuuuu : ",userData)
					
					userData = userData.toObject(); // converting to a plain javascript object
					delete userData["password"];

					res.render('./AdminPortal/profile/profile', {
						error: req.flash("error"),
						success: req.flash("success"),
						config:config,
						session: req.session,
						userData:userData
					});
					
					
				}

			})
		}catch(err){
			req.flash('error',err.message);
			return res.redirect('/admin');	
		}
		
	};


	module.adminPasswordUpdate= async function(req,res){
		const errors = validationResult(req);

		console.log(errors.errors);
		//return ;

		if (!errors.isEmpty()) {
		  let str='';
		  errors.errors.forEach(element => {
			str=str+element.msg+'\n';
		  });
		  req.flash('error',str);
		  res.redirect('/admin/profile');
		  return;
		}else{
			let body= req.body;

			try{
			let condObj={
				_id:body.id
			}
			adminLoginService.adminLogin(condObj,(err,userData)=>{
				console.log(" retrun code userData : ",userData)
				if(err){
					req.flash('error',err.message);
					res.redirect('/admin/profile');	
				}else{
					if(!userData){
						req.flash('error',"Admin details not exist");
						return res.redirect('/admin/profile');	
					}
					//console.log("uuuuuuuuuuuuuuuuuuuuu : ",userData)
					
					if (userData.validPassword(body.oldpassword)) {
						let dataObj={
							'_id':userData['_id'],
							password:body.newpassword
						}
						adminLoginService.updatePassword(dataObj,(err,updtRes)=>{
							console.log(" retrun code userData : ",err)
							//return;

							if(err){
								req.flash('error',err.message);
								res.redirect('/admin/profile');	
							}else{
								req.flash('success',"Password updated successfully");
								res.redirect('/admin/profile');
							}
						})
					}else{
						console.log("=== else ======REACHED ========== : ")

						req.flash('error',"Invalid old password ");
						return res.redirect('/admin/profile');	
					}
					
				}

			})
		}catch(err){
			console.log(err)
			req.flash('error',err['message']);
			res.redirect('/admin/profile');
		}
		}
	};

	

	

	
	
	
	return module;
}


function generatePassword(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz#$%^&@';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}