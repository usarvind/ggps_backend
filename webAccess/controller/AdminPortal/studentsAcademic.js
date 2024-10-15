let StudentAcademicMasterService = require('../../../microservicesList/adminMicroservice/serviceList/studentAcademicMasterService');
let studentAcademicMasterService = new StudentAcademicMasterService();

let StudentMasterService = require('../../../microservicesList/adminMicroservice/serviceList/studentMasterService');
let studentMasterService = new StudentMasterService();

let StudentFeeTransService = require('../../../microservicesList/adminMicroservice/serviceList/studentFeesTransService');
let studentFeesTransService = new StudentFeeTransService();

const { validationResult } = require('express-validator');
const moment = require('moment-timezone');
var converter = require('number-to-words');
const path = require('path');
const { result } = require('lodash');
moment.tz.setDefault("Asia/Kolkata");

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const helper = require('../../helper/helpers');

module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');

	module.listStudents = function(req, res){
		//return ;
		let years =[];
		for(let y=2010;y<=2250;y++){
			years.push(y)
		}

		let cdate= new Date();
		let cyear = cdate.getFullYear();

		let data={
			years:years,
			cyear:cyear
		}
		res.render('./AdminPortal/studentsAcademic/studentsList', {
			error: req.flash("error"),
			success: req.flash("success"),
			config:config,
			session: req.session,
			alias:"student_academic",
			subalias:"students_academic_list",
			data:data
		});
			
	};

	module.getAllStudentMasterList = function(req, res){
		//return ;
		try {
			
			let body= req.body;
			console.log(" student api list  reached called data : ",body)
			let condt1 = {}
			condt1['studentClass']=body.sclass;
			condt1['academicYear']=body.academicYear;
			let condt2={}
			if(body['search[value]']){
				condt2['fullname']={"$regex":body['search[value]'],"$options":"i"}
			}

			let limit=body.length;
			let page =body.start;

			studentAcademicMasterService.getStudentAcademicMasterList(condt1,condt2,limit,page,async (err, result)=>{
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

				let monthsList = await helper.getAllTransMonthList();
				let cdate = new Date();
				let cmonth=cdate.getMonth();

				let gcyear= cdate.getFullYear();
				let acyear = (1*body.academicYear);
				if(gcyear>acyear && cmonth>2){
					cmonth=2;
				}

				let ind = monthsList.findIndex((row)=>row.value==cmonth);

				//console.log(" months :",monthsList[ind]," indindind ind "+ind)

				for(let ak of result){

					 let monthsfeesIndex=[];
					 let monthstransportIndex=[];
					 let monthsexamIndex=[];
					 let totalTillFeesAmount=((ak.admissionFeeAmt)?(1*ak.admissionFeeAmt):0);
					 totalTillFeesAmount=totalTillFeesAmount+((ak.previousYearAmt)?(1*ak.previousYearAmt):0);

					 if(ak.studentFeesForMonths){
						(ak.studentFeesForMonths).forEach(function (value, i) {
							monthsfeesIndex.push(value.split('``')[0]);
						});
					 }
					 if(ak.studentTransportMonth){
						(ak.studentTransportMonth).forEach(function (value, i) {
							monthstransportIndex.push(value.split('``')[0]);
						});
					 }
					 if(ak.studentExamFeesForMonths){
						(ak.studentExamFeesForMonths).forEach(function (value, i) {
							monthsexamIndex.push(value.split('``')[0]);
						});
					 }

					 console.log(" monthsfeesIndex :",monthsfeesIndex," :monthstransportIndex :",monthstransportIndex," monthsexamIndex:",monthsexamIndex)

					 monthsList.forEach(function (vale, i) {
						if(i<=ind){
							let mind = monthsfeesIndex.findIndex(min=> min==vale.value);
							if(mind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((ak.studentFeesPerMonth)?(1*ak.studentFeesPerMonth):0);
							}

							let tind = monthstransportIndex.findIndex(min=> min==vale.value);
							if(tind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((ak.studentTransportFeesForMonth)?(1*ak.studentTransportFeesForMonth):0);
							}

							let eind = monthsexamIndex.findIndex(min=> min==vale.value);
							if(eind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((ak.studentExamFeesAmountForMonth)?(1*ak.studentExamFeesAmountForMonth):0);
							}
						}
					});

					ak['totalUptodateFeesAmount']=totalTillFeesAmount;
					 
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


	module.studentMarkUpload= async function(req,res){
		try {

			let body = req.body;

			console.log("BODY : ",body)
			//return;

			let subjects=[],hymm=[],hymo=[],hymo2=[],ymm=[],ymo=[],ymo2=[],hygd=[],ygd=[];
			let ychkbox=((body.year_checkbox)?true:false);

			if(body['subjectName']){
				if(typeof body['subjectName'] === 'string') {
					subjects= [body['subjectName']];
				}else{
					subjects=body['subjectName'];
				}
			}

			if(body['hymmdata']){
				if(typeof body['hymmdata'] === 'string') {
					hymm= [body['hymmdata']];
				}else{
					hymm=body['hymmdata'];
				}
			}

			if(body['hymodata']){
				if(typeof body['hymodata'] === 'string') {
					hymo= [body['hymodata']];
				}else{
					hymo=body['hymodata'];
				}
			}

			if(body['hymo1data']){
				if(typeof body['hymo1data'] === 'string') {
					hymo2= [body['hymo1data']];
				}else{
					hymo2=body['hymo1data'];
				}
			}

			if(body['ymmdata']){
				if(typeof body['ymmdata'] === 'string') {
					ymm= [body['ymmdata']];
				}else{
					ymm=body['ymmdata'];
				}
			}

			if(body['ymodata']){
				if(typeof body['ymodata'] === 'string') {
					ymo= [body['ymodata']];
				}else{
					ymo=body['ymodata'];
				}
			}

			if(body['ymo1data']){
				if(typeof body['ymo1data'] === 'string') {
					ymo2= [body['ymo1data']];
				}else{
					ymo2=body['ymo1data'];
				}
			}


			if(body['hygddata']){
				if(typeof body['hygddata'] === 'string') {
					hygd= [body['hygddata']];
				}else{
					hygd=body['hygddata'];
				}
			}

			if(body['ygddata']){
				if(typeof body['ygddata'] === 'string') {
					ygd= [body['ygddata']];
				}else{
					ygd=body['ygddata'];
				}
			}


			let finalobject=[];

			let studentTotalMark=0;
			let studentTotalMarkObtain=0;

			let studentAnnualTotalMark=0;
			let studentAnnualTotalMarkObtain=0;

			let hystudentTotalMark=0;
			let hystudentTotalMarkObtain=0;

			
			

			let studentOverallGrade='NA',hystudentOverallGrade='NA',studentAnnualGrade='NA';
			
			for(let ss=0;ss<subjects.length;ss++){
				let thalfYearMarkMM=((hymm[ss])?hymm[ss]:'');
				let thalfYearMarkMO=((hymo[ss])?hymo[ss]:'');
				let thalfYearMarkMO2=((hymo2[ss])?hymo2[ss]:'');
				let thalfYearSubjectGrade=((hygd[ss])?hygd[ss]:'');

				let tyearMarkMM=((ymm[ss])?ymm[ss]:'');
				let tyearMarkMO=((ymo[ss])?ymo[ss]:'');
				let tyearMarkMO2=((ymo2[ss])?ymo2[ss]:'');
				let tyearSubjectGrade=((ygd[ss])?ygd[ss]:'');

				let ftotmark=(1*(isNumeric(thalfYearMarkMM)?thalfYearMarkMM:0))+(1*(isNumeric(tyearMarkMM)?tyearMarkMM:0));
				let ftotmarkobtain=(1*(isNumeric(thalfYearMarkMO)?thalfYearMarkMO:0))+(1*(isNumeric(thalfYearMarkMO2)?thalfYearMarkMO2:0))+(1*(isNumeric(tyearMarkMO)?tyearMarkMO:0))+(1*(isNumeric(tyearMarkMO2)?tyearMarkMO2:0));
				
				hystudentTotalMark=hystudentTotalMark+(1*(isNumeric(thalfYearMarkMM)?thalfYearMarkMM:0));
				hystudentTotalMarkObtain=hystudentTotalMarkObtain+(1*(isNumeric(thalfYearMarkMO)?thalfYearMarkMO:0))+(1*(isNumeric(thalfYearMarkMO2)?thalfYearMarkMO2:0));
				
				studentAnnualTotalMark=studentAnnualTotalMark+(1*(isNumeric(tyearMarkMM)?tyearMarkMM:0));
				studentAnnualTotalMarkObtain=studentAnnualTotalMarkObtain+(1*(isNumeric(tyearMarkMO)?tyearMarkMO:0))+(1*(isNumeric(tyearMarkMO2)?tyearMarkMO2:0));

				
				studentTotalMark=studentTotalMark+(1*ftotmark);
				studentTotalMarkObtain=studentTotalMarkObtain+(1*ftotmarkobtain);

				finalobject.push({
					subjectName:(subjects[ss].split('``')[1]),
					subjectKey:(subjects[ss].split('``')[0]),
					subjectSequence:((subjects[ss].split('``')[2]!=undefined)?(subjects[ss].split('``')[2]):1),
					justForGrade:((subjects[ss].split('``')[3]!=undefined)?(subjects[ss].split('``')[3]):false),
					halfYearMarkMM:thalfYearMarkMM,
					halfYearMarkMO:thalfYearMarkMO,
					halfYearMarkMO2:thalfYearMarkMO2,
					halfYearSubjectGrade:thalfYearSubjectGrade,

					halfYearTotMark:thalfYearMarkMM,
					halfYearTotMarkObtainSubject:((1*(isNumeric(thalfYearMarkMO)?thalfYearMarkMO:0))+(1*(isNumeric(thalfYearMarkMO2)?thalfYearMarkMO2:0))),

					yearMarkMM:tyearMarkMM,
					yearMarkMO:tyearMarkMO,
					yearMarkMO2:tyearMarkMO2,
					yearTotMarkObtainSubject:((1*(isNumeric(tyearMarkMO)?tyearMarkMO:0))+(1*(isNumeric(tyearMarkMO2)?tyearMarkMO2:0))),
					yearSubjectGrade:tyearSubjectGrade,

					totalSubjectMark:ftotmark,
					totalMarkObtainSubject:ftotmarkobtain,
					finalSubjectWiseGrade:(helper.subjectGrade(ftotmark,ftotmarkobtain)),

				})
			}

			finalobject.sort(function(a, b) {
				var keyA = (1*a.subjectSequence),
				  keyB = (1*b.subjectSequence);
				// Compare the 2 dates
				if (keyA < keyB) return -1;
				if (keyA > keyB) return 1;
				return 0;
			  });

			studentOverallGrade=(helper.subjectGrade(studentTotalMark,studentTotalMarkObtain));
			let studentOveralPerct = ((studentTotalMarkObtain*100)/(1*studentTotalMark));
			studentOveralPerct=(studentOveralPerct).toFixed(2);
			studentOveralPerct=(1*studentOveralPerct)
			studentOveralPerct=(isNumeric(studentOveralPerct)?studentOveralPerct:0)

			hystudentOverallGrade=(helper.subjectGrade(hystudentTotalMark,hystudentTotalMarkObtain))
			let hystudentOveralPerct = ((hystudentTotalMarkObtain*100)/(1*hystudentTotalMark));
			hystudentOveralPerct=(hystudentOveralPerct).toFixed(2);
			hystudentOveralPerct=(1*hystudentOveralPerct)
			console.log(" hystudentOveralPerct hystudentOveralPerct : "+hystudentOveralPerct)
			
			hystudentOveralPerct=(isNumeric(hystudentOveralPerct)?hystudentOveralPerct:0)
			console.log(" hystudentOveralPerct hystudentOveralPerct : "+hystudentOveralPerct)
			  
			//return;

            
			studentAnnualGrade=(helper.subjectGrade(studentAnnualTotalMark,studentAnnualTotalMarkObtain))
			studentAnnualPerct= ((studentAnnualTotalMarkObtain*100)/(1*studentAnnualTotalMark));
			studentAnnualPerct=(studentAnnualPerct).toFixed(2);
			studentAnnualPerct=(1*studentAnnualPerct)
			studentAnnualPerct=(isNumeric(studentAnnualPerct)?studentAnnualPerct:0)


			console.log("studentAnnualTotalMark : "+studentAnnualTotalMark)
			console.log("studentAnnualTotalMarkObtain : "+studentAnnualTotalMarkObtain)



			let yearData={
				studentOverallPerct:studentOveralPerct,
				studentTotalMark:studentTotalMark,
				studentTotalMarkObtain:studentTotalMarkObtain,
				studentOverallGrade:studentOverallGrade,
			}

			let hyyearData={
				studentOverallPerct:hystudentOveralPerct,
				studentTotalMark:hystudentTotalMark,
				studentTotalMarkObtain:hystudentTotalMarkObtain,
				studentOverallGrade:hystudentOverallGrade,
			}

			let annualyearData={
				studentOverallPerct:studentAnnualPerct,
				studentTotalMark:studentAnnualTotalMark,
				studentTotalMarkObtain:studentAnnualTotalMarkObtain,
				studentOverallGrade:studentAnnualGrade,
			}

			studentAcademicMasterService.getStudentsDetailsById({_id:ObjectId(body.id)},(err,result)=>{
				if(err){
						req.flash('error',err.message);
						res.redirect('/admin/studentsAcademic');
				}
	
				// console.log("viewStudents result result : ",result)
	
				if(result.length>0){

					let cond={
						_id:ObjectId(body.id)
					}
					let updateData={
						$set:{
							resultData:finalobject,
							isHalfYealy:true,
							isYealy:ychkbox,
							studentTotalMark: studentTotalMark,
							finalYearlyTotalCalData:yearData,
							halfYearTotalCalData:hyyearData,
							annualYearTotalCalData:annualyearData,
							studentAttendencePerct:100

						}
					}

					console.log(" updateData updateData  : ",annualyearData)

					//return;

					studentAcademicMasterService.updateStudent(cond,updateData,(err , result)=>{
						console.log("+++++++++++++++++++++ : ",result)
						if(err){
							req.flash('error',err.message);
							res.redirect('/admin/studentsAcademic');	
						}else{
							req.flash('success',"Result updated successfully !");
							res.redirect('/admin/studentsAcademic');
						}
					})

					
				}else{
					req.flash('error',"Details not exit with this id");
					res.redirect('/admin/studentsAcademic');
				}
			});

			
		} catch (error) {
			console.log("------------------- : ",error)
			req.flash('error',error.message);
			res.redirect('/admin/studentsAcademic');
		}
	}

	
		module.printFeesReceipt= function(req,res){
		try{
			let params =  req.params;
			let txtId=params.id;
			let printRequestSpaceficStudent = params.spaceficStudent;
			let academicId =params.academicId;

			let forUrlError = (printRequestSpaceficStudent=='yes')?'admin/studentsAcademic/paidFeesList/'+academicId:'admin/feesTransaction/lists';
			forUrlError=config.baseUrl+forUrlError;
			
			let condst={
				_id:ObjectId(txtId)
			};
			let condsa={};
			let condsm={}
		

			studentFeesTransService.getSpaceficStudentPaidFeesTranDetails(condst,condsa,condsm,async (err,result)=>{
				if(err){
						req.flash('error',err.message);
						res.redirect(forUrlError);
				}
				// console.log(" params params params : ",result)
				// return ;
				

				if(result.length>0){
					let monthsList = await helper.getAllTransMonthList();
					
					let totalSumTillPaidQ= await studentFeesTransService.findAndSumQuery({studentAcademicId:result[0].studentAcadmicId,createdAt:{$lte:result[0].transactionDate}});
					let totalSumTillPaidStudent=0;
					if(totalSumTillPaidQ.length>0){
						totalSumTillPaidStudent=totalSumTillPaidQ[0].totalAmountTillPaid*1;
					}

					console.log(" totalSumTillPaidStudent "+ totalSumTillPaidStudent)

					let cdate = new Date();
					let cmonth=cdate.getMonth();

					let gcyear= cdate.getFullYear();
					let acyear = (1*result[0].academicYear);
					if(gcyear>acyear && cmonth>2){
						cmonth=2;
					}

					let ind = monthsList.findIndex((row)=>row.value==cmonth);

					let monthsfeesIndex=[];
					let monthstransportIndex=[];
					let monthsexamIndex=[];
					let totalTillFeesAmount=((result[0].admissionFeeAmt)?(1*result[0].admissionFeeAmt):0);
					totalTillFeesAmount=totalTillFeesAmount+((result[0].previousYearAmt)?(1*result[0].previousYearAmt):0);

					if(result[0].studentFeesForMonths){
					   (result[0].studentFeesForMonths).forEach(function (value, i) {
						   monthsfeesIndex.push(value.split('``')[0]);
					   });
					}
					if(result[0].studentTransportMonth){
					   (result[0].studentTransportMonth).forEach(function (value, i) {
						   monthstransportIndex.push(value.split('``')[0]);
					   });
					}
					if(result[0].studentExamFeesForMonths){
					   (result[0].studentExamFeesForMonths).forEach(function (value, i) {
						   monthsexamIndex.push(value.split('``')[0]);
					   });
					}


					monthsList.forEach(function (vale, i) {
						if(i<=ind){
							let mind = monthsfeesIndex.findIndex(min=> min==vale.value);
							if(mind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((result[0].studentFeesPerMonth)?(1*result[0].studentFeesPerMonth):0);
							}

							let tind = monthstransportIndex.findIndex(min=> min==vale.value);
							if(tind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((result[0].studentTransportFeesForMonth)?(1*result[0].studentTransportFeesForMonth):0);
							}

							let eind = monthsexamIndex.findIndex(min=> min==vale.value);
							if(eind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((result[0].studentExamFeesAmountForMonth)?(1*result[0].studentExamFeesAmountForMonth):0);
							}
						}
					});

					//console.log(" totalTillFeesAmount +++++++++++ :"+totalTillFeesAmount)

					let totPendtData = ((totalTillFeesAmount < totalSumTillPaidStudent)?`${"(+) "+(totalSumTillPaidStudent-1*totalTillFeesAmount)}`:`${""+(totalSumTillPaidStudent-(1*totalTillFeesAmount))}`);

					result[0].tillDatePendingFees =totPendtData;


					result[0].dob=moment(result[0].dob).format("DD.MM.YYYY");
					result[0].tranDate=moment(result[0].transactionDate).format("DD.MM.YYYY HH:MM A");
					result[0].totalAcademicPending = (1*result[0].totalFeeAmt-(1*result[0].totalFeePaidByStudent))
					result[0].paidFeeString = ((converter.toWords(1*result[0].feesAmount)).toUpperCase())

					//console.log(" result result : ",result);


					res.render('./AdminPortal/studentsAcademic/printPaidFeesReceipt', {
						error: req.flash("error"),
						success: req.flash("success"),
						config:config,
						session: req.session,
						alias:"student_academic",
						subalias:"students_academic_list",
						data:result[0]
					});
				}else{
					req.flash('error',"Transaction details not exist");
					res.redirect(forUrlError);
				}

			});
		}catch(err){
			req.flash('error',err.message);
			res.redirect(forUrlError);
		}
	}
	module.generateResult = function(req,res){
		console.log("====================================== :")
		let params =  req.params;

		console.log(" params params params : "+params.id)

		let act=params.action;
		
		if(params.action !='yearly' && params.action !='half_year'){
			req.flash('error',"Please select valid action");
			return res.redirect('/admin/studentsAcademic');
		}
		
		studentAcademicMasterService.getStudentsDetailsById({_id:ObjectId(params.id)}, async (err,result)=>{
			if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
			}

			//console.log("viewStudents result result : ",result)

			//return;

			if(result.length>0){
				result[0].dob=moment(result[0].dob).format("DD-MMM-YYYY");

				let perct = ((params.action=='half_year')?result[0].halfYearTotalCalData.studentOverallPerct:result[0].finalYearlyTotalCalData.studentOverallPerct)
				result[0]['resultRemarks']=helper.getStudentRemark(perct);
				result[0]['result']=helper.getStudentResult(perct);
				result[0]['promoted']=helper.getPromotedClass(result[0].studentClass,perct);
				result[0]['division']=helper.getStudentDivision(perct);
				
				console.log("viewStudents result result : ",result)
				
				res.render('./AdminPortal/studentsAcademic/marksheetGenerated', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					data:result[0],
					resultAction:act
					
				});
			}else{
				req.flash('error',"Details not exit with this id");
				res.redirect('/admin/studentsAcademic');
			}
		});
	}

	module.generateStudentResults = function(req,res){
		console.log("====================================== :")
		let params =  req.params;

		console.log(" params params params : "+params.id)
		let cond={
			studentClass:params.sclass,
			academicYear:params.year,
		}
		if(params.action=='half_year'){
			cond.isHalfYealy=true;
		}

		if(params.action=='yearly'){
			cond.isYealy=true;
		}

		if(params.action !='yearly' && params.action !='half_year'){
			req.flash('error',"Please select valid action");
			return res.redirect('/admin/studentsAcademic');
		}

		studentAcademicMasterService.getStudentsDetailsById(cond,async (err,result)=>{
			if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
			}

			console.log("viewStudents result result : ",result)

			if(result.length>0){
				result.forEach(element => {
					element.dob=moment(element.dob).format("DD-MMM-YYYY");
					let perct = ((params.action=='half_year')?element.halfYearTotalCalData.studentOverallPerct:element.finalYearlyTotalCalData.studentOverallPerct)
					element['resultRemarks']=helper.getStudentRemark(perct);
					element['result']=helper.getStudentResult(perct);
					element['promoted']=helper.getPromotedClass(element.studentClass,perct);
					element['division']=helper.getStudentDivision(perct);
				});

			console.log("viewStudents result result : ",result)

				
				
				res.render('./AdminPortal/studentsAcademic/bunchoffmarksheetGenerated', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					result:result,
					resultAction:params.action
				});
			}else{
				req.flash('error',"Details not exit with this id");
				res.redirect('/admin/studentsAcademic');
			}
		});
	}
	

	module.generateStudentPendingFeesList = function(req,res){
		try {
			
			let query= req.params;
			console.log(" student api list  reached called data : ",query)
			let condt1 = {}
			condt1['studentClass']=query.sclass;
			condt1['academicYear']=query.year;
			let condt2={}
			
			let limit=10000;
			let page=0;

			studentAcademicMasterService.getStudentAcademicMasterList(condt1,condt2,limit,page,async (err, result)=>{
				console.log(" student getStudentAcademicMasterList api list called data : ", result)
				console.log("+++++++++++++ err : ",err)
				//return;

				if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
				}

				let monthsList = await helper.getAllTransMonthList();
				let cdate = new Date();
				let cmonth=cdate.getMonth();
				let ind = monthsList.findIndex((row)=>row.value==cmonth);

				//console.log(" months :",monthsList[ind]," indindind ind "+ind)

				let pendingStudentsFeesData=[]

				for(let ak of result){

					 let monthsfeesIndex=[];
					 let monthstransportIndex=[];
					 let monthsexamIndex=[];
					 let totalTillFeesAmount=((ak.admissionFeeAmt)?(1*ak.admissionFeeAmt):0);
					 totalTillFeesAmount=totalTillFeesAmount+((ak.previousYearAmt)?(1*ak.previousYearAmt):0);

					 if(ak.studentFeesForMonths){
						(ak.studentFeesForMonths).forEach(function (value, i) {
							monthsfeesIndex.push(value.split('``')[0]);
						});
					 }
					 if(ak.studentTransportMonth){
						(ak.studentTransportMonth).forEach(function (value, i) {
							monthstransportIndex.push(value.split('``')[0]);
						});
					 }
					 if(ak.studentExamFeesForMonths){
						(ak.studentExamFeesForMonths).forEach(function (value, i) {
							monthsexamIndex.push(value.split('``')[0]);
						});
					 }

					 console.log(" monthsfeesIndex :",monthsfeesIndex," :monthstransportIndex :",monthstransportIndex," monthsexamIndex:",monthsexamIndex)

					 monthsList.forEach(function (vale, i) {
						if(i<=ind){
							let mind = monthsfeesIndex.findIndex(min=> min==vale.value);
							if(mind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((ak.studentFeesPerMonth)?(1*ak.studentFeesPerMonth):0);
							}

							let tind = monthstransportIndex.findIndex(min=> min==vale.value);
							if(tind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((ak.studentTransportFeesForMonth)?(1*ak.studentTransportFeesForMonth):0);
							}

							let eind = monthsexamIndex.findIndex(min=> min==vale.value);
							if(eind>=0){
								totalTillFeesAmount=totalTillFeesAmount+((ak.studentExamFeesAmountForMonth)?(1*ak.studentExamFeesAmountForMonth):0);
							}
						}
					});

					ak['totalUptodateFeesAmount']=totalTillFeesAmount;

					ak['pendingFeesTillMonth']=(ak.studentPaidFeeByStudent-1*ak.totalUptodateFeesAmount);
					
					ak['totalPendingFees']=(ak.totalFeeAmt-ak.studentPaidFeeByStudent);
					
					if(ak['pendingFeesTillMonth']<0) 
					{
						pendingStudentsFeesData.push(ak)
					}
				}

				pendingStudentsFeesData.sort(function(a, b) {
					var keyA = (1*a.pendingFeesTillMonth),
					  keyB = (1*b.pendingFeesTillMonth);
					// Compare the 2 dates
					if (keyA < keyB) return -1;
					if (keyA > keyB) return 1;
					return 0;
				  });



				res.render('./AdminPortal/studentsAcademic/generateStudentPendingFeesList', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					result:pendingStudentsFeesData,
				});

			});		
			
		} catch (err) {
			console.log(" get all student Data : ",err)
			if(err){
				req.flash('error',err.message);
				res.redirect('/admin/studentsAcademic');
			}
		}
	}
	

	module.viewStudents = function(req, res){

		console.log("====================================== :")
		let params =  req.params;

		console.log(" params params params : "+params.id)

		studentAcademicMasterService.getStudentsDetailsById({_id:ObjectId(params.id)},(err,result)=>{
			if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
			}

			console.log("viewStudents result result : ",result)

			if(result.length>0){
				res.render('./AdminPortal/studentsAcademic/studentDetails', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					data:result[0]
				});
			}else{
				req.flash('error',"Details not exit with this id");
				res.redirect('/admin/studentsAcademic');
			}
		});
		
	};


	module.icardGenerate = function(req, res){

		console.log("====================================== :")
		let params =  req.params;

		console.log(" params params params : "+params.id)

		studentAcademicMasterService.getStudentsDetailsById({_id:ObjectId(params.id)},(err,result)=>{
			if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
			}

			console.log("icard result result : ",result)

			if(result.length>0){
				result[0].dob=moment(result[0].dob).format("DD.MM.YYYY");
				result[0].academicYearEnd= (result[0].academicYear*1)+1;
				let pageName="studentIcard";
				if(result[0].studentClass=='1' || result[0].studentClass=='KG' || result[0].studentClass=='LKG' || result[0].studentClass=='UKG'){
					pageName="studentIcardLKG";
				}
				result[0].studentClass = helper.addStringInStd(result[0].studentClass);

				res.render('./AdminPortal/studentsAcademic/'+pageName, {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					data:result[0]
				});
			}else{
				req.flash('error',"Details not exit with this id");
				res.redirect('/admin/studentsAcademic');
			}
		});
		
	};

	module.generateExamCard = function(req, res){

		console.log("====================================== :")
		let params =  req.params;

		console.log(" params params params : "+params.year)

		let cond={
			academicYear:params.year,
			studentClass:params.sclass
		}

		studentAcademicMasterService.getStudentsDetailsById(cond,async (err,result)=>{
			if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
			}

			console.log("icard result result : ",result)

			//return;

			if(result.length>0){
				result.forEach(async element => {
					element.dob=moment(element.dob).format("DD-MMM-YYYY")
				});

				

				res.render('./AdminPortal/studentsAcademic/examCard', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					result:result,
                                        academicYear:params.year
				});
			}else{
				req.flash('error',"Details not exit with this id");
				res.redirect('/admin/studentsAcademic');
			}
		});
		
	};


	

	module.studentPaidFeesList = function(req, res){

		console.log("====================================== :")
		let params =  req.params;

		console.log(" params params params : "+params.id)
		
		studentFeesTransService.getSpaceficStudentFeesTransList({"studentAcData._id":ObjectId(params.id)},(err,result)=>{
			if(err){
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
			}

			console.log("viewStudents result result : ",result)
			result.forEach(element => {
				element.transactionDate=moment(element.transactionDate).format("DD-MM-YYYY HH:MM A")
			});

			if(result.length>0){
				res.render('./AdminPortal/studentsAcademic/spaceficStudentFeesTransactionsList', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
					data:result
				});
			}else{
				req.flash('error',"Details not exit with this id");
				res.redirect('/admin/studentsAcademic');
			}
		});
		
	};

	

	module.addSubmit =async function(req, res){
		const errors = validationResult(req.body);

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
			console.log("body body : ",body)
			//return;
			studentMasterService.getDetailsById({_id:body.id},(err , result)=>{
				if(err){
					console.log(" master student edit error : ")
					req.flash('error',err.message);
					res.redirect('/admin/students');
				}else{
					if(!result){
						req.flash('error',"Details not exist");
						res.redirect('/admin/students');
					}

					if(result.isAccountDeactive){
						req.flash('error',"Account deactive can not promote it. ");
						res.redirect('/admin/students');
					}
					console.log("-------------------------- : ",result)
					
					let updateData={
						
							currentClass:body.selectClass,
						    _id:body.id
					}
					

					studentAcademicMasterService.getDetailsById({academicYear:body.academicYear,studentMasterId:ObjectId(body.id)},(err,resultAcd)=>{
						if(err){
								req.flash('error',err.message);
								res.redirect('/admin/students');
						}
						if(resultAcd){
							req.flash('error',"Student is already promoted for this class for this academic year");
							return res.redirect('/admin/students');
						}else{

							studentMasterService.updateStudent(updateData,(err , result)=>{

							});

							let currentYBal=0;
							let totalTransFees=0;
							let totalExamfees=0;
							let transportFeesMonths=[];
							let studentMonthsFees=[];
							let examMonthsFees=[];

							if(body['transportmonths']){
								if(typeof body['transportmonths'] === 'string') {
									transportFeesMonths= [body['transportmonths']];
								}else{
									transportFeesMonths=body['transportmonths'];
								}
							}

							totalTransFees=(transportFeesMonths.length)*(1*body.transportfeesmonths);

							if(body['monthly_fees']){
								if(typeof body['monthly_fees'] === 'string') {
									studentMonthsFees= [body['monthly_fees']];
								}else{
									studentMonthsFees=body['monthly_fees'];
								}
							}
							currentYBal=(studentMonthsFees.length)*(1*body.currentYearMonthFees);

							

							if(body['examfeesmonths']){
								if(typeof body['examfeesmonths'] === 'string') {
									examMonthsFees= [body['examfeesmonths']];
								}else{
									examMonthsFees=body['examfeesmonths'];
								}
							}
							totalExamfees=(examMonthsFees.length)*(1*body.examfees);

							let previousYBal = ((body.previousYearBal)?(body.previousYearBal):0);
							
							
							let studentAcademicObj={
								studentMasterId:result._id,
								previousYearPendingFeeAmt:previousYBal,
								admissionFeeAmt:((body.admissionFees)?(1*body.admissionFees):0),
								studentTransportMonth:transportFeesMonths,
								studentFeesForMonths:studentMonthsFees,
								studentExamFeesForMonths:examMonthsFees,
								currentYearFeeAmt:currentYBal,
								totalFeeAmt:(1*currentYBal+1*previousYBal+1*totalTransFees+1*totalExamfees+1*(body.admissionFees)),
								totalFeePaidByStudent:0,
								studentClass:body.selectClass,
								studentSection:body.section,
								GRNo:body.GRNo,
								academicYear:body.academicYear,
								totaltransportFees:totalTransFees,
								totalExamFeesAmt:totalExamfees,
								studentTransportFeesForMonth:((body.transportfeesmonths)?(1*body.transportfeesmonths):0),
								studentFeesPerMonth:((body.currentYearMonthFees)?(1*body.currentYearMonthFees):0),
								studentExamFeesAmountForMonth:((body.examfees)?(1*body.examfees):0),
								rollno:(body.rollno)?body.rollno:''
		
							}

							console.log("____________________ : ",studentAcademicObj);
							//return;
		
							studentAcademicMasterService.addStudent(studentAcademicObj,(result)=>{
								console.log("+++++++++++++++++++++ : ",result)
								if(err){
									req.flash('error',err.message);
									res.redirect('/admin/students');	
								}else{
									req.flash('success',"Student academic details created successfully !");
									res.redirect('/admin/students');
								}
							})

						}

					});	
				}
			});

		
		}catch(ee){
			console.log(" master student submit fronend error : ",ee)
			req.flash('error',ee['message']);
			res.redirect('/admin/students');
		}
	};

	module.updateSubmit =async function(req, res){
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
			res.redirect('/admin/studentsAcademic');
			return;
		}
		try{
			let body =  req.body;
			let cond={
				_id:body.id
			}
			studentAcademicMasterService.getDetailsById(cond,(err,resultAcd)=>{
				if(err){
						req.flash('error',err.message);
						res.redirect('/admin/studentsAcademic');

				}
				if(!resultAcd){
					req.flash('error',"Student acacdemic details not exists");
					return res.redirect('/admin/studentsAcademic');
					
				}else{
					 studentAcademicMasterService.getDetailsById({academicYear:body.academicYear,studentMasterId:ObjectId(resultAcd.studentMasterId),_id:{'$ne':resultAcd._id}},(err,resultAcd1)=>{
					   if(err){
								req.flash('error',err.message);
								res.redirect('/admin/students');
						}
						if(resultAcd1){
							req.flash('error',"Student is already promoted for this class for this academic year");
							return res.redirect('/admin/students');
						}else{

						let currentYBal=0;
						let totalTransFees=0;
						let totalExamfees=0;
						let transportFeesMonths=[];
						let studentMonthsFees=[];
						let examMonthsFees=[];

						if(body['transportmonths']){
							if(typeof body['transportmonths'] === 'string') {
								transportFeesMonths= [body['transportmonths']];
							}else{
								transportFeesMonths=body['transportmonths'];
							}
						}

						totalTransFees=(transportFeesMonths.length)*(1*body.transportfeesmonths);

						if(body['monthly_fees']){
							if(typeof body['monthly_fees'] === 'string') {
								studentMonthsFees= [body['monthly_fees']];
							}else{
								studentMonthsFees=body['monthly_fees'];
							}
						}
						currentYBal=(studentMonthsFees.length)*(1*body.currentYearMonthFees);

						

						if(body['examfeesmonths']){
							if(typeof body['examfeesmonths'] === 'string') {
								examMonthsFees= [body['examfeesmonths']];
							}else{
								examMonthsFees=body['examfeesmonths'];
							}
						}
						totalExamfees=(examMonthsFees.length)*(1*body.examfees);

						let previousYBal = ((body.previousYearBal)?(body.previousYearBal):0);
										




						let updateData={
							$set:{
									previousYearPendingFeeAmt:previousYBal,
									admissionFeeAmt:((body.admissionFees)?(1*body.admissionFees):0),
									studentTransportMonth:transportFeesMonths,
									studentFeesForMonths:studentMonthsFees,
									studentExamFeesForMonths:examMonthsFees,
									currentYearFeeAmt:currentYBal,
									totalFeeAmt:(1*currentYBal+1*previousYBal+1*totalTransFees+1*totalExamfees+1*(body.admissionFees)),
									totalFeePaidByStudent:resultAcd.totalFeePaidByStudent,
									studentClass:body.selectClass,
									studentSection:body.section,
									GRNo:body.GRNo,
									academicYear:body.academicYear,
									totaltransportFees:totalTransFees,
									totalExamFeesAmt:totalExamfees,
									studentTransportFeesForMonth:((body.transportfeesmonths)?(1*body.transportfeesmonths):0),
									studentFeesPerMonth:((body.currentYearMonthFees)?(1*body.currentYearMonthFees):0),
									studentExamFeesAmountForMonth:((body.examfees)?(1*body.examfees):0),
									rollno:(body.rollno)?body.rollno:''
							}
						}

						console.log(" updating object : ",updateData)

						//return ;


						studentAcademicMasterService.updateStudent(cond,updateData,(err , result)=>{
							console.log("+++++++++++++++++++++ : ",result)
							if(err){
								req.flash('error',err.message);
								res.redirect('/admin/studentsAcademic');	
							}else{
								req.flash('success',"Record updated successfully !");
								res.redirect('/admin/studentsAcademic');
							}
						})
                                      } 
                                 })

			}
		});
    
		}catch(ee){
			console.log(" studentsAcademic student submit fronend error : ",ee)
			req.flash('error',ee['message']);
			res.redirect('/admin/studentsAcademic');
		}
	};


	module.studentPaidFees = function(req, res){
		try {
			let body = req.body;

			let updtobj={
				$inc:{totalFeePaidByStudent:(1*body.paidAmount)}
			}

			console.log(" updtobj updtobj  : ",updtobj)

			studentAcademicMasterService.updateStudent({_id:body.id},updtobj,(err , result)=>{
				if(err){
					console.log(" studentAcademicMasterService student edit error : ")
					req.flash('error',err.message);
					res.redirect('/admin/studentsAcademic');
				}else{

					console.log(" result result : ",result)

					let tranObj={
						studentAcademicId:body.id,
						paymentMode:body.selectMode,
						paymentType:(body.paymentType)?body.paymentType:'',
						onlineRefNo: (body.onlineRefNo)?body.onlineRefNo:'',
						feesPaid:(1*body.paidAmount),
						transactionId: helper.transactionId(31),

					}

					studentFeesTransService.addPaidFees(tranObj,(err, result)=>{
							console.log(" studentFeesTransService adding transaction : ",err)
							console.log(" studentFeesTransService result result : ",result)


							if(err){
								let updtobj={
									$inc:{totalFeePaidByStudent:-(1*body.paidAmount)}
								}
					
								studentAcademicMasterService.updateStudent({_id:body.id},updtobj,(err , result)=>{
								});
							}

							req.flash('success',"Fee paid successfully & transaction created!");
							res.redirect('/admin/studentsAcademic');
					});
				
				}
			})
		} catch (error) {
			req.flash('error',error.message);
			res.redirect('/admin/studentsAcademic');
		}

	
	
	};

	module.edit = function(req, res){
		//return ;

		let params =  req.params;
		console.log("ppppppppppppaaaaaaaaaaaaaaaaaraaaaaaammmmm : ",params)
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

					result.dob=moment(result.dob).format("MM/DD/YYYY");
					result.joiningDate=moment(result.joiningDate).format("YYYY/DD/MM");
				}
				res.render('./AdminPortal/students/studentEdit', {
					error: req.flash("error"),
					success: req.flash("success"),
					config:config,
					session: req.session,
					alias:"student_academic",
					subalias:"students_academic_list",
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

function isNumeric(value) {
	
	return !isNaN(value);
	
 }