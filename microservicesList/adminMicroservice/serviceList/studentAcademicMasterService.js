const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
///var db = require("../../../middlewares/mongooes");

const StudentAcademicMasterModel = require('../../../model/studentAcademicMasterModel')

module.exports = class StudentMasterService {
    constructor() { }

    async addStudent(data, cb) {
        try {
            StudentAcademicMasterModel.create(data, function(err,data){
                if(err){
                    return cb(err)
                }
                return cb(null,data);
            })
        } catch (err) {
            console.log(" student add time error : ",err)
            return cb(err)
        }
    }
  

    async updateStudent(condition,updateData, cb) {
        try {
        
            StudentAcademicMasterModel.findOneAndUpdate(condition, updateData , async function (err, result) {
                if (err){
                    return cb(err)
                }else{
                    return cb(null,result)
                }
            })
        } catch (err) {
            console.log(" student master update details err : ",err)
            return cb(err)
            
        }
    }

    async getDetailsById(cond={}, cb) {
        try {

            console.log(" getDetailsById reached ",cond)
           
            StudentAcademicMasterModel.findOne(cond,function(err,user){
                if(err){
                    return cb(err)
                }
                return cb(null,user)
            });
               
        }
        catch (err) {
            console.log("=============== : ",err)
            return cb(err)
        }

    }
    async getStudentsDetailsById(cond={}, cb) {
        try {
            StudentAcademicMasterModel.aggregate([{
              "$match":cond
            },
            {
                $lookup:{
                    from: 'studentsMaster', 
                    localField: 'studentMasterId', 
                    foreignField: '_id', 
                    as: 'studentData' 
                }
            },
            { $unwind: { path: '$studentData', preserveNullAndEmptyArrays: false } },		
            {
                "$match": {
                }
            },
            
            {
                $project: {
                   _id:1,
                   firstName:"$studentData.firstName",
                   lastName:"$studentData.lastName",
                   fullname:{$concat:['$studentData.firstName',' ','$studentData.lastName']},
                   gender:"$studentData.gender",
                   dob:"$studentData.dob",
                   joiningDate:"$studentData.joiningDate",
                   fatherName:"$studentData.fatherName",
                   motherName:"$studentData.motherName",
                   fatherMobileNo:"$studentData.fatherMobileNo",
                   studentImage:"$studentData.studentImage",
                   studentClass:"$studentClass",
                   studentSection:"$studentSection",
                   academicYear:"$academicYear",
                   studentPaidFeeByStudent:"$totalFeePaidByStudent",
                   totalFeeAmt:"$totalFeeAmt",
                   currentYearAmt:"$currentYearFeeAmt",
                   previousYearAmt:"$previousYearPendingFeeAmt",
                   presentAddress:"$studentData.parentAddress",
                   permanentAddress: "$studentData.parentPermanentAddress",
                   GRNo:"$GRNo",
                   studentExamFeesAmountForMonth:1,
                   studentExamFeesForMonths:1,
                   studentFeesPerMonth:1,
                   studentFeesForMonths:1,
                   studentTransportFeesForMonth:1,
                   studentTransportMonth:1,
                   admissionFeeAmt:1,
                   isHalfYealy:{$ifNull: ["$isHalfYealy", false]},
                   isYealy:{$ifNull: ["$isYealy", false]},
                   resultData:{$ifNull: ["$resultData", []]},

                   halfYearTotalCalData:"$halfYearTotalCalData",
                   finalYearlyTotalCalData:"$finalYearlyTotalCalData",
                   annualYearTotalCalData:"$annualYearTotalCalData",
                   studentAttendencePerct:"$studentAttendencePerct",
                   rollno:"$rollno",
                   
                }
            }]
            , function (err, studentMasterData) {
                if (err) {
                    return cb(err)

                } else {
                    return cb(null,studentMasterData)
                }
            })
        } catch (err) {
            return cb(err)

        }
    }
    async deleteStudentById(data, cb) {
        try {

            console.log(" updateStudent reached ",data)
            let body = data;
            StudentAcademicMasterModel.deleteOne({ _id:data._id }, function(err,result){
                if(err){
                    return cb(err)
                }
                return cb(null,result)
            })
        }
        catch (err) {
            console.log("=============== : ",err)
            return cb(err)
        }

    }

    async getStudentAcademicMasterList(condt1={},condt2={},limit=10,page=0, cb) {
        try {
            StudentAcademicMasterModel.aggregate([{
                $sort:{createdAt:-1}
            },
            {
                $match:condt1
            },
            {
                $lookup:{
                    from: 'studentsMaster', 
                    localField: 'studentMasterId', 
                    foreignField: '_id', 
                    as: 'studentData' 
                }
            },
            { $unwind: { path: '$studentData', preserveNullAndEmptyArrays: false } },	
            {
                "$addFields":{
                    fullname:{$concat:['$studentData.firstName',' ','$studentData.lastName']}
                }
            },
            {
                "$match": condt2
            },
            { $skip: parseInt(page * limit) }, 
			{ $limit: parseInt(limit) },
            {
                $project: {
                   _id:1,
                   fullname:1,
                   firstName:"$studentData.firstName",
                   lastName:"$studentData.lastName",
                   gender:"$studentData.gender",
                   dob:"$studentData.dob",
                   joiningDate:"$studentData.joiningDate",
                   fatherName:"$studentData.fatherName",
                   fatherMobileNo:"$studentData.fatherMobileNo",
                   studentImage:"$studentData.studentImage",
                   studentClass:"$studentClass",
                   studentPaidFeeByStudent:"$totalFeePaidByStudent",
                   totalFeeAmt:"$totalFeeAmt",
                   admissionFeeAmt:"$admissionFeeAmt",
                   currentYearFeeAmt:"$currentYearFeeAmt",
                   previousYearAmt:"$previousYearPendingFeeAmt",
                   totaltransportFees:"$totaltransportFees",
                   totalExamFeesAmt:"$totalExamFeesAmt",
                   createdAt:"$createdAt",
                   GRNo:"$GRNo",
                   academicYear:"$academicYear",
                   studentFeesForMonths:"$studentFeesForMonths",
                   studentTransportMonth:"$studentTransportMonth",
                   studentExamFeesForMonths:"$studentExamFeesForMonths",
                   studentFeesPerMonth:"$studentFeesPerMonth",
                   studentExamFeesAmountForMonth:"$studentExamFeesAmountForMonth",
                   studentTransportFeesForMonth:"$studentTransportFeesForMonth",
                   
                   
                }
            }]
            , function (err, studentMasterData) {
                if (err) {
                    return cb(err)

                } else {
                    return cb(null,studentMasterData)
                }
            })
        } catch (err) {
            return cb(err)

        }
    }

}
