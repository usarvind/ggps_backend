
const moment = require('moment-timezone');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
//const cookieSession = require('cookie-session');

const logger = require('morgan');
const xss = require('xss-clean');
const helmet = require('helmet');
const cors = require('cors');
// const { auth } = require('firebase-admin');
// const csrf = require('csurf')
const authMiddleware = require('../../middlewares/auth');
const loginRouter = require('./controller/loginController');
const cronDBController = require('./controller/cronDB_BKP_Controller');
const errorHandler = require('../../middlewares/errorHandler');
moment.tz.setDefault("Asia/Kolkata");
 
const app = express();
const router = express.Router();

logger.token('rawBody', function (req, res) {
  return req.rawBody;
});
app.use(logger(':date\t:remote-addr\t:method\t:url\t:rawBody\t:status\t:res[content-length]\t:response-time ms\t:req[authorization]'));

app.use(cookieParser());
const corsOptions = {
  //origin: 'https://hnjhmsidev01.tatatechnologies.com',
  //methods: "GET,PUT,POST,DELETE",
}
app.use(cors(corsOptions))
// Helmet for hearder protection.
app.use(helmet());
// Data Sanitization against XSS attacks
app.use(xss());
// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
// app.use(cookieSession({
//   name: 'session',
//   keys: ["schoolmanagement"],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
  limit: "50mb"
}));

// app.use(cookieParser("MYSECRATEKEY@#"));
app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'BSK_KomatsuI@123#',
//   proxy: true,
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     secure: false,
//     httpOnly: true
//   }
// }))

/*app.use(requestValidator)
app.use(csrf())
app.use(function (req, res, next) {
  req.session.csrf=req.csrfToken()
  next();
})*/
app.get('/complaint/status', (req, res) => {
  //req.session.name='rajeev'
  res.status(200).end();
});
app.use('/login', loginRouter);

app.use(errorHandler)

module.exports = app;
