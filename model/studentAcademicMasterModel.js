const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
const db = require('../middlewares/mongooes');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const Joi = require('@hapi/joi');
var crypto = require('crypto');
const { number, boolean, string } = require('joi');
const { stubTrue } = require('lodash');

const studentSchema = new Schema({
    studentMasterId:{type: Schema.Types.ObjectId , required:true},
    studentClass:{
        type:String,
        required:true
    },
    GRNo:{
        type:String,
        default:""
    },
    academicYear:{
        type:String,
        default:""
    },
    studentSection:{
        type:String,
        default:""
    },

    rollno:{
        type:String,
        default:""
    },

    previousYearPendingFeeAmt:{
        type:Number,
        default:0
    },
    totaltransportFees:{
        type:Number,
        default:0
    },
    currentYearFeeAmt:{
        type:Number,
        required:true
    },
    totalExamFeesAmt:{
        type:Number,
        required:true
    },
    totalFeeAmt:{
        type:Number,
        required:true
    },

    admissionFeeAmt:{
        type:Number,
        default:0,
        required:true
    },

    totalFeePaidByStudent:{
        type:Number,
        required:true
    },
    resultData:[{
       justForGrade:{ type:Boolean, default:false},
       subjectSequence:{ type:Number, default:1},
       subjectName:{ type:String, default:''},
       subjectKey:{ type:String, default:''},
       halfYearMarkMM:{ type:String, default:''},
       halfYearMarkMO:{ type:String, default:''},
       halfYearMarkMO2:{ type:String, default:''},

       halfYearTotMark:{ type:String, default:''},
       halfYearTotMarkObtainSubject:{ type:String, default:''},
       halfYearSubjectGrade:{ type:String, default:''},

       yearMarkMM:{ type:String, default:''},
       yearMarkMO:{ type:String, default:''},
       yearMarkMO2:{ type:String, default:''},
       yearTotMarkObtainSubject:{ type:String, default:''},
       yearSubjectGrade:{ type:String, default:''},

       totalSubjectMark:{ type:Number, default:0},
       totalMarkObtainSubject:{ type:Number, default:0},
       finalSubjectWiseGrade:{ type:String, default:''},

    }],

    halfYearTotalCalData:{
        studentOverallPerct:{
            type:Number,
            default:0,
        },
        studentTotalMark:{
            type:Number,
            default:100,
        },
        studentTotalMarkObtain:{
            type:Number,
            default:100,
        },
        studentOverallGrade:{
            type:String,
            default:'',
        },
    },

    annualYearTotalCalData:{
        studentOverallPerct:{
          type:String,
            default:'',
        },
        studentTotalMark:{
            type:Number,
            default:100,
        },
        studentTotalMarkObtain:{
            type:Number,
            default:100,
        },
        studentOverallGrade:{
            type:String,
            default:'',
        },
    },

    finalYearlyTotalCalData:{
        studentOverallPerct:{
            type:Number,
            default:0,
        },
        studentTotalMark:{
            type:Number,
            default:100,
        },
        studentTotalMarkObtain:{
            type:Number,
            default:100,
        },
        studentOverallGrade:{
            type:String,
            default:'',
        },
    },



    studentAttendencePerct:{
        type:Number,
        default:100,
    },

    studentTransportMonth:{
        type: Array, default:[]
    },
    studentTransportFeesForMonth:{
        type:Number,
        default:0,
        required:true,
    },

    studentFeesForMonths:{
        type: Array, default:[]
    },
    studentFeesPerMonth:{
        type:Number,
        default:0,
        required:true,
        
    },
    isHalfYealy:{
        type: Boolean,
        default:false
    },
    isYealy:{
        type: Boolean,
        default:false
    },

    studentExamFeesForMonths:{
        type: Array, default:[]
    },
    studentExamFeesAmountForMonth:{
        type:Number,
        default:0,
        required:true,
        
    },
    isDeleted:{ type:Boolean, default:false},
    updatedAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
    createdAt: { 
        type: Number, 
        default: () => moment().valueOf() 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'],
        default: 'active' 
    },
   
}, { collection: 'studentsAcademicMaster' });


// we need to create a model using it
module.exports = db.commonDb.model('studentsAcademicMaster', studentSchema);