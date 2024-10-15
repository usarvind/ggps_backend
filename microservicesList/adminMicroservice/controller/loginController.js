const route = require('express').Router();
const Token = require('../../../middlewares/tokenGenerator')
const commonMsg = require('../../../utils/commonResponse')
const validator = require('../apiValidator/validation');
const { validationResult } = require('express-validator');


// route.post('/addComplaint', validator.checkUserFields, validator.checkVehicleFields, validator.checkTyreTubeFlapFields, (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     next({
//       "status": 400,
//       "msg": "Invalid Inputs",
//       "errors": errors.array()
//     });
//     return;
//   }

module.exports = route;
