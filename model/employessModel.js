var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var db = require("../middlewares/mongooes");
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");

var employessSchema = new Schema({
    empCode: {
        type: String,
        required: true,
        unique: true
    },
    emailID: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: false,
        enum: ["employee", "admin","supervisor"],
        default: "employee",
    },
    processName: {
        type: String,
        required: false
    },
    group: {
        type: String,
        required: false,
        enum: ["BROGroup", "AgentGroup", "THDGroup", "AQSCentreGroup","SiteEngineerGroup"],
    },
    showInList: {
        type: Boolean,
        default: true
    },
   ipAddress: {
        type: String
    },
    timezone : {
        type: String,
        default: function () {
            return this.country == "India" ? 'Asia/Kolkata' : 'Asia/Bangkok';
        }
    },
    country: { type: String, default: 'India'},
    extractData: {
        type: Boolean,
        default: false
    },
    sessionToken: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Number,
        default: () => moment().valueOf()
    },
    updatedAt: {
        type: Number,
        default: () => moment().valueOf()
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
    modifiedBy: {
        type: Schema.Types.ObjectId
    }
});

employessSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

/////// method for comparing and validating password//////////////////

employessSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = db.commonDb.model("employee", employessSchema);