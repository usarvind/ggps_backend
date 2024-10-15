const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
///var db = require("../../../middlewares/mongooes");

const StudentFeesTransModel = require('../../../model/studentFeesTransactionModel')

module.exports = class StudentFeesTransService {
    constructor() { }

    async addPaidFees(data, cb) {
        try {
            StudentFeesTransModel.create(data, function(err,data){
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
  


    async getDetailsById(data, cb) {
        try {

            console.log(" getDetailsById reached ",data)
            let body = data;
            StudentFeesTransModel.findOne({ _id:data._id },function(err,user){
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

    async findAndSumQuery(condition) {
        try {

            console.log(" getDetailsByCond reached ",condition)

            return await StudentFeesTransModel.aggregate([{
                $match:condition
            },{
                $group: {
                    _id: null,  // null to group all matching documents together
                    totalAmountTillPaid: { $sum: "$feesPaid" } // Calculate the sum of the "amount" field
                }
            },{
                $project:{
                    _id:0,
                    totalAmountTillPaid:1
                }
            }]);
               
        }
        catch (err) {
            console.log("=============== : ",err)
            return cb(err)
        }

    }

 /*

    async getStudentFeesTransList(condt1,condt2,condt3,limit=10,page=0, cb) {
        try {
            StudentFeesTransModel.aggregate([{
                $sort:{createdAt:-1}
            },
            {
                $match:condt1
            },
            {
                $lookup:{
                    from: 'studentsAcademicMaster', 
                    localField: 'studentAcademicId', 
                    foreignField: '_id', 
                    as: 'studentAcData' 
                }
            },
            { $unwind: { path: '$studentAcData', preserveNullAndEmptyArrays: false } },		
            {
                $match:condt2
            },
            {
                $lookup:{
                    from: 'studentsMaster', 
                    localField: 'studentAcData.studentMasterId', 
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
                "$match":condt3
            },
            { $skip: parseInt(page * limit) }, 
			{ $limit: parseInt(limit) },
            {
                $project: {
                   _id:1,
                   firstName:"$studentData.firstName",
                   lastName:"$studentData.lastName",
                   gender:"$studentData.gender",
                   dob:"$studentData.dob",
                   fatherName:"$studentData.fatherName",
                   fatherMobileNo:"$studentData.fatherMobileNo",
                   studentImage:"$studentData.studentImage",
                   studentClass:"$studentAcData.studentClass",
                   feesAmount:"$feesPaid",
                   transactionDate:"$createdAt",
                   transactionId:1,
                   onlineRefNo:1,
                   studentAcademicId:"$studentAcademicId",
                   
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
    */


       async getStudentFeesTransList(condt1,condt2,condt3,limit,page, cb) {
        try {
            StudentFeesTransModel.aggregate([{
                $sort:{createdAt:-1}
            },
            {
                $match:condt1
            },
            {
                $lookup:{
                    from: 'studentsAcademicMaster', 
                    localField: 'studentAcademicId', 
                    foreignField: '_id', 
                    as: 'studentAcData' 
                }
            },
            { $unwind: { path: '$studentAcData', preserveNullAndEmptyArrays: false } },		
            {
                $match:condt2
            },
            {
                $lookup:{
                    from: 'studentsMaster', 
                    localField: 'studentAcData.studentMasterId', 
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
                "$match":condt3
            },
            // Stage to count total records
        {
            $facet: {
                metadata: [
                    { $count: 'totalCount' }
                ],
                totalFeesCollect: [
                    { $group: { _id: null, totalAmount: { $sum: "$feesPaid" } } }
                ],
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: parseInt(page) },
                    { $limit: parseInt(limit) },
                    {
                        $project: {
                            _id: 1,
                            firstName: "$studentData.firstName",
                            lastName: "$studentData.lastName",
                            gender: "$studentData.gender",
                            dob: "$studentData.dob",
                            fatherName: "$studentData.fatherName",
                            fatherMobileNo: "$studentData.fatherMobileNo",
                            studentImage: "$studentData.studentImage",
                            studentClass: "$studentAcData.studentClass",
                            feesAmount: "$feesPaid",
                            transactionDate: "$createdAt",
                            transactionId: 1,
                            onlineRefNo: 1,
                            studentAcademicId: "$studentAcademicId"
                        }
                    }
                ]
            }
        },
        // Stage to format the result
        {
            $project: {
                totalCount: { $arrayElemAt: ["$metadata.totalCount", 0] },
                data: 1,
                totalFeesCollect:1
            }
        }
    ], function (err, result) {
        if (err) {
            return cb(err);
        } else {

            // console.log(" DEV ARV ", result)
           
            // Format the result
            const totalCount = result.length > 0 && result[0].totalCount ? result[0].totalCount : 0;
            //console.log("DEVELOP : "+totalCount)
            const data = result.length > 0 ? result[0].data : [];
            const totalFeesCollect = result.length > 0 && result[0].totalFeesCollect.length > 0 ? result[0].totalFeesCollect[0].totalAmount : 0;
            return cb(null, { totalCount, data, totalFeesCollect});
        }
    });

        } catch (err) {
            return cb(err)

        }
    }

    async getSpaceficStudentFeesTransList(data, cb) {
        try {
            StudentFeesTransModel.aggregate([{
                $sort:{createdAt:-1}
            },
            {
                $lookup:{
                    from: 'studentsAcademicMaster', 
                    localField: 'studentAcademicId', 
                    foreignField: '_id', 
                    as: 'studentAcData' 
                }
            },
            { $unwind: { path: '$studentAcData', preserveNullAndEmptyArrays: false } },		
            {
                "$match":data ,
            },
            {
                $lookup:{
                    from: 'studentsMaster', 
                    localField: 'studentAcData.studentMasterId', 
                    foreignField: '_id', 
                    as: 'studentData' 
                }
            },
            { $unwind: { path: '$studentData', preserveNullAndEmptyArrays: false } },	
            
            {
                $project: {
                   _id:1,
                   firstName:"$studentData.firstName",
                   lastName:"$studentData.lastName",
                   gender:"$studentData.gender",
                   dob:"$studentData.dob",
                   fatherName:"$studentData.fatherName",
                   fatherMobileNo:"$studentData.fatherMobileNo",
                   studentImage:"$studentData.studentImage",
                   studentClass:"$studentAcData.studentClass",
                   feesAmount:"$feesPaid",
                   studentAcadmicId:"$studentAcData._id",
                   transactionDate:"$createdAt",
                   transactionId:1,
                   onlineRefNo:1,
                   
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


     async getSpaceficStudentPaidFeesTranDetails(condst={},condsa={},condsm={}, cb) {
        try {
            console.log(condst);
            console.log(condsa);
            console.log(condsm);

           // return;


            StudentFeesTransModel.aggregate([{
                $match:condst
            },
            {
                $lookup:{
                    from: 'studentsAcademicMaster', 
                    localField: 'studentAcademicId', 
                    foreignField: '_id', 
                    as: 'studentAcData' 
                }
            },
            { $unwind: { path: '$studentAcData', preserveNullAndEmptyArrays: false } },		
            {
                "$match":condsa ,
            },
            {
                $lookup:{
                    from: 'studentsMaster', 
                    localField: 'studentAcData.studentMasterId', 
                    foreignField: '_id', 
                    as: 'studentData' 
                }
            },
            { $unwind: { path: '$studentData', preserveNullAndEmptyArrays: false } },	
            {
                $match:condsm
            },
            {
                $project: {
                   _id:1,
                   firstName:"$studentData.firstName",
                   lastName:"$studentData.lastName",
                   gender:"$studentData.gender",
                   dob:"$studentData.dob",
                   tranDate:"$studentData.createdAt",
                   fatherName:"$studentData.fatherName",
                   motherName:"$studentData.motherName",
                   fatherMobileNo:"$studentData.fatherMobileNo",
                   studentImage:"$studentData.studentImage",
                   studentClass:"$studentAcData.studentClass",
                   feesAmount:"$feesPaid",
                   studentAcadmicId:"$studentAcData._id",
                   transactionDate:"$createdAt",
                   transactionId:1,
                   onlineRefNo:1,
                   rollno:"$studentAcData.rollno",
                   academicYear:"$studentAcData.academicYear",
                   totalFeeAmt:"$studentAcData.totalFeeAmt",
                   totalFeePaidByStudent:"$studentAcData.totalFeePaidByStudent",

                   admissionFeeAmt:"$studentAcData.admissionFeeAmt",
                   previousYearAmt:"$studentAcData.previousYearPendingFeeAmt",
                   studentFeesForMonths:"$studentAcData.studentFeesForMonths",
                   studentTransportMonth:"$studentAcData.studentTransportMonth",
                   studentExamFeesForMonths:"$studentAcData.studentExamFeesForMonths",
                   studentFeesPerMonth:"$studentAcData.studentFeesPerMonth",
                   studentTransportFeesForMonth:"$studentAcData.studentTransportFeesForMonth",
                   studentExamFeesAmountForMonth:"$studentAcData.studentExamFeesAmountForMonth",
               

                   
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
