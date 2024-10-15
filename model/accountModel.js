const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../middlewares/mongooes');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");

// create a schema
const accountSchema = new Schema({
    accountId: {type: String, required: true, unique: true},
    accountName: {type: String, required: true},
    accountType: {
        type: String,
        required: true,
        //enum: ['Corporate', 'Individual', 'Fleet', 'NA'],
        default: 'NA'
    },
    usage: {
        type: String,
        required: true,
        // enum: ['Private', 'Commercial'],
        default: 'NA'
    },
    addressLine1: String,
    pinCode: {type: String, required: true},
    state: {type: String},
    district: {type: String, required: true},
    city: {type: String},
    village: {type: String},
    emailId: {type: String},
    mobileNumber: {type: String, unique: true, required: true},
    ownerName: {type: String},
    fleetManagerDetails: {
        fleetManagerFullName: {type: String},
        fleetManagerMobileNumber: {type: String},
        fleetManagerEmailId: {type: String},
    },
    branches: [
        {
            branchName: {type: String, required: true},
            branchLocation: {type: String, required: true},
            branchAddressLine1: {type: String, required: true},
            branchPinCode: {type: String, required: true},
            branchState: {type: String},
            branchDistrict: {type: String, required: true},
            branchCity: {type: String, required: true},
            branchVillage: {type: String},
            branchInchargeName: {type: String, required: true},
            branchInchargeMobileNumber: {type: String, required: true},
            branchInchargeEmailId: {type: String},
            //default Fields
            isDeleted: {type: Boolean, default: false},
            addedAt: {type: Number, default: () => moment().valueOf()},
            updatedAt: {type: Number, default: () => moment().valueOf()},
            modifiedBy: {type: Schema.Types.ObjectId},
            createdBy: {type: Schema.Types.ObjectId},
            branchInchargeName2: {type: String},
            branchInchargeMobileNumber2: {type: String},
            branchInchargeName3: {type: String},
            branchInchargeMobileNumber3: {type: String},
            
            validated : { type:Boolean},   //for data Sanitization
            apolloCustomer :{ type:Boolean}, //for data Sanitization 
            lastValidatedDateTime :{type: Number, default: () => moment().valueOf()}, //for data Sanitization
            validateCount : {type: Number}, //for data Sanitization
            validatedBy  : {type: Schema.Types.ObjectId}, //for data Sanitization
            validatedByModel : { 
                type: String, 
                enum: ["employee", "admins", "dealerMasters", "cseMaster","ABUMaster","oemMasters"]
            }, //for data Sanitization
        }
    ],
    timezone : {
        type: String,
        default: function () {
            return this.country == "India" ? 'Asia/Kolkata' : 'Asia/Bangkok';
        }
    },
    country: { type: String, default: 'India'},
    //default Fields
    modifiedBy: {type: Schema.Types.ObjectId},
    accountSource: {type: String, required: true, default: "crmapp", enum: ["crmapp"]},  //------In PV app add as string-pvapp
    createdBy: {type: Schema.Types.ObjectId, required: true},
    isDeleted: {type: Boolean, default: false},
    addedAt: {type: Number, default: () => moment().valueOf()},
    updatedAt: {type: Number, default: () => moment().valueOf()},

    validated : { type:Boolean},   //for data Sanitization
    apolloCustomer :{ type:Boolean}, //for data Sanitization 
    lastValidatedDateTime :{type: Number, default: () => moment().valueOf()}, //for data Sanitization
    validateCount : {type: Number}, //for data Sanitization
    validatedBy  : {type: Schema.Types.ObjectId}, //for data Sanitization
    validatedByModel : { 
        type: String, 
        enum: ["employee", "admins", "dealerMasters", "cseMaster","ABUMaster","oemMasters"]
    }, //for data Sanitization

});
// accountSchema.virtual('contactListRef', {
//     ref: 'users', // The model to use
//     localField: 'accountId', // Find people where `localField`
//     foreignField: 'accountId', // is equal to `foreignField`
//     // If `justOne` is true, 'members' will be a single doc as opposed to
//     // an array. `justOne` is false by default.
//     justOne: false,
//   });
accountSchema.virtual('contactCountRef', {
    ref: 'users', // The model to use
    localField: 'accountId', // Find people where `localField`
    foreignField: 'accountId', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false,
    count: true
});
//history model
var diffHistory = require("../utils/diffHistory").plugin;
// accountSchema.plugin(diffHistory);
accountSchema.index({ title: "text" }, { name: "TextIndex" });
const mongoosePlugin = require("../utils/mongoose-plugin");
// accountSchema.plugin(mongoosePlugin);
// we need to create a model using it
module.exports = db.commonDb.model('accounts', accountSchema);