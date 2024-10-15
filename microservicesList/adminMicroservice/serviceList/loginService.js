const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
///var db = require("../../../middlewares/mongooes");

const AdminLoginModel = require('../../../model/adminModel')

module.exports = class AdminLoginService {
    constructor() { 
        AdminLoginModel.findOne({}).then((result)=>{
            if(!result){
                let adminData={
                    firstName:" School",
                    lastName:" Management",
                    mobileNumber:"9767534284",
                    email:"admin@gmail.com",
                    address:"Saraikalidas",
                    state:"UTTER PRADESH",
                    city:"JAUNPUR",
                    pincode:"222161",
                    password:"gayatrigps@9876"
                }
                AdminLoginModel.create(adminData, function(err,retResult){
                    console.log(" Created Admin")
                });
            }
        })
    }
    async addAdmin(data, cb) {
        try {
            AdminLoginModel.create(data,function(err,data){
                if(err){
                    return cb(err) 
                }
                return cb(null,data)

            })
               
        } catch (err) {
            return cb(err)
        }
    }
    async adminLogin(cond={}, cb) {
        try {

            console.log(" login server here reached ",cond)
            let body = cond;
            AdminLoginModel.findOne(cond,function(err,user){
                if(err){
                    return cb(err)
                }
                return cb(null,user)
            })
                
        }
        catch (err) {
            console.log("=============== : ",err)
            return cb(err)
        }

    }

    async updatePassword(data, cb) {
        try {
            let query={
                '_id':data._id
            };
            let updateData=data;
            delete updateData['_id'];

            AdminLoginModel.findOneAndUpdate(query, { $set: updateData }, async function (err, result) {
                if (err) return cb(err)
                else return cb(null, "Password updated successfully")
                // add logic to send email to user of password update
            })
        } catch (err) {
            return cb(err)
        }
    }

}
