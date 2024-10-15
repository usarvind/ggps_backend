module.exports = errorHandler;
const utils = require("../utils/utils")
const constants = require("../utils/constants")
function errorHandler(err, req, res, next) {
    if (err) console.error("Error logged in middleware : ", err);

    if (typeof (err) === 'string') {
        // custom application error
        // return res.status(400).json({ "status": 0, "msg": err, "success": false, "errors": err.errors || [] });
        return res.status(400).json({ "status": 0, "msg": err, data:[] });
    } else if (err.msg == 'Invalid Inputs' && err.errors) {
        let msg = "Please enter valid ", fields = [];
        err.errors.forEach(element => {
            var field = element.msg.trim();
            // field = utils.camelizeSeperator(field);
            // field = field.replace(constants.regex.camelCaseSeperatorRegex, '$1 $2');
            fields.push(field);
        });
        return res.status(400).json({
            "status": 400,
            "success": false,
            "msg": msg + fields.join(", "),
            "errors": err.errors || []
        })
    } else {
        if (err && err.name && err.name == 'ValidationError') {
            return res.status(400).json({
                "status": 0,
                "success": false,
                "msg": err._message,
                "errors": err.errors || []
            })
        } else if (err && (err.errors && err.errors.name && err.errors.name === 'MongoError') || (err.name === 'MongoError')) {
            if ((err.errors && err.errors.code === 11000) || err.code === 11000) {
                err = err.errors ? err.errors : err;
                var field = err.msg ? err.msg.split(":")[2] : err.errmsg.split(":")[2];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));
                field = field.trim();
                field = utils.camelizeSeperator(field);
                field = field.replace(constants.regex.camelCaseSeperatorRegex, '$1 $2');
                var value = err.msg ? err.msg.split(":")[4].split('"')[1] : err.errmsg.split(":")[4].split('"')[1];
                if (field == "Pin Codes.pin Code") field = "Pincode";
                return res.status(400).json({
                    "status": 0,
                    "success": false,
                    "msg": field + ' ' + value + ' already exists',
                    "errors": err.errors || []
                })
            } else {
                return res.status(500).json({
                    "status": 0,
                    "msg": 'Internal server error',
                    "success": false,
                    "errors": err.errors || []
                })
            }
        } else if (err && err.errors && err.errors.code == 'AccessDenied') {
            res.status(err.statusCode || 500).json({
                "status": 0,
                "msg": "Cant upload file now please remove file and try again.",
                "success": false,
                "errors": err.errors || []
            });
        } else if (err.errors != undefined && err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(422).json({ "msg": 'Invalid Token', "errors": [], "success": false });
        } else if (err.statusCode) {
            // custom application error
            return res.status(err.statusCode).json({ "status": err.statusCode, "msg": err, "errors": [], "success": false });
        } else {
            res.status(err.status || 500).json({
                "status": 0,
                "msg": err.msg || "Internal Server Error",
                "errors": err.errors || [],
                "success": false
            });
        }
    }
}