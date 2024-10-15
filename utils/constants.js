const path = require('path');
const envPath = path.join(__dirname, '../.env')
const dotenv = require('dotenv');
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.log(result.error);
};
const constant = {};

constant.Prefix = {
    User: "user_",
}

constant.JwtSecret = {
    crmJwtSecret: process.env.crmJwtSecret,
    cvfleetJwtSecret: process.env.cvfleetJwtSecret,
    pvfleetJwtSecret: process.env.pvfleetJwtSecret,
    aqsJwtSecret: process.env.aqsJwtSecret,
    cdJwtSecret: process.env.cdJwtSecret,
}

constant.bcc_recipients = ['arvind.k@tatatechnologies.com']
constant.ExternalURL = {
}

//sms and email credentials 
constant.awsSesConfig = {
    region: "eu-west-1",
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
}
constant.smtp = {
    //172.28.2.104
    from: 'no-reply@apollotyres.com',
    host: 'hnjfe01.tatatechnologies.com',
    port: 25
}
constant.config = {
    arn: process.env.arn,
    version: 'latest',
    accessKeyId: process.env.configAccessKeyId,
    secretAccessKey: process.env.configSecretAccessKey,
    region: 'ap-southeast-1'
}
constant.sapAuthKey=process.env.sapAuthKey
constant.sapApiHost=process.env.sapApiHost
constant.regex = {
    "randomPasswordRegex": /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[(!@#$%&*()?)]){1,})(?!(.*[(^_+~`|}{\:;><,.\[\]\/=\-)]))(?!.*\s).{8,8}$/,
    "checkWhiteSpaceRegex": /^(?!\S*$).+/,
    "mobileNumberRegex": /^[0-9]{10}$/,
    "pincode": /^[0-9]{6}$/,
    "numberRegex": /^[0-9]+$/,
    "bloodGroupRegex": /^(A|B|AB|O)[+-]$/,
    "usernameRegex": /^[a-zA-Z0-9_\-]{5,15}$/,
    "passwordRegex": /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{12,}$/,
    "sampleTextRegex": /^[a-zA-Z0-9- ,_.?!$()]*$/,
    "textSpaceRegex": /^[a-zA-Z\s]*$/,
    "camelCaseSeperatorRegex": /([a-z])([A-Z])/g,
    "camelCaseRegex": /\W+(.)/g,
    "gstin": /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
    "alphaNumSpace": /^(?=.*[A-Za-z0-9])[A-Za-z0-9 ]*$/,
    "alphaNumSpaceDash": /^(?=.*[A-Za-z0-9])[A-Za-z0-9 \-]*$/,
    "alphaSpace": /^(?=.*[A-Za-z])[A-Za-z ]*$/,
    "alpha": /^(?=.*[A-Za-z])[A-Za-z]*$/,
    "alphaNum": /^(?=.*[A-Za-z0-9])[A-Za-z0-9]*$/,
    "alphaNumSpecialSpace": /^(?=.*[A-Za-z0-9])[A-Za-z0-9 \&\(\)\@\/\\,+".:_\-\'\?]*$/,
    "alphaNumSpecial1": /^(?=.*[A-Za-z0-9])[A-Za-z0-9/.]*$/,
    "alphaNumSpecial2": /^(?=.*[A-Za-z0-9])[A-Za-z0-9 \&\+\(\)\/\\,\.\_\-\']*$/, /* \/.\-_ */
    "alphaNumSpecial2CAP": /^(?=.*[A-Z0-9])[A-Z0-9 \&\+\(\)\/\\,\.\_\-\']*$/, /* \/.\-_ */
    "alphaNumSpecial3": /[A-Za-z0-9\/\.\_\-]/,
    "textFieldRegex": /^(?=.*[A-Za-z0-9])[A-Za-z0-9 \_\!\@\#\$\%\^\&\*\-\.\:\;\<\>\?\=\+\/\\\"\'\,\(\)\{\}]*$/,
    // "sizeRD" : /^(?=.*[A-Za-z])[A-Za-z \/\-_]*$/,
    "sizeRD": /^[A-Za-z \/\-_]{1,1}/,
    "numSpace": /^[0-9 ]*$/,
    "num": /^[0-9]*$/,
    "numFloat": /^[-+]?[0-9]*\.?[0-9]+$/,
    "numSpaceDash": /^[0-9]{10}$/,
    // "numSpaceDash": /^[0-9-]*$/,
    "whiteSpace": /^(?! )[A-Za-z0-9 \_\!\@\#\$\%\^\&\*\-\.\:\;\<\>\?\=\+\/\\\"\'\,\(\)\{\}]*(?<! )$/,
    // "whiteSpace":/[^-\s]/,
    "singleWhiteSpace": /\S/,
    "vehicleRegistrationRegex": /(([A-Z]){2,3}(|-)([0-9]){1,2}(|-)([A-Z]){1,3}(|-)([0-9]){1,4})|(([A-Z]){2,3}(|-)([0-9]){1,4})/,
    "atla": /A(I|F|C|O)\d{5,13}$/,
    "crmt": /T(B|F|P|V|C|W|R|O|E|A)\d{10,13}$/,
    "atlc": /CI\d{10,13}$/,
    "crml": /LD\d{10,13}$/,
    "crmThcId": /CRMTHC\d{10,13}$/,
    "crmCseId": /ATLCSE\d{13}$/,
    "isfloat": /^[+-]?\d+(\.\d+)?$/,
    "alphaSpecialChar": /^[ A-Za-z0-9_@./#&+-]*$/,
    "emailRegex": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "pvfCodeRegex": /^(PVF)[A-Z]{3}$/,
    "cvfCodeRegex": /^(CVF)[A-Z]{3}$/,
    "avfCodeRegex": /^(AVF)[A-Z]{3}$/,
};
module.exports = constant;