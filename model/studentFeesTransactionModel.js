const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
const db = require('../middlewares/mongooes');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const Joi = require('@hapi/joi');
var crypto = require('crypto');
const { number } = require('joi');
const { stubTrue } = require('lodash');

const studentSchema = new Schema({
    studentAcademicId:{type: Schema.Types.ObjectId , required:true},
    paymentMode:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        default:""
    },
    onlineRefNo:{
        type:String,
        default:""
    },
    feesPaid:{
        type:Number,
        required:true
    },

    transactionId:{
        type:String,
        required:true
    },
    status: { 
        type: String, 
        enum: ['Success', 'Pending','Failed'],
        default: 'Success' 
    },

    updatedAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
    createdAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
  
   
}, { collection: 'studentFeesPaidMaster' });


// we need to create a model using it
module.exports = db.commonDb.model('studentFeesPaidMaster', studentSchema);