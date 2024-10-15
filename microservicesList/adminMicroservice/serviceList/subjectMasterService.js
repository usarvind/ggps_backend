const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
///var db = require("../../../middlewares/mongooes");

const SubjectMasterModel = require('../../../model/subjectMasterModel')

module.exports = class SubjectMasterService {
    constructor() { }

    async addSubject(data, cb) {
        try {
            SubjectMasterModel.create(data, function(err,data){
                if(err){
                    return cb(err)
                }
                return cb(null,data);
            })
        } catch (err) {
            console.log(" Subject add time error : ",err)
            return cb(err)
        }
    }
  

    async updateSubject(data, cb) {
        try {
            let query={
                _id:data._id
            };
            let updateData=data;
            delete updateData['_id'];
        
            SubjectMasterModel.findOneAndUpdate(query, { $set: updateData }, async function (err, result) {
                if (err){
                    return cb(err)
                }else{
                    return cb(null,result)
                }
            })
        } catch (err) {
            console.log(" Subject master update details err : ",err)
            return cb(err)
            
        }
    }

    async getDetailsById(data, cb) {
        try {

            console.log(" updateSubject reached ",data)
            let body = data;
            SubjectMasterModel.findOne({ _id:data._id },function(err,user){
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
    async getDetailsByData(cond={}, cb) {
        try {

            console.log(" getDetailsByData ",cond)
            SubjectMasterModel.find(cond,function(err,user){
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

    async getDetailsByCondData(cond={}, cb) {
        try {

            console.log(" getDetailsByData ",cond)
            SubjectMasterModel.aggregate([{
                $match:cond
            },{
                $project:{
                    _id:1,
                    subjectName:1,
                    subjectKey:1,
                    selectClass:1,
                    subjectJustForGrade:{$ifNull: ["$subjectJustForGrade", false]},
                    subjectSequence:{$ifNull: ["$subjectSequence", 0]},
                    updatedAt:1,
                    createdAt:1,
                }
            }],function(err,user){
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

    async deleteSubjectById(data, cb) {
        try {

            console.log(" updateSubject reached ",data)
            let body = data;
            SubjectMasterModel.deleteOne({ _id:data._id }, function(err,result){
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

    async getSubjectMasterList(data,limit=10,page=0, cb) {
        try {
            //console.log(" page  : "+page+" limit : "+limit)
            SubjectMasterModel.aggregate([{
                $sort:{createdAt:-1}
            },
           
            {
                "$match": data
            },
            { $skip: parseInt(page * limit) }, 
			{ $limit: parseInt(limit) },
            {
                $project: {
                   _id:1,
                   subjectName:1,
                   subjectKey:1,
                   selectClass:1,
                   subjectJustForGrade:1,
                   subjectSequence:1,
                   updatedAt:1,
                   createdAt:1,
                  
                }
            }]
            , function (err, SubjectMasterData) {
                if (err) {
                    return cb(err)

                } else {
                    return cb(null,SubjectMasterData)
                }
            })
        } catch (err) {
            return cb(err)

        }
    }

}
