let SubjectMasterService = require('../../../microservicesList/adminMicroservice/serviceList/subjectMasterService');
let subjectMasterService = new SubjectMasterService();
const { validationResult } = require('express-validator');
const moment = require('moment-timezone');
const path = require('path');
const { result } = require('lodash');
let helper = require('../../helper/helpers');


moment.tz.setDefault("Asia/Kolkata");

module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');

	module.classWiseSubjectList = async function(req,res){
		try{
			let body = req.body;
			let cond={
				selectClass:body.stdClass
			}
			subjectMasterService.getDetailsByCondData(cond,(err,result)=>{
				if(err){
					return res.send({status:false, message:err.message});
				}
				return res.send({status:true, message:'Details get successfull',data:result});
			});	
		}catch(err){
			return res.send({status:false, message:err.message});
		}
	};

	module.listSubjects =async function(req, res){
		//return ;

		res.render('./AdminPortal/subjects/subjectsList', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"subject",
			subalias:"subject_list",
            classes: await helper.getAllClassList()
		});
			
	};

	module.getAllSubjectsList = function(req, res){
		//return ;
		try {
			console.log(" student api list  reached called data : ")
			//return ;

			let body= req.body;
			let cond={
				
			}
			if(body['search[value]']){
				cond['subjectName']={"$regex":body['search[value]'],"$options":"i"}
			}
			if(body.sclass){
				cond['selectClass']=body.sclass;
			}

			let limit=body.length;
			let page =body.start;

			subjectMasterService.getSubjectMasterList(cond,limit,page,(err, result)=>{
				console.log(" subject api list called data : ", result)
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

	
	module.viewSubjects = function(req, res){
		//return ;
			res.render('./AdminPortal/subjects/subjectDetails', {
				error: req.flash("error"),
				success: req.flash("success"),
				config:config,
				session: req.session,
				alias:"subject",
				subalias:"subject_list",
				
			});
		
	};

	module.add = async function(req, res){
		//return ;
		res.render('./AdminPortal/subjects/subjectAdd', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"subject",
			subalias:"add_subject",
            classes: await helper.getAllClassList(),
			subjectSequence:await helper.getAllSubjectSequenceList()
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
			res.redirect('/admin/subject/add');
			return;
		}
		try{
			let body =  req.body;
			console.log(body);
           // return;

			console.log(" final object adding : ",body)
			body['subjectKey']= await helper.getSubjectKey(body.subjectName);
			body['subjectJustForGrade']=((body.subjectJustForGrade)?true:false);
			
			subjectMasterService.addSubject(body,(err , result)=>{
				console.log("+++++++++++++++++++++ : ",result)

				if(err){
					req.flash('error',err.message);
					res.redirect('/admin/subjects');	
				}else{
					req.flash('success',"Subject master created successfully ");
					res.redirect('/admin/subjects');
				}
			})
		}catch(ee){
			console.log(" master subject submit fronend error : ",ee)
			req.flash('error',ee['message']);
			res.redirect('/admin/subjects');
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
			res.redirect('/admin/subjects');
			return;
		}
		try{
			let body =  req.body;
			
			body['subjectKey']= await helper.getSubjectKey(body.subjectName);
            
			subjectMasterService.updateSubject(body,(err , result)=>{
				console.log("+++++++++++++++++++++ : ",result)
				if(err){
					req.flash('error',err.message);
					res.redirect('/admin/subjects');	
				}else{
					req.flash('success',"Record updated successfully !");
					res.redirect('/admin/subjects');
				}
			})
		}catch(ee){
			console.log(" master student submit fronend error : ",ee)
			req.flash('error',ee['message']);
			res.redirect('/admin/subjects');
		}
	};


	module.delete = function(req, res){
		//return ;

		let params =  req.params;
		console.log("ppppaammmmm : ",params)
		

		let body={
			_id:params.id,
		}

		subjectMasterService.deleteSubjectById(body,(err , result)=>{
			console.log("+++++++++++++++++++++ : ",result)
			if(err){
				req.flash('error',err.message);
				res.redirect('/admin/subjects');	
			}else{
				req.flash('success',"Record updated successfully !");
				res.redirect('/admin/subjects');
			}
		})
	
	};


	module.edit =async function(req, res){
		//return ;

		let params =  req.params;
		console.log("aaaaaabbbbbbbb : ",params)
		subjectMasterService.getDetailsById({_id:params.id},async (err , result)=>{
			if(err){
				console.log(" master student edit error : ")
				req.flash('error',err.message);
				res.redirect('/admin/subjects');
			}else{
				if(!result){
					req.flash('error',"Record not exist with this id");
					res.redirect('/admin/subjects');
				}
				else{
					result=result.toObject();
				}
				res.render('./AdminPortal/subjects/subjectEdit', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"subject",
					subalias:"subject_list",
			        subjectData : result,
                    classes: await helper.getAllClassList(),
					subjectSequence:await helper.getAllSubjectSequenceList()
				});

			}
		})
	
	};
	module.subjectMasterSubmit = async function(req,res){
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




function randomNumber(length) {
    var chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}