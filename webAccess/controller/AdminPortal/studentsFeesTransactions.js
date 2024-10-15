let StudentFeesMasterService = require('../../../microservicesList/adminMicroservice/serviceList/studentFeesTransService');
let studentFeesMasterService = new StudentFeesMasterService();


const { validationResult } = require('express-validator');
const moment = require('moment-timezone');
const path = require('path');
const { result } = require('lodash');

moment.tz.setDefault("Asia/Kolkata");

module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');

	module.studentsFeesTransactionList = function(req, res){
		//return ;

		res.render('./AdminPortal/studentTransactionsList/studentFeesTransactionsList', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"student_fees_transaction",
			subalias:"student_fees_transaction_list",
		});
			
	};
       
/*
	module.getStudentsFeesTransactionList = function(req, res){
		//return ;
		try {
			console.log(" getStudentsFeesTransactionList api list  reached called data : ")
			
			let body= req.body;
			
			let limit=body.length;
			let page =body.start;
			let condt1={};
			let condt2={};
			let condt3={};

			if(body['search[value]']){
				condt3['$or']=[
					{"studentAcData.studentClass":{"$regex":body['search[value]'],"$options":"i"}},
					{"fullname":{"$regex":body['search[value]'],"$options":"i"}},
				]

			}

			// if(body['search[value]']){
			// 	condt3['$or']=[{"studentData.firstName":{"$regex":body['search[value]'],"$options":"i"}}]

			// }
			
			studentFeesMasterService.getStudentFeesTransList(condt1,condt2,condt3,limit,page,(err, result)=>{
				console.log(" student getStudentAcademicMasterList api list called data : ", result)
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

*/


	module.getStudentsFeesTransactionList = function(req, res){
		
		try {
			console.log(" getStudentsFeesTransactionList api list  reached called data : ",req.body)
			
			let body= req.body;
			
			let limit=body.length;
			let page =body.start;
			let condt1={};
			let condt2={};
			let condt3={};

			if(body['search[value]']){
				condt3['$or']=[
					{"studentAcData.studentClass":{"$regex":body['search[value]'],"$options":"i"}},
					{"fullname":{"$regex":body['search[value]'],"$options":"i"}},
				]

			}
			let startDate, endDate;
			if(body.dropdownValue){
				if(body.dropdownValue=='0D'){
					console.log("0D")
					startDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
					endDate = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
				}else if(body.dropdownValue=='7D'){
					console.log("7D")
					startDate = new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0);
					endDate = new Date().setHours(23, 59, 59, 999);
				}else if(body.dropdownValue=='CM'){
					console.log("CM")
					 startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).setHours(0, 0, 0, 0);
					 endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).setHours(23, 59, 59, 999);

				}else{
					// Get the current date
					const now = new Date();

					// Calculate the previous month and year
					const previousMonth = now.getMonth() - 1;
					const yearForPreviousMonth = previousMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
					const monthForPreviousMonth = previousMonth < 0 ? 11 : previousMonth;

					// Set the start date to the first day of the previous month at 00:00:00.000
					 startDate = new Date(yearForPreviousMonth, monthForPreviousMonth, 1).setHours(0, 0, 0, 0);

					// Set the end date to the last day of the previous month at 23:59:59.999
					 endDate = new Date(yearForPreviousMonth, monthForPreviousMonth + 1, 0).setHours(23, 59, 59, 999);

				}
			}
			condt1['createdAt']={$gte:startDate,$lte:endDate}

			console.log(condt1)
			
			
			studentFeesMasterService.getStudentFeesTransList(condt1,condt2,condt3,limit,page,(err, result)=>{
				console.log(" student getStudentAcademicMasterList api list called data : ", result)
				if(err){
					var obj = {
						'draw': req.query.draw,
						'recordsTotal': 0,
						'recordsFiltered': 0,
						'data': {'totalFeesCollect':0},
				  };
				  return res.json(obj)
				}

				
				var obj = {
					'draw': req.query.draw,
					'recordsTotal': result.totalCount,
					'recordsFiltered': result.totalCount,
					'data': {result: result.data,'totalFeesCollect':result.totalFeesCollect}
			  };
			  console.log(obj)
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

	
	return module;
}

