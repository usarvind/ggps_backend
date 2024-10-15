const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
const db = require('../middlewares/mongooes');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const Joi = require('@hapi/joi');
var crypto = require('crypto');
const { number } = require('joi');

const subjectSchema = new Schema({
    subjectName: {
        type: String,
        default:"",
    },
    subjectKey: {
        type: String,
        default:"",
    },
    selectClass:{
        type: String,
        required:true
    },
    subjectJustForGrade:{
        type:Boolean,
        required:false
    },
    subjectSequence:{
        type:Number,
        default:1
    },

    updatedAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
    createdAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
   
}, { collection: 'subjectsMaster' });


// we need to create a model using it
module.exports = db.commonDb.model('subjectsMaster', subjectSchema);