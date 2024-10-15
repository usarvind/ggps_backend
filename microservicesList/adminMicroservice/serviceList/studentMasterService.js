const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
///var db = require("../../../middlewares/mongooes");

const StudentMasterModel = require('../../../model/studentMasterModel')

module.exports = class StudentMasterService {
    constructor() { }

    async addStudent(data, cb) {
        try {
            StudentMasterModel.create(data, function(err,data){
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
  

    async updateStudent(data, cb) {
        try {
            let query={
                _id:data._id
            };
            let updateData=data;
            delete updateData['_id'];
        
            StudentMasterModel.findOneAndUpdate(query, { $set: updateData }, async function (err, result) {
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

    async getDetailsById(data, cb) {
        try {

            console.log(" updateStudent reached ",data)
            let body = data;
            StudentMasterModel.findOne({ _id:data._id },function(err,user){
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

    async deleteStudentById(data, cb) {
        try {

            console.log(" updateStudent reached ",data)
            let body = data;
            StudentMasterModel.deleteOne({ _id:data._id }, function(err,result){
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

    async getStudentMasterList(data,limit=10,page=0, cb) {
        try {
            //console.log(" page  : "+page+" limit : "+limit)
            StudentMasterModel.aggregate([{
                $sort:{createdAt:-1}
            },
            {
                "$addFields":{
                    fullname:{$concat:['$firstName',' ','$lastName']}
                }
            },
            {
                "$match": data
            },
            { $skip: parseInt(page * limit) }, 
			{ $limit: parseInt(limit) },
            {
                $project: {
                   //row:"$$ROOT",
                   _id:1,
                   firstName:1,
                   lastName:1,
                   gender:1,
                   dob:1,
                   joiningDate:1,
                   fatherName:1,
                   fatherMobileNo:1,
                   studentImage:1,
                   isAccountDeactive:1,
                   isTCCreated:1,
                   currentClass:1,
                   regNo:1,

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
