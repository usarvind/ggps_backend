let StudentMasterService = require('../../../microservicesList/adminMicroservice/serviceList/studentMasterService');
let studentMasterService = new StudentMasterService();
let StudentAcademicMasterService = require('../../../microservicesList/adminMicroservice/serviceList/studentAcademicMasterService');
let studentAcademicMasterService = new StudentAcademicMasterService();

let SubjectMasterService = require('../../../microservicesList/adminMicroservice/serviceList/subjectMasterService');
let subjectMasterService = new SubjectMasterService();

const { validationResult } = require('express-validator');
const moment = require('moment-timezone');
const path = require('path');
const { result } = require('lodash');

let helper = require('../../helper/helpers');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

moment.tz.setDefault("Asia/Kolkata");

module.exports = function(){
	
	var module = {};
	const config = require('../../config/constants');


	

	module.showModal = async function(req, res){

        let body = req.body;
        console.log("---------------------------- : i am here ")
        let condData = JSON.parse(body.data);
        console.log("---------------------------- : i am here ",condData)
        let finalObject={
            error:null
        }
        if(body.modalType=='promote_modal'){
            finalObject['modal_type']='promote_modal';
            finalObject['data'] =condData;
            finalObject.error==null;

            let years =[];
            for(let y=2010;y<=2250;y++){
                years.push(y)
            }

            let cdate= new Date();
            let cyear = cdate.getFullYear();

            finalObject['data']['years']=years;
            finalObject['data']['cyear']=cyear;
            finalObject['data']['classes']= await helper.getAllClassList();
            finalObject['data']['academic_months']= await helper.getAllTransMonthList();
            

            return res.render('./AdminPortal/modal/show-modal', {
                config:config,
                modalData:finalObject
            });

        }else if(body.modalType=='update_academic_student_modal'){
            finalObject['modal_type']='update_academic_student_modal';
            let years =[];
            for(let y=2010;y<=2250;y++){
                years.push(y)
            }



            studentAcademicMasterService.getDetailsById({_id:condData.id},async function(err,result){
                if(err){
                    finalObject.error=err.message;
                }
                finalObject['data'] =result;
                finalObject['data']['years']=years;
                finalObject['data']['classes']= await helper.getAllClassList();
                finalObject['data']['academic_months']= await helper.getAllTransMonthList();

                return res.render('./AdminPortal/modal/show-modal', {
                    config:config,
                    modalData:finalObject
                });
            })
        }else if(body.modalType=='student_fees_payment_modal'){
            finalObject['modal_type']='student_fees_payment_modal';
            finalObject['data'] =condData;
            finalObject.error==null;
            console.log("ffffffffffinal reach : ",finalObject)
            return res.render('./AdminPortal/modal/show-modal', {
                config:config,
                modalData:finalObject
            });
        
        }else if(body.modalType=='student_marksupload_modal'){
            finalObject['modal_type']='student_marksupload_modal';
            finalObject['data'] =condData;
            finalObject.error==null;
            console.log("ffffffffffinal reach : ",finalObject)

            studentAcademicMasterService.getStudentsDetailsById({_id:ObjectId(condData.id)},async function(err,result){
                if(err){
                    finalObject.error=err.message;
                    return res.render('./AdminPortal/modal/show-modal', {
                        config:config,
                        modalData:finalObject
                    });
                }else{
                    finalObject['data'] =((result.length>0)?(result[0]):{});
                    if(result.length>0){
                        // let cond={
                        //     selectClass:result[0].studentClass
                        // }
                        // subjectMasterService.getDetailsByData(cond,(err,subjectList)=>{
                        //     if(err){
                        //         finalObject['subjectList']={};
                        //         return res.render('./AdminPortal/modal/show-modal', {
                        //             config:config,
                        //             modalData:finalObject
                        //         });
                        //     }
                        //     finalObject['subjectList']=subjectList;
                        //     return res.render('./AdminPortal/modal/show-modal', {
                        //         config:config,
                        //         modalData:finalObject
                        //     });
                        // });	

                        return res.render('./AdminPortal/modal/show-modal', {
                            config:config,
                            modalData:finalObject
                        });
                        
                    }else{
                        finalObject.error="There is no record.";
                        return res.render('./AdminPortal/modal/show-modal', {
                            config:config,
                            modalData:finalObject
                        });
                    }
                   
                }
               
            })
        }
        
        else{
            return res.render('./AdminPortal/modal/show-modal', {
                config:config,
                modalData:finalObject
            });
        }
		//return ;
        
		
	};


	return module;
}

