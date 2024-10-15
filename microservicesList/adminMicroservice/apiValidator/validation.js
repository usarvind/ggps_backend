const { check, sanitizeBody } = require('express-validator');
const reg = require('../../../utils/constants');

module.exports = {

  checkStudentMasterFields: [
    check('firstName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('first name'),

    check('lastName').optional(),

    check('IdType').optional(),

    check('IdNo').optional(),

    check('gender').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase select gender'),
    
    check('dob').optional(),
    // .isAlphanumeric().withMessage('valid date of birth'),

    check('religion').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter religion'),
    
    check('joiningDate').optional(),
    // .isAlphanumeric().withMessage('valid date of joining'),

    check('mobileNo').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('mobile number')
      .custom(value => {
        if (value == "" || value == null || value == "null" || (reg.regex.mobileNumberRegex.test(value))) {
          return true
        } else {
          return false // ...or custom validation of unsupported country postal code
        }
      }).withMessage('mobile number'),

    check('email').optional(),

    check('fatherName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter fatherName'),

    check('fatherOccupation').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter father occupation'),

    check('fatherMobileNo').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('Father mobile number')
      .custom(value => {
        if (value == "" || value == null || value == "null" || (reg.regex.mobileNumberRegex.test(value))) {
          return true
        } else {
          return false // ...or custom validation of unsupported country postal code
        }
    }).withMessage('Father mobile number'),

    check('fatherEmail').optional(),
    check('motherName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter motherName'),
    check('motherOccupation').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter mother occupation'),
    check('motherMobile').optional(),
    check('motherEmail').optional(),


    check('parentAddress').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('address')
      .isLength({
        max: 500
    }).withMessage('Address should be less than 500 characters'),
    
    check('parentAddress').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('address')
      .isLength({
        max: 500
    }).withMessage('Address should be less than 500 characters'),

  ],
  checkStudentMasterUpdateFields:[
    
    check('firstName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('first name'),

    check('lastName').optional(),

    check('IdType').optional(),

    check('IdNo').optional(),

    check('gender').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase select gender'),
    
    check('dob').optional(),
    // .isAlphanumeric().withMessage('valid date of birth'),

    check('religion').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter religion'),
    
    check('joiningDate').optional(),
    // .isAlphanumeric().withMessage('valid date of joining'),

    check('mobileNo').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('mobile number')
      .custom(value => {
        if (value == "" || value == null || value == "null" || (reg.regex.mobileNumberRegex.test(value))) {
          return true
        } else {
          return false // ...or custom validation of unsupported country postal code
        }
      }).withMessage('mobile number'),

    check('email').optional(),

    check('fatherName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter fatherName'),

    check('fatherOccupation').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter father occupation'),

    check('fatherMobileNo').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('Father mobile number')
      .custom(value => {
        if (value == "" || value == null || value == "null" || (reg.regex.mobileNumberRegex.test(value))) {
          return true
        } else {
          return false // ...or custom validation of unsupported country postal code
        }
    }).withMessage('Father mobile number'),

    check('fatherEmail').optional(),
    check('motherName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter motherName'),
    check('motherOccupation').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter mother occupation'),
    check('motherMobile').optional(),
    check('motherEmail').optional(),


    check('parentAddress').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('address')
      .isLength({
        max: 500
    }).withMessage('Address should be less than 500 characters'),
    
    check('parentAddress').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('address')
      .isLength({
        max: 500
    }).withMessage('Address should be less than 500 characters'),
  ],


  
  checkStudentAcademicMasterFields:[
    check('GRNo').optional(),
    check('academicYear').optional(),
    check('selectClass').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase select class'),
    check('section').optional(),
    check('admissionFees').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter admission fees'),
    check('monthly_fees[]').optional(),
    check('currentYearMonthFees').optional(),
    check('previousYearBal').optional(),

    check('transportmonths[]').optional(),
    check('transportfeesmonths').optional(),

    check('examfeesmonths[]').optional(),
    check('examfees').optional(),

  ],

  checkStudentAcademicMasterUpdateFields:[
    check('GRNo').optional(),
    check('academicYear').optional(),
    check('selectClass').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase select class'),
    check('section').optional(),
    check('admissionFees').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('plase enter admission fees'),
    check('monthly_fees[]').optional(),
    check('currentYearMonthFees').optional(),
    check('previousYearBal').optional(),

    check('transportmonths[]').optional(),
    check('transportfeesmonths').optional(),

    check('examfeesmonths[]').optional(),
    check('examfees').optional(),

  ],
  checkSubjectAddFields:[
    check('subjectName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('Enter subject name'),

    check('selectClass').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('Select class name'),
  ],
  checkSubjectUpdateFields:[
    check('subjectName').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('Enter subject name'),

    check('selectClass').exists({
      checkNull: true,
      checkFalsy: true,
    }).withMessage('Select class name'),
  ],

  checkAdminProfilePassChange:[
    check('oldpassword').trim()
    .isLength({min:1, max:16})
    // Custom message
    .withMessage('Password must be between 1 to 16 characters')
 
    // Validate confirmPassword
    .custom(async (oldpassword, {req}) => {
      const password = req.body.newpassword
 
      // If password and confirm password not same
      // don't allow to sign up and throw error
      if(password === oldpassword){
        throw new Error('Old password must not be same with new password')
      }
    })
    ,
    check('newpassword').trim().isLength({min:4, max:16}).withMessage('Enter new password name'),
    check('confirmpassword')
    .trim()
    .isLength({min:4, max:16})
    // Custom message
    .withMessage('Password must be between 4 to 16 characters')
 
    // Validate confirmPassword
    .custom(async (confirmpassword, {req}) => {
      const password = req.body.newpassword
 
      // If password and confirm password not same
      // don't allow to sign up and throw error
      if(password !== confirmpassword){
        throw new Error('New password must be same as confirm')
      }
    })

  ],
}
