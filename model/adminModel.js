const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
const db = require('../middlewares/mongooes');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Kolkata");
const Joi = require('@hapi/joi');
var crypto = require('crypto');
const _ = require('lodash');

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: { type: String },
    mobileNumber: { 
        type: String, 
        unique: true, 
        required: true 
    },
    email: { 
        type: String, 
        unique: "Email Id is already in use", 
        required: true
    },
    address: { 
        type: String 
    },
    state: { 
        type: String 
    },
    city: { 
        type: String 
    },
    pinCode: { 
        type: String 
    },
    picture: { 
        type: String,
        default:'default.png' 
    },
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
    role: {
        type: String,
        enum: ['admin', 'guestUser'],
        default: 'admin'
    },
    allowLogin: {
        type: Boolean,
        default:true
    },
    timezone : {
        type: String,
        default: function () {
            return this.country == "India" ? 'Asia/Kolkata' : 'Asia/Bangkok';
        }
    },
    country: { type: String, default: 'India'}
}, { collection: 'adminMaster' });

userSchema.pre('save', function(next) {
    this.email = this.email.toLowerCase()
    if (!this.isModified('password')) {
      return next()
    } else {
  
      try {
  
        const SALT_FACTOR = '5' 
        const hash = crypto.pbkdf2Sync(this.password, SALT_FACTOR,  
        1000, 64, `sha512`).toString(`hex`); 
  
        this.password = hash
        next()
  
      }
      catch(err){
        next(err)
      }
    }
  });
  
  userSchema.methods.validPassword = function(password) { 
      var hash = crypto.pbkdf2Sync(password,  
      '5', 1000, 64, `sha512`).toString(`hex`); 
      return this.password === hash; 
  }; 


  userSchema.pre('findOneAndUpdate', function (next) {
    const SALT_FACTOR = '5';

    const password = _.get(this._update, '$set.password', false)
  
    if (password) {
  
      try {
  
        const hash = crypto.pbkdf2Sync(password, SALT_FACTOR,
          1000, 64, `sha512`).toString(`hex`);
  
        this._update.password = hash
        next()
  
      }
      catch (err) {
        next(err)
      }
  
    } else {
      return next()
    }
  
  });

// we need to create a model using it
module.exports = db.commonDb.model('adminMaster', userSchema);