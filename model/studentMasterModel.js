const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
const db = require('../middlewares/mongooes');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const Joi = require('@hapi/joi');
var crypto = require('crypto');
const { number } = require('joi');

const studentSchema = new Schema({
    firstName: {
        type: String,
        default:"",
    },
    lastName: {
        type: String,
        default:"",
    },
    regNo:{
        type: String,
       required:true,
    },
    currentClass:{
        type: String,
        default:"",
    },
    IdType: {
        type: String,
        default:"",
        enum:["Aadhar","Pencard","Driving Lience",""]
    },
    IdNo: {
        type: String,
        default:"",
    },
    gender:{
        type:String,
        enum:["Male","Female","Intersex"],
        default:"Male"
    },
    dob:{
        type:Number,
        //required:true
    },
    religion:{
        type:String,
        default:""
    },
    caste:{
        type:String,
        default:""
    },
    subcaste:{
        type:String,
        default:""
    },

    joiningDate:{
        type:Number,
        //required:true
    },
    mobileNo: { 
        type: String, 
        //required: true 
        default:""
    },
   
    email: { 
        type: String, 
        default:""
    },
    studentImage: { 
        type: String, 
        default:""
    },
    fatherName: { 
        type: String,
        
        default:"",
    },
    fatherOccupation: { 
        type: String,
        default:"" 
    },
    fatherMobileNo: { 
        type: String,
        
        default:"",
    },
    fatherEmailID: { 
        type: String,
        default:""
    },
    motherName: { 
        type: String,
        
        default:"",
    },
    motherOccupation: { 
        type: String,
        default:""
    },
    motherMobileNo: { 
        type: String,
        default:""
    },
    motherEmailID: { 
        type: String,
        default:""
    },
    parentAddress: { 
        type: String,
        
        default:"",
    },
    parentPermanentAddress: { 
        type: String,
        default:"",
    },
    updatedAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
    createdAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
    isDeleted:{ type:Boolean, default:false},
    isAccountDeactive:{ type:Boolean, default:false},
    isTCCreated:{ type:Boolean, default:false},

   
}, { collection: 'studentsMaster' });


// we need to create a model using it
module.exports = db.commonDb.model('studentsMaster', studentSchema);