const http = require('http')
const fs = require('fs')
const express = require('express');
const path = require('path');
const logger = require('morgan');
const proxy = require('express-http-proxy');
const fileUpload = require('express-fileupload');
var flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hsts = require('hsts')
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const nunjucks  = require('nunjucks');
const cookieSession = require('cookie-session');
const  bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


const envPath = path.join(__dirname, './.env')
const dotenv = require('dotenv');
const result = dotenv.config({ path: envPath });
//var Router = require('./routes/router');
const app = express();

app.use(logger('dev'));
app.use(cors());

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Helmet for hearder protection.
// Data Sanitization against XSS attacks
app.use(xss());
// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
app.use(cookieSession({
    name: 'session',
    keys: ["schoolmanagement"],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(flash());
app.use(fileUpload());

app.use(helmet.xssFilter());
app.use(
    helmet.hsts({
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    })
);


//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
nunjucks.configure('webAccess/views', {
  autoescape: false,
  express   : app,
  watch: true
});
app.set('view engine', 'html');



app.use('/MADMIN', proxy('localhost:' + 8003));
app.use('/MWEB', proxy('localhost:' + 8004));


var WebAccessControllers = require('./webAccess/controller/index')();
require('./webAccess/routes/index')(app, WebAccessControllers);


app.use(express.static(path.join(__dirname, 'dist')));
app.use(errorHandler)

module.exports = app;
