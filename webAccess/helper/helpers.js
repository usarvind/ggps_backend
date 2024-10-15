var sha224 = require('js-sha256').sha224;
var CryptoJS = require("crypto-js");
var nodemailer = require('nodemailer');
var AES = CryptoJS.AES;

module.exports.gameNumber = function (length) {
    var chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
module.exports.randomString = function (length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

module.exports.addStringInStd = function (std) {
    let result="";
    switch(std){
        case 'KG':
            result='KG';
            break;
        case 'LKG':
            result='LKG';
            break;
        case 'UKG':
            result='UKG';
            break;
        case '1':
            result='1st';
            break;
        case '2':
            result='2nd';
            break;
        case '3':
            result='3rd';
            break;
        default:
            result=std+'th';            
    }
    return result;
};



module.exports.getAllSubjectSequenceList = function (subjectName) {
    let months=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    return months;
};


module.exports.transactionId = function (length) {
    length = length-2;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    let yr= new Date();
    let yy = yr.getYear();
    yy=yy-100;
    return yy+result;
};

module.exports.registrationNoGenerate =async function (length=9) {
    length = length-2;
    var chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    let yr= new Date();
    let yy = yr.getYear();
    yy=yy-100;
    return yy+result;
};

module.exports.roundNumber = function () {
    return Math.random();
};
module.exports.gameHash = function (roundNumber, hashSalt) {
    return sha224(roundNumber + hashSalt);
};
module.exports.randomOnlyNumber = function (length) {
    var chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
module.exports.randomNumber = function (length) {
    var chars = '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

    return result;
};
module.exports.getNumber = function (length) {
    var chars = '3456';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

    return result;
};
module.exports.getRandomFloat = function (min, max) {
    var float_val = Math.random() * (max - min) + min;
    return float_val.toFixed(2);
};
module.exports.getRandomInt = function (min, max) {
    var reandomNo = Math.floor(Math.random() * (max - min + 1) + min);
    return reandomNo;
};
module.exports.getRandomNumArray = function (items) {
    return items[Math.floor(Math.random() * items.length)];
};
module.exports.randomFloat = function () {
    return Math.random();
};
module.exports.encryptHash = function (data, key) {
    let ciphertext = AES.encrypt(JSON.stringify(data), key);
    return ciphertext.toString();
};
module.exports.decryptHash = function (ciphertext, key) {
    let bytes = AES.decrypt(ciphertext, key);
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};
module.exports.createSecretkey = function (data) {
    let secretKey = CryptoJS.SHA256(data);
    return secretKey.toString();
};
module.exports.hmacSha256create = function (data, key) {
    let hash = CryptoJS.HmacSHA256(data, key);
    return hash.toString();
};


//Start: Comman Funcation

//Start: Start Create User Transaction.
module.exports.AddNewTransaction = async function (model, config, insertData) {
    await model.TransactionMaster.create(insertData);
    return true;
}

module.exports.BulkAddNewTransaction = async function (model, config, insertData) {
    await model.TransactionMaster.bulkCreate(insertData);
    return true;
}
//End: Start Create User Transaction.

//Start: Send Eamil 
module.exports.sendEmail = async function (mailOptions) {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'node1@aistechnolabs.co.uk',
                pass: 'AIS@#!@#$!@SW'
            }
        });
        var send = await transporter.sendMail(mailOptions);
        if (send) {
            return ({ status: "success", message: "Email Successfully Send." });
        } else {
            return ({ status: "error", message: "Email not send." });
        }
    } catch (err) {
        console.log("forgot password: ", err);
        return ({ status: "error", message: "something went wrong." });
    }
};
//End: Send Eamil



module.exports.getSubjectKey = function (subjectName) {
    return (subjectName.replace(/[^a-zA-Z0-9]/g, ''));
};



module.exports.getAllClassList = function (subjectName) {
    let classes=[{
        key:"KG",
        value:"KG",

    },
    {
        key:"LKG",
        value:"LKG",

    },
    {
        key:"UKG",
        value:"UKG",

    },
    {
        key:"1st Class",
        value:"1",

    },
    {
        key:"2nd Class",
        value:"2",

    },
    {
        key:"3rd Class",
        value:"3",

    },
    {
        key:"4th Class",
        value:"4",

    },
    {
        key:"5th Class",
        value:"5",

    },
    {
        key:"6th Class",
        value:"6",

    },
    {
        key:"7th Class",
        value:"7",

    },
    {
        key:"8th Class",
        value:"8",

    },
    {
        key:"9th Class",
        value:"9",

    },
    {
        key:"10th  Class",
        value:"10",

    },
    {
        key:"11th Class",
        value:"11",

    },
    {
        key:"12th Class",
        value:"12",

    }

   ]
   return classes;
};

