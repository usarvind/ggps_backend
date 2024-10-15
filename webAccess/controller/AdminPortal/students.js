let StudentMasterService = require('../../../microservicesList/adminMicroservice/serviceList/studentMasterService');
let studentMasterService = new StudentMasterService();
const { validationResult } = require('express-validator');
const moment = require('moment-timezone');
const path = require('path');
const { result } = require('lodash');
let helper = require('../../helper/helpers');


moment.tz.setDefault("Asia/Kolkata");

module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');

	module.listStudents = function(req, res){
		//return ;

		res.render('./AdminPortal/students/studentsList', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"student",
			subalias:"students_list",
		});
			
	};

	module.getAllStudentMasterList = function(req, res){
		//return ;
		try {
			console.log(" student api list  reached called data : ")
			//return ;

			let body= req.body;
			let cond={
				isDeleted:false
			}
			if(body['search[value]']){
				cond['fullname']={"$regex":body['search[value]'],"$options":"i"}
			}
			if(body.sclass){
				cond['currentClass']=body.sclass;
			}

			let limit=body.length;
			let page =body.start;

			studentMasterService.getStudentMasterList(cond,limit,page,(err, result)=>{
				console.log(" student api list called data : ", result)
				if(err){
					var obj = {
						'draw': req.query.draw,
						'recordsTotal': 0,
						'recordsFiltered': 0,
						'data': {}
				  };
				  return res.json(obj)
				}
				var obj = {
					'draw': req.query.draw,
					'recordsTotal': result.length,
					'recordsFiltered': result.length,
					'data': result
			  };
			  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa : ",obj)
			  return res.json(obj)

			});		
			
		} catch (err) {
			console.log(" get all student Data : ",err)
			var obj = {
				'draw': req.query.draw,
				'recordsTotal': 0,
				'recordsFiltered': 0,
				'data': {}
		  };
		  
		  return res.json(obj)
		}
		
	};

	
	module.viewStudents = function(req, res){
		//return ;
			res.render('./AdminPortal/students/studentDetails', {
				error: req.flash("error"),
				success: req.flash("success"),
				config:config,
				session: req.session,
				alias:"student",
				subalias:"students_list",
				
			});
		
	};

	module.add = function(req, res){
		//return ;
		res.render('./AdminPortal/students/studentAdd', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"student",
			subalias:"add_student"
		});
	};

	module.addSubmit =async function(req, res){
		const errors = validationResult(req);

		console.log(errors.array());
		//return ;

		if (!errors.isEmpty()) {
			let str=''; 
			errors.errors.forEach(element => {
			  str=str+element.msg+'\n';
			});

			console.log("---------------: ",errors)
			req.flash('error',str);
			res.redirect('/admin/student/add');
			return;
		}
		try{
			let body =  req.body;
			if(body.dob){
				body.dob=moment(body.dob).valueOf()
			}
			body.joiningDate=moment(body.joiningDate).valueOf()

	      	if(req.files && req.files.studentImage){
				let imageRes = await studentImage(req.files.studentImage)
				body.studentImage=imageRes;
			}
			console.log(" final object adding : ",body)
			body['regNo']= await helper.registrationNoGenerate();
			studentMasterService.addStudent(body,(err , result)=>{
				console.log("+++++++++++++++++++++ : ",result)

				if(err){
					req.flash('error',err.message);
					res.redirect('/admin/students');	
				}else{
					req.flash('success',"Student master created successfully & Registration no : "+body['regNo']);
					res.redirect('/admin/students');
				}
			})
		}catch(ee){
			console.log(" master student submit fronend error : ",ee)
			req.flash('error',ee['message']);
			res.redirect('/admin/students');
		}
	};

	module.updateMasterRecord =async function(req, res){
		const errors = validationResult(req);

		console.log(errors.array());
		//return ;
		if (!errors.isEmpty()) {
			let str='';
			errors.errors.forEach(element => {
			  str=str+element.msg+'\n';
			});
			console.log("---------------: ",errors)
			req.flash('error',str);
			res.redirect('/admin/students');
			return;
		}
		try{
			let body =  req.body;
			
			if(body.dob){
				body.dob=moment(body.dob).valueOf()
			}

			body.joiningDate=moment(body.joiningDate).valueOf()

	      	if(req.files && req.files.studentImage){
				let imageRes = await studentImage(req.files.studentImage)
				body.studentImage=imageRes;
			}
			studentMasterService.updateStudent(body,(err , result)=>{
				console.log("+++++++++++++++++++++ : ",result)
				if(err){
					req.flash('error',err.message);
					res.redirect('/admin/students');	
				}else{
					req.flash('success',"Record updated successfully !");
					res.redirect('/admin/students');
				}
			})
		}catch(ee){
			console.log(" master student submit fronend error : ",ee)
			req.flash('error',ee['message']);
			res.redirect('/admin/students');
		}
	};


	module.delete = function(req, res){
		//return ;

		let params =  req.params;
		console.log("ppppaammmmm : ",params)
		// studentMasterService.deleteStudentById({_id:params.id},(err , result)=>{
		// 	if(err){
		// 		console.log(" master student edit error : ")
		// 		req.flash('error',err.message);
		// 		res.redirect('/admin/students');
		// 	}else{
		// 		req.flash('success',"Record deleted successfully !");
		// 		res.redirect('/admin/students');
		// 	}
		// })

		let body={
			_id:params.id,
			isDeleted:true
		}

		studentMasterService.updateStudent(body,(err , result)=>{
			console.log("+++++++++++++++++++++ : ",result)
			if(err){
				req.flash('error',err.message);
				res.redirect('/admin/students');	
			}else{
				req.flash('success',"Record updated successfully !");
				res.redirect('/admin/students');
			}
		})
	
	};

	module.deactive_student = function(req, res){
		//return ;

		let params =  req.params;
		console.log("params : ",params)

		let body={
			_id:params.id,
			isAccountDeactive:true
		}

		studentMasterService.updateStudent(body,(err , result)=>{
			console.log("+++++++++++++++++++++ : ",result)
			if(err){
				req.flash('error',err.message);
				res.redirect('/admin/students');	
			}else{
				req.flash('success',"Record updated successfully !");
				res.redirect('/admin/students');
			}
		})
	
	};

	module.edit = function(req, res){
		//return ;

		let params =  req.params;
		console.log("aaaaaabbbbbbbb : ",params)
		studentMasterService.getDetailsById({_id:params.id},(err , result)=>{
			if(err){
				console.log(" master student edit error : ")
				req.flash('error',err.message);
				res.redirect('/admin/students');
			}else{
				if(!result){
					req.flash('error',"Record not exist with this id");
					res.redirect('/admin/students');
				}
				else{
					result=result.toObject();

					result.dob=(result.dob)?moment(result.dob).format("YYYY-MM-DD"):'';
					result.joiningDate=moment(result.joiningDate).format("YYYY-MM-DD");
				}
				res.render('./AdminPortal/students/studentEdit', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student",
					subalias:"students_list",
					studentData : result
				});

			}
		})
	
	};
	module.studentMasterSubmit = async function(req,res){
		 try {
			let body  =  req.body;
			console.log(" student data passing on server : ",body)
			return res.send(body)
			 
		 } catch (err) {
			 console.log(" studentMasterSubmit  : ",err)
		 }
	}

	return module;
}


async function studentImage(studentImage){
	var profile_image = studentImage;
	console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiii : ",profile_image)
	var tempNum = randomNumber(4);
	var datetime = moment(new Date(),'yyyymmddHHMMss');
	let extName =  path.extname(profile_image.name); // .html

	var imageName = datetime+tempNum+extName;
	console.log("iiiiiiiiiiiiiiiiiiiiiiiiii : "+imageName)

	return new Promise(function(resolve, reject) { 
		profile_image.mv('./public/AdminPortal/student/'+imageName, function(err, result) {
		   console.log('register image upload err: ', err);
		   if(err == undefined){
			   resolve(imageName)
			   
		   }else{
			   resolve("")
		   }
	   });
   });	
}

function randomNumber(length) {
    var chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}