module.exports.getPromotedClass = function (crntClass,perct) {
    let classes=[{
        key:"KG",
        value:"KG",

    },
    {
        key:"LKG",
        value:"LKG",

    },
    {
        key:"UKG",
        value:"UKG",

    },
    {
        key:"1st",
        value:"1",

    },
    {
        key:"2nd",
        value:"2",

    },
    {
        key:"3rd",
        value:"3",

    },
    {
        key:"4th",
        value:"4",

    },
    {
        key:"5th",
        value:"5",

    },
    {
        key:"6th",
        value:"6",

    },
    {
        key:"7th",
        value:"7",

    },
    {
        key:"8th",
        value:"8",

    },
    {
        key:"9th",
        value:"9",

    },
    {
        key:"10th",
        value:"10",

    },
    {
        key:"11th",
        value:"11",

    },
    {
        key:"12th",
        value:"12",

    }

   ];

   //console.log("crntClass : "+crntClass+" : perct : "+perct)

   let ind= classes.findIndex((ele)=>ele.value==crntClass);
   console.log("crntClass : "+crntClass+" : perct : "+perct+" :ind :"+ind)

   if(ind<0){
    return '';
   }else{
    if(perct<35){
        return classes[(ind*1)].key;
    }else{
        return classes[(ind*1+1)].key;
    }
    
   }
  
};

module.exports.getStudentRemark = function (per) {
    let remarks="";
    if(per<35){
       remarks='-';
    }else if(per>=35 && per<=59.99){
       remarks='Good';
    }else if(per>=60 && per<=74.99){
       remarks='Very Good';
    }else if(per>=75 ){
       remarks='Excellent';
    }else{
       remarks='-';
    }
    
    return remarks;
  
};

module.exports.getStudentResult = function (per) {
    let result="";
    if(per<35){
       result='Failed';
    }else{
       result='Passed';
    }
    
    return result;
  
};


module.exports.getStudentDivision = function (per) {
    let result="";
    if(per<35){
       result='-';
    }else if(per>=35 && per <=44.99){
       result='Third';
    }else if(per>=45 && per <=59.99){
        result='Second';
    }else if(per>=60 && per <=74.99){
        result='First';
    }else{
        result='Distinction';
    }
    
    return result;
  
};

module.exports.getAllTransMonthList = function (subjectName) {
    let months=[{
        key:"April",
        value:"3",

    },
    {
        key:"May",
        value:"4",

    },
    {
        key:"June",
        value:"5",

    },
    {
        key:"July",
        value:"6",

    },
    {
        key:"August",
        value:"7",

    },
    {
        key:"September",
        value:"8",

    },
    {
        key:"October",
        value:"9",

    },
    {
        key:"November",
        value:"10",

    },
    {
        key:"December",
        value:"11",

    },
    {
        key:"january",
        value:"0",

    },
    {
        key:"February",
        value:"1",

    },
    {
        key:"March",
        value:"2",

    },
    
   ]
   return months;
};



module.exports.subjectGrade = function (totalMark=0,markObtain) {
    totalMark=((totalMark)?totalMark:0);
    markObtain=((markObtain)?markObtain:0);
    let per=0;
    if((markObtain*100)>0){
        per=((markObtain*100)/totalMark);
    }
    
    let grade="";
    if(per<=39){
       grade='F';
    }else if(per>=40 && per<=44){
       grade='C';
    }else if(per>=45 && per<=49){
       grade='C+';
    }else if(per>=50 && per<=54){
       grade='B';
    }else if(per>=55 && per<=59){
       grade='B+';
    }else if(per>=60 && per<=69){
       grade='A';
    }else if(per>=70 && per<=100){
       grade='A+';
    }else{
       grade='NA';
    }
    console.log("----------totalMark -------- : "+totalMark+" :markObtain :"+markObtain+" grade :"+grade +" percentage : "+per)
    return grade;
